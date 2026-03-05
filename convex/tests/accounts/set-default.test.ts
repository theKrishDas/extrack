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
 * Bypasses business logic — use for ownership/state edge cases.
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
      is_default: false,
      name: "Test Account",
      startingBalance: 0,
      currentBalance: 0,
      icon: "X",
    })
  )
}

/**
 * Returns a valid Id<"accounts"> that no longer exists in the DB.
 */
function getDeletedAccountId(t: TestConvex<typeof schema>, ownerId: string) {
  return t.run(async (ctx) => {
    const id = await ctx.db.insert("accounts", {
      ownerId,
      is_active: true,
      is_default: false,
      name: "Temp",
      startingBalance: 0,
      currentBalance: 0,
      icon: "X",
    })
    await ctx.db.delete(id)
    return id
  })
}

/**
 * Reads the defaultAccount from the user row for the given subject.
 */
function getDefaultAccountId(t: TestConvex<typeof schema>, subject: string) {
  return t.run(async (ctx) => {
    const user = await ctx.db
      .query("user")
      .withIndex("by_owner", (q) => q.eq("ownerId", subject))
      .unique()

    if (!user) throw new Error(`User not found for subject: ${subject}`)
    return user.defaultAccount
  })
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("accounts.setDefault", () => {
  // -------------------------------------------------------------------------
  // Auth guards
  // -------------------------------------------------------------------------

  describe("auth", () => {
    test("throws UNAUTHENTICATED when called without a Clerk identity", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t)

      await expect(
        t.mutation(api.accounts.setDefault, { id: accountId })
      ).rejects.toThrowError("UNAUTHENTICATED")
    })

    test("throws USER_NOT_STORED when identity exists but user was never onboarded", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t)

      await expect(
        t.withIdentity(userIdentity).mutation(api.accounts.setDefault, {
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
      await asUser.mutation(internal.users.onboard, {
        userId: userIdentity.subject,
      })

      const deletedId = await getDeletedAccountId(t, userIdentity.subject)

      await expect(
        asUser.mutation(api.accounts.setDefault, { id: deletedId })
      ).rejects.toThrowError("Account not found.")
    })
  })

  // -------------------------------------------------------------------------
  // Ownership
  // -------------------------------------------------------------------------

  describe("ownership", () => {
    test("throws when account belongs to a different user", async () => {
      const t = convexTest(schema)

      await t.withIdentity(userIdentity).mutation(internal.users.onboard, {
        userId: userIdentity.subject,
      })
      await t.withIdentity(otherUserIdentity).mutation(internal.users.onboard, {
        userId: otherUserIdentity.subject,
      })

      const otherAccountId = await seedAccount(t, {
        ownerId: otherUserIdentity.subject,
      })

      await expect(
        t.withIdentity(userIdentity).mutation(api.accounts.setDefault, {
          id: otherAccountId,
        })
      ).rejects.toThrowError(
        "Account does not belong to the authenticated user."
      )
    })
  })

  // -------------------------------------------------------------------------
  // Active account guard
  // -------------------------------------------------------------------------

  describe("active account guard", () => {
    test("throws when setting an inactive account as default", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.users.onboard, {
        userId: userIdentity.subject,
      })

      const inactiveAccountId = await seedAccount(t, { is_active: false })

      await expect(
        asUser.mutation(api.accounts.setDefault, { id: inactiveAccountId })
      ).rejects.toThrowError("Cannot set an inactive account as default.")
    })
  })

  // -------------------------------------------------------------------------
  // Idempotency
  // -------------------------------------------------------------------------

  describe("idempotency", () => {
    test("returns the account id without a write when account is already the default", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.users.onboard, {
        userId: userIdentity.subject,
      })

      const currentDefault = await getDefaultAccountId(t, userIdentity.subject)

      const result = await asUser.mutation(api.accounts.setDefault, {
        id: currentDefault,
      })

      expect(result).toBe(currentDefault)
      // default should be unchanged
      expect(await getDefaultAccountId(t, userIdentity.subject)).toBe(
        currentDefault
      )
    })
  })

  // -------------------------------------------------------------------------
  // Set default logic
  // -------------------------------------------------------------------------

  describe("set default logic", () => {
    test("updates user defaultAccount to the given account id", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.users.onboard, {
        userId: userIdentity.subject,
      })

      const newAccountId = await seedAccount(t)

      await asUser.mutation(api.accounts.setDefault, { id: newAccountId })

      expect(await getDefaultAccountId(t, userIdentity.subject)).toBe(
        newAccountId
      )
    })

    test("returns the account id on success", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.users.onboard, {
        userId: userIdentity.subject,
      })

      const newAccountId = await seedAccount(t)

      const result = await asUser.mutation(api.accounts.setDefault, {
        id: newAccountId,
      })

      expect(result).toBe(newAccountId)
    })

    test("can switch default back to the original account", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.users.onboard, {
        userId: userIdentity.subject,
      })

      const originalDefault = await getDefaultAccountId(t, userIdentity.subject)
      const newAccountId = await seedAccount(t)

      await asUser.mutation(api.accounts.setDefault, { id: newAccountId })
      await asUser.mutation(api.accounts.setDefault, { id: originalDefault })

      expect(await getDefaultAccountId(t, userIdentity.subject)).toBe(
        originalDefault
      )
    })
  })

  // -------------------------------------------------------------------------
  // Isolation
  // -------------------------------------------------------------------------

  describe("isolation", () => {
    test("changing one user's default does not affect another user's default", async () => {
      const t = convexTest(schema)

      await t.withIdentity(userIdentity).mutation(internal.users.onboard, {
        userId: userIdentity.subject,
      })
      await t.withIdentity(otherUserIdentity).mutation(internal.users.onboard, {
        userId: otherUserIdentity.subject,
      })

      const otherOriginalDefault = await getDefaultAccountId(
        t,
        otherUserIdentity.subject
      )
      const myNewAccount = await seedAccount(t, {
        ownerId: userIdentity.subject,
      })

      await t.withIdentity(userIdentity).mutation(api.accounts.setDefault, {
        id: myNewAccount,
      })

      expect(await getDefaultAccountId(t, otherUserIdentity.subject)).toBe(
        otherOriginalDefault
      )
    })
  })
})
