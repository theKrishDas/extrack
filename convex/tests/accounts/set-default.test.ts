import { convexTest } from "convex-test"
import { describe, expect, test } from "vitest"
import { api, internal } from "../../_generated/api"
import schema from "../../schema"
import {
  getDefaultAccountId,
  getDeletedAccountId,
  seedAccount,
} from "../helpers"

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

describe("accounts.setDefault", () => {
  // -------------------------------------------------------------------------
  // Auth guards
  // -------------------------------------------------------------------------

  describe("auth", () => {
    test("throws UNAUTHENTICATED when called without a Clerk identity", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t)

      await expect(
        t.mutation(api.account.setDefault, { id: accountId })
      ).rejects.toThrowError("UNAUTHENTICATED")
    })

    test("throws USER_NOT_STORED when identity exists but user was never onboarded", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t)

      await expect(
        t.withIdentity(userIdentity).mutation(api.account.setDefault, {
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

      const deletedId = await getDeletedAccountId(t)

      expect(
        asUser.mutation(api.account.setDefault, { id: deletedId })
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

      const otherAccountId = await seedAccount(t, {
        ownerId: otherUserIdentity.subject,
      })

      expect(
        t.withIdentity(userIdentity).mutation(api.account.setDefault, {
          id: otherAccountId,
        })
      ).rejects.toThrowError("DOCUMENT_NOT_OWNED")
    })
  })

  // -------------------------------------------------------------------------
  // Active account guard
  // -------------------------------------------------------------------------

  describe("active account guard", () => {
    test("throws when setting an inactive account as default", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })

      const inactiveAccountId = await seedAccount(t, { is_active: false })

      expect(
        asUser.mutation(api.account.setDefault, { id: inactiveAccountId })
      ).rejects.toThrowError("INACTIVE_ACCOUNT_CANNOT_BE_DEFAULT")
    })
  })

  // -------------------------------------------------------------------------
  // Idempotency
  // -------------------------------------------------------------------------

  describe("idempotency", () => {
    test("returns the account id without a write when account is already the default", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })

      const currentDefault = await getDefaultAccountId(t, userIdentity.subject)

      const result = await asUser.mutation(api.account.setDefault, {
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
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })

      const newAccountId = await seedAccount(t)

      await asUser.mutation(api.account.setDefault, { id: newAccountId })

      expect(await getDefaultAccountId(t, userIdentity.subject)).toBe(
        newAccountId
      )
    })

    test("returns the account id on success", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })

      const newAccountId = await seedAccount(t)

      const result = await asUser.mutation(api.account.setDefault, {
        id: newAccountId,
      })

      expect(result).toBe(newAccountId)
    })

    test("can switch default back to the original account", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })

      const originalDefault = await getDefaultAccountId(t, userIdentity.subject)
      const newAccountId = await seedAccount(t)

      await asUser.mutation(api.account.setDefault, { id: newAccountId })
      await asUser.mutation(api.account.setDefault, { id: originalDefault })

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

      const otherOriginalDefault = await getDefaultAccountId(
        t,
        otherUserIdentity.subject
      )
      const myNewAccount = await seedAccount(t, {
        ownerId: userIdentity.subject,
      })

      await t.withIdentity(userIdentity).mutation(api.account.setDefault, {
        id: myNewAccount,
      })

      expect(await getDefaultAccountId(t, otherUserIdentity.subject)).toBe(
        otherOriginalDefault
      )
    })
  })
})
