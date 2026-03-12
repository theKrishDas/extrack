import { convexTest } from "convex-test"
import { describe, expect, test } from "vitest"
import { api, internal } from "../../_generated/api"
import schema from "../../schema"
import { getDeletedAccountId, seedAccount } from "../helpers"

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

describe("accounts.getBalance", () => {
  describe("auth", () => {
    test("throws UNAUTHENTICATED when called without a Clerk identity", async () => {
      const t = convexTest(schema)

      await expect(
        t.query(api.account.getBalance, { account: "*" })
      ).rejects.toThrowError("UNAUTHENTICATED")
    })

    test("throws USER_NOT_STORED when identity exists but user was never onboarded", async () => {
      const t = convexTest(schema)

      await expect(
        t
          .withIdentity(userIdentity)
          .query(api.account.getBalance, { account: "*" })
      ).rejects.toThrowError("USER_NOT_STORED")
    })
  })

  describe("combined", () => {
    test("throws when no accounts exist", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })

      // Purge seed accounts created by onboarding
      await t.run(async (ctx) => {
        const accounts = await ctx.db
          .query("accounts")
          .withIndex("by_owner", (q) => q.eq("ownerId", userIdentity.subject))
          .collect()
        await Promise.all(accounts.map((a) => ctx.db.delete("accounts", a._id)))
      })

      await expect(
        asUser.query(api.account.getBalance, {
          account: "*",
        })
      ).rejects.toThrowError(
        "Internal invariant violated: user has no accounts"
      )
    })

    test("throws NOT_FOUND when account does not exist", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })

      const deletedId = await getDeletedAccountId(t)

      await expect(
        asUser.query(api.account.getBalance, { account: deletedId })
      ).rejects.toThrowError("DOCUMENT_NOT_FOUND")
    })

    test("returns sum of computed balance across all accounts", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })

      await t.run(async (ctx) => {
        const accounts = await ctx.db
          .query("accounts")
          .withIndex("by_owner", (q) => q.eq("ownerId", userIdentity.subject))
          .collect()
        await Promise.all(accounts.map((a) => ctx.db.delete("accounts", a._id)))
      })

      await seedAccount(t, {
        ownerId: userIdentity.subject,
        startingBalance: 0,
        netFlow: 1000,
      })
      await seedAccount(t, {
        ownerId: userIdentity.subject,
        startingBalance: 0,
        netFlow: 2500,
      })
      await seedAccount(t, {
        ownerId: userIdentity.subject,
        startingBalance: 0,
        netFlow: 500,
      })

      const result = await asUser.query(api.account.getBalance, {
        account: "*",
      })
      expect(result).toBe(4000)
    })

    test("does not include other users' accounts in the sum", async () => {
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

      await t.run(async (ctx) => {
        const accounts = await ctx.db
          .query("accounts")
          .withIndex("by_owner", (q) => q.eq("ownerId", userIdentity.subject))
          .collect()
        await Promise.all(accounts.map((a) => ctx.db.delete("accounts", a._id)))
      })

      await seedAccount(t, {
        ownerId: userIdentity.subject,
        startingBalance: 0,
        netFlow: 1000,
      })
      await seedAccount(t, {
        ownerId: otherUserIdentity.subject,
        startingBalance: 0,
        netFlow: 9999,
      })

      const result = await t
        .withIdentity(userIdentity)
        .query(api.account.getBalance, { account: "*" })
      expect(result).toBe(1000)
    })
  })

  describe("specific account", () => {
    test("throws when account id does not exist", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })

      const deletedId = await getDeletedAccountId(t)

      await expect(
        asUser.query(api.account.getBalance, { account: deletedId })
      ).rejects.toThrowError("DOCUMENT_NOT_FOUND")
    })

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

      await expect(
        t
          .withIdentity(userIdentity)
          .query(api.account.getBalance, { account: otherAccountId })
      ).rejects.toThrowError("DOCUMENT_NOT_OWNED")
    })

    test("returns computed balance for the specified account", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })

      const accountId = await seedAccount(t, {
        ownerId: userIdentity.subject,
        startingBalance: 0,
        netFlow: 3750,
      })

      const result = await asUser.query(api.account.getBalance, {
        account: accountId,
      })
      expect(result).toBe(3750)
    })

    test("returns 0 when computed balance is 0", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })

      const accountId = await seedAccount(t, {
        ownerId: userIdentity.subject,
        startingBalance: 0,
        netFlow: 0,
      })

      const result = await asUser.query(api.account.getBalance, {
        account: accountId,
      })
      expect(result).toBe(0)
    })

    test("returns negative balance when netFlow is negative", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })

      const accountId = await seedAccount(t, {
        ownerId: userIdentity.subject,
        startingBalance: 100,
        netFlow: -250,
      })

      const result = await asUser.query(api.account.getBalance, {
        account: accountId,
      })
      expect(result).toBe(-150)
    })

    test("correctly computes balance with non-zero startingBalance and netFlow", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })

      const accountId = await seedAccount(t, {
        ownerId: userIdentity.subject,
        startingBalance: 5000,
        netFlow: 1200,
      })

      const result = await asUser.query(api.account.getBalance, {
        account: accountId,
      })
      expect(result).toBe(6200)
    })
  })
})
