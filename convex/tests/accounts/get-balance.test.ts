import { ConvexError } from "convex/values"
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
        t.query(api.accounts.getBalance, { account: "combined" })
      ).rejects.toThrowError("UNAUTHENTICATED")
    })

    test("throws USER_NOT_STORED when identity exists but user was never onboarded", async () => {
      const t = convexTest(schema)

      await expect(
        t
          .withIdentity(userIdentity)
          .query(api.accounts.getBalance, { account: "combined" })
      ).rejects.toThrowError("USER_NOT_STORED")
    })
  })

  describe("combined", () => {
    test.todo("throws when account does not exist", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.users.onboard, {
        userId: userIdentity.subject,
      })

      // Purge seed accounts created by onboarding
      await t.run(async (ctx) => {
        const accounts = await ctx.db
          .query("accounts")
          .withIndex("by_owner", (q) => q.eq("ownerId", userIdentity.subject))
          .collect()
        await Promise.all(accounts.map((a) => ctx.db.delete(a._id)))
      })

      await expect(
        asUser.query(api.accounts.getBalance, {
          account: "combined",
        })
        // err-code: 500
        // "Invariant violation: user must have at least one account. Verify onboarding setup and mutation guards."
      ).rejects.instanceOf(ConvexError)
    })

    test("returns sum of currentBalance across all accounts", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.users.onboard, {
        userId: userIdentity.subject,
      })

      await t.run(async (ctx) => {
        const accounts = await ctx.db
          .query("accounts")
          .withIndex("by_owner", (q) => q.eq("ownerId", userIdentity.subject))
          .collect()
        await Promise.all(accounts.map((a) => ctx.db.delete(a._id)))
      })

      await seedAccount(t, {
        ownerId: userIdentity.subject,
        currentBalance: 1000,
      })
      await seedAccount(t, {
        ownerId: userIdentity.subject,
        currentBalance: 2500,
      })
      await seedAccount(t, {
        ownerId: userIdentity.subject,
        currentBalance: 500,
      })

      const result = await asUser.query(api.accounts.getBalance, {
        account: "combined",
      })
      expect(result).toBe(4000)
    })

    test("does not include other users' accounts in the sum", async () => {
      const t = convexTest(schema)
      await t
        .withIdentity(userIdentity)
        .mutation(internal.users.onboard, { userId: userIdentity.subject })
      await t
        .withIdentity(otherUserIdentity)
        .mutation(internal.users.onboard, { userId: otherUserIdentity.subject })

      await t.run(async (ctx) => {
        const accounts = await ctx.db
          .query("accounts")
          .withIndex("by_owner", (q) => q.eq("ownerId", userIdentity.subject))
          .collect()
        await Promise.all(accounts.map((a) => ctx.db.delete(a._id)))
      })

      await seedAccount(t, {
        ownerId: userIdentity.subject,
        currentBalance: 1000,
      })
      await seedAccount(t, {
        ownerId: otherUserIdentity.subject,
        currentBalance: 9999,
      })

      const result = await t
        .withIdentity(userIdentity)
        .query(api.accounts.getBalance, { account: "combined" })
      expect(result).toBe(1000)
    })
  })

  describe("specific account", () => {
    test("throws when account id does not exist", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.users.onboard, {
        userId: userIdentity.subject,
      })

      const deletedId = await getDeletedAccountId(t)

      await expect(
        asUser.query(api.accounts.getBalance, { account: deletedId })
      ).rejects.toThrowError("Account not found.")
    })

    test("throws when account belongs to a different user", async () => {
      const t = convexTest(schema)
      await t
        .withIdentity(userIdentity)
        .mutation(internal.users.onboard, { userId: userIdentity.subject })
      await t
        .withIdentity(otherUserIdentity)
        .mutation(internal.users.onboard, { userId: otherUserIdentity.subject })

      const otherAccountId = await seedAccount(t, {
        ownerId: otherUserIdentity.subject,
      })

      await expect(
        t
          .withIdentity(userIdentity)
          .query(api.accounts.getBalance, { account: otherAccountId })
      ).rejects.toThrowError(
        "Account does not belong to the authenticated user."
      )
    })

    test("returns currentBalance for the specified account", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.users.onboard, {
        userId: userIdentity.subject,
      })

      const accountId = await seedAccount(t, {
        ownerId: userIdentity.subject,
        currentBalance: 3750,
      })

      const result = await asUser.query(api.accounts.getBalance, {
        account: accountId,
      })
      expect(result).toBe(3750)
    })

    test("returns 0 when currentBalance is 0", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.users.onboard, {
        userId: userIdentity.subject,
      })

      const accountId = await seedAccount(t, {
        ownerId: userIdentity.subject,
        currentBalance: 0,
      })

      const result = await asUser.query(api.accounts.getBalance, {
        account: accountId,
      })
      expect(result).toBe(0)
    })
  })
})
