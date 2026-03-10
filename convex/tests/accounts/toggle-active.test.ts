import { convexTest, type TestConvex } from "convex-test"
import { describe, expect, test } from "vitest"
import { api, internal } from "../../_generated/api"
import schema from "../../schema"

// ---------------------------------------------------------------------------
// Identities
// ---------------------------------------------------------------------------

const userIdentity = {
  subject: "user_clerk_123",
  issuer: "https://clerk.dev",
  tokenIdentifier: "test_token_123",
} as const

const otherUserIdentity = {
  subject: "user_clerk_456",
  issuer: "https://clerk.dev",
  tokenIdentifier: "test_token_456",
} as const

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Seeds an account directly into the DB for the given ownerId.
 * Use only when you need an account that bypasses business logic
 * (e.g. to test ownership checks or non-existent IDs).
 */
function seedAccount(
  t: TestConvex<typeof schema>,
  opts: {
    ownerId?: string
    is_active?: boolean
  } = {}
) {
  return t.run((ctx) =>
    ctx.db.insert("accounts", {
      ownerId: opts.ownerId ?? userIdentity.subject,
      is_active: opts.is_active ?? true,
      is_archived: false,
      name: "Test Account",
      startingBalance: 0,
      netFlow: 0,
      icon: "X",
    })
  )
}

/**
 * Returns a valid Id<"accounts"> that no longer exists in the DB.
 * Insert-then-delete within a single t.run to avoid leaving orphan rows.
 */
function getDeletedAccountId(t: TestConvex<typeof schema>, ownerId: string) {
  return t.run(async (ctx) => {
    const id = await ctx.db.insert("accounts", {
      ownerId,
      is_active: true,
      is_archived: false,
      name: "Temp",
      startingBalance: 0,
      netFlow: 0,
      icon: "X",
    })
    await ctx.db.delete("accounts", id)
    return id
  })
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("accounts.toggleActive", () => {
  // -------------------------------------------------------------------------
  // Auth guards
  // -------------------------------------------------------------------------

  describe("auth", () => {
    test("throws UNAUTHENTICATED when called without a Clerk identity", async () => {
      const t = convexTest(schema)
      // Need a real account ID — no identity or onboarding needed for this path
      const accountId = await seedAccount(t)

      await expect(
        t.mutation(api.account.toggleActive, { id: accountId })
      ).rejects.toThrowError("UNAUTHENTICATED")
    })

    test("throws USER_NOT_STORED when identity exists but user was never onboarded", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t)

      // Has Clerk identity, but internal.userOnboarding.onboardUser was never called
      await expect(
        t.withIdentity(userIdentity).mutation(api.account.toggleActive, {
          id: accountId,
        })
      ).rejects.toThrowError("USER_NOT_STORED")
    })
  })

  // -------------------------------------------------------------------------
  // Account existence
  // -------------------------------------------------------------------------

  describe("account existence", () => {
    test("throws when account id does not exist", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })

      const deletedId = await getDeletedAccountId(t, userIdentity.subject)

      expect(
        asUser.mutation(api.account.toggleActive, { id: deletedId })
      ).rejects.toThrowError("DOCUMENT_NOT_FOUND")
    })
  })

  // -------------------------------------------------------------------------
  // Ownership
  // -------------------------------------------------------------------------

  describe("ownership", () => {
    test("throws when account belongs to a different user", async () => {
      const t = convexTest(schema)

      await t
        .withIdentity(userIdentity)
        .mutation(internal.userOnboarding.onboardUser, {
          userId: userIdentity.subject,
        })
      await t
        .withIdentity(otherUserIdentity)
        .mutation(internal.userOnboarding.onboardUser, {
          userId: otherUserIdentity.subject,
        })

      // Seed an account owned by otherUser directly — bypasses add mutation
      const otherAccountId = await seedAccount(t, {
        ownerId: otherUserIdentity.subject,
      })

      expect(
        t.withIdentity(userIdentity).mutation(api.account.toggleActive, {
          id: otherAccountId,
        })
      ).rejects.toThrowError("DOCUMENT_NOT_OWNED")
    })
  })

  // -------------------------------------------------------------------------
  // Default account protection
  // -------------------------------------------------------------------------

  describe("default account protection", () => {
    test("throws when attempting to deactivate the default account", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })

      // Get the default account created during onboarding
      const defaultAccountId = await t.run(async (ctx) => {
        const user = await ctx.db
          .query("user")
          .withIndex("by_owner", (q) => q.eq("ownerId", userIdentity.subject))
          .unique()

        if (!user)
          throw new Error(`User not found for subject: ${userIdentity.subject}`)

        if (!user.defaultAccount)
          throw new Error("User has no defaultAccountId")

        return user.defaultAccount
      })

      expect(
        asUser.mutation(api.account.toggleActive, { id: defaultAccountId })
      ).rejects.toThrowError("DEFAULT_ACCOUNT_MUST_BE_ACTIVE")
    })

    test("allows activating the default account if it is somehow inactive", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })

      // Force the default account into an inactive state directly
      const defaultAccountId = await t.run(async (ctx) => {
        const user = await ctx.db
          .query("user")
          .withIndex("by_owner", (q) => q.eq("ownerId", userIdentity.subject))
          .unique()

        if (!user)
          throw new Error(`User not found for subject: ${userIdentity.subject}`)

        if (!user.defaultAccount)
          throw new Error("User has no defaultAccountId")

        const id = user.defaultAccount
        await ctx.db.patch("accounts", id, { is_active: false })
        return id
      })

      const result = await asUser.mutation(api.account.toggleActive, {
        id: defaultAccountId,
      })

      expect(result).toBe(defaultAccountId)
      const updated = await t.run((ctx) => ctx.db.get(defaultAccountId))
      expect(updated?.is_active).toBe(true)
    })
  })

  // -------------------------------------------------------------------------
  // Toggle logic
  // -------------------------------------------------------------------------

  describe("toggle logic", () => {
    test("deactivates an active non-default account", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })

      const accountId = await seedAccount(t, { is_active: true })

      const result = await asUser.mutation(api.account.toggleActive, {
        id: accountId,
      })

      expect(result).toBe(accountId)
      const updated = await t.run((ctx) => ctx.db.get(accountId))
      expect(updated?.is_active).toBe(false)
    })

    test("activates an inactive non-default account", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })

      const accountId = await seedAccount(t, { is_active: false })

      const result = await asUser.mutation(api.account.toggleActive, {
        id: accountId,
      })

      expect(result).toBe(accountId)
      const updated = await t.run((ctx) => ctx.db.get(accountId))
      expect(updated?.is_active).toBe(true)
    })

    test("returns the account id after a successful toggle", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })

      const accountId = await seedAccount(t, { is_active: true })

      const result = await asUser.mutation(api.account.toggleActive, {
        id: accountId,
      })

      expect(result).toBe(accountId)
    })

    test("toggling twice restores the original active state", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })

      const accountId = await seedAccount(t, { is_active: true })

      await asUser.mutation(api.account.toggleActive, { id: accountId })
      await asUser.mutation(api.account.toggleActive, { id: accountId })

      const restored = await t.run((ctx) => ctx.db.get(accountId))
      expect(restored?.is_active).toBe(true)
    })
  })

  // -------------------------------------------------------------------------
  // Isolation
  // -------------------------------------------------------------------------

  describe("isolation", () => {
    test("toggling one user's account does not affect another user's account", async () => {
      const t = convexTest(schema)

      await t
        .withIdentity(userIdentity)
        .mutation(internal.userOnboarding.onboardUser, {
          userId: userIdentity.subject,
        })
      await t
        .withIdentity(otherUserIdentity)
        .mutation(internal.userOnboarding.onboardUser, {
          userId: otherUserIdentity.subject,
        })

      const myAccount = await seedAccount(t, {
        ownerId: userIdentity.subject,
        is_active: true,
      })
      const theirAccount = await seedAccount(t, {
        ownerId: otherUserIdentity.subject,
        is_active: true,
      })

      await t.withIdentity(userIdentity).mutation(api.account.toggleActive, {
        id: myAccount,
      })

      const theirAccountAfter = await t.run((ctx) => ctx.db.get(theirAccount))
      expect(theirAccountAfter?.is_active).toBe(true)
    })
  })
})
