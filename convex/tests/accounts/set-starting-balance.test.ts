import { convexTest } from "convex-test"
import { describe, expect, test } from "vitest"
import {
  ACCOUNT_STARTING_BALANCE_MAX,
  ACCOUNT_STARTING_BALANCE_MIN,
} from "#lib/constants/constraints"
import { AppError } from "#lib/errors"
import { api, internal } from "../../_generated/api"
import schema from "../../schema"
import {
  getDeletedAccountId,
  seedAccount,
  seedCategory,
  seedTransaction,
} from "../helpers"

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

describe("accounts.setStartingBalance", () => {
  describe("auth", () => {
    test("throws UNAUTHENTICATED when called without a Clerk identity", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t)

      expect(
        t.mutation(api.account.setStartingBalance, {
          id: accountId,
          balance: 0,
        })
      ).rejects.toThrowError("UNAUTHENTICATED")
    })

    test("throws USER_NOT_STORED when identity exists but user was never onboarded", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t)

      await expect(
        t.withIdentity(userIdentity).mutation(api.account.setStartingBalance, {
          id: accountId,
          balance: 0,
        })
      ).rejects.toThrowError("USER_NOT_STORED")
    })
  })

  describe("account existence", () => {
    test("throws when account id does not exist", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })

      const deletedId = await getDeletedAccountId(t)

      expect(
        asUser.mutation(api.account.setStartingBalance, {
          id: deletedId,
          balance: 0,
        })
      ).rejects.toThrowError("DOCUMENT_NOT_FOUND")
    })
  })

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
        t.withIdentity(userIdentity).mutation(api.account.setStartingBalance, {
          id: otherAccountId,
          balance: 0,
        })
      ).rejects.toThrowError("DOCUMENT_NOT_OWNED")
    })
  })

  describe("balance validation", () => {
    test.todo("rejects decimal (non-integer) values", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })
      const accountId = await seedAccount(t)

      expect(
        asUser.mutation(api.account.setStartingBalance, {
          id: accountId,
          balance: 1.5,
        })
      ).rejects.toThrowError("INVALID_BALANCE_RANGE")
    })

    test("rejects balance below ACCOUNT_STARTING_BALANCE_MAX", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })
      const accountId = await seedAccount(t)

      expect(
        asUser.mutation(api.account.setStartingBalance, {
          id: accountId,
          balance: ACCOUNT_STARTING_BALANCE_MIN - 1,
        })
      ).rejects.toThrowError("INVALID_BALANCE_RANGE")
    })

    test("rejects balance above ACCOUNT_STARTING_BALANCE_MIN", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })
      const accountId = await seedAccount(t)

      expect(
        asUser.mutation(api.account.setStartingBalance, {
          id: accountId,
          balance: ACCOUNT_STARTING_BALANCE_MAX + 1,
        })
      ).rejects.toThrowError("INVALID_BALANCE_RANGE")
    })

    test("accepts balance of 0", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })
      const accountId = await seedAccount(t)

      const result = await asUser.mutation(api.account.setStartingBalance, {
        id: accountId,
        balance: 0,
      })

      expect(result).toBe(accountId)
    })

    test("accepts ACCOUNT_STARTING_BALANCE_MAX exactly", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })
      const accountId = await seedAccount(t)

      const result = await asUser.mutation(api.account.setStartingBalance, {
        id: accountId,
        balance: ACCOUNT_STARTING_BALANCE_MIN,
      })

      expect(result).toBe(accountId)
    })

    test("accepts ACCOUNT_STARTING_BALANCE_MIN exactly", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })
      const accountId = await seedAccount(t)

      const result = await asUser.mutation(api.account.setStartingBalance, {
        id: accountId,
        balance: ACCOUNT_STARTING_BALANCE_MAX,
      })

      expect(result).toBe(accountId)
    })
  })

  describe("mutation logic", () => {
    test("returns the account id", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })
      const accountId = await seedAccount(t)

      const result = await asUser.mutation(api.account.setStartingBalance, {
        id: accountId,
        balance: 1000,
      })

      expect(result).toBe(accountId)
    })

    test("persists the new startingBalance", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })
      const accountId = await seedAccount(t)

      await asUser.mutation(api.account.setStartingBalance, {
        id: accountId,
        balance: 5000,
      })

      const updated = await t.run((ctx) => ctx.db.get(accountId))
      expect(updated?.startingBalance).toBe(5000)
    })

    test("does not automatically reconcile balance after setting starting balance", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })
      const accountId = await seedAccount(t)

      const categoryId = await seedCategory(t, {
        ownerId: userIdentity.subject,
        type: "income",
      })
      await seedTransaction(t, {
        accountId,
        categoryId,
        amount: 200,
        ownerId: userIdentity.subject,
        type: "income",
      })
      await seedTransaction(t, {
        accountId,
        categoryId,
        amount: 300,
        ownerId: userIdentity.subject,
        type: "income",
      })

      await asUser.mutation(api.account.setStartingBalance, {
        id: accountId,
        balance: 1000,
      })

      const updated = await t.run((ctx) => ctx.db.get(accountId))
      if (!updated) throw AppError.notFound("Account not found")
      expect(updated.startingBalance).toBe(1000)
      // netFlow should still be 0 (not reconciled automatically)
      expect(updated.netFlow).toBe(0)
      // computed balance should be 1000 (not 1500)
      expect(updated.startingBalance + updated.netFlow).toBe(1000)
    })

    test("manual reconciliation via reconcileBalance works after setStartingBalance", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })
      const accountId = await seedAccount(t)

      const categoryId = await seedCategory(t, {
        ownerId: userIdentity.subject,
        type: "income",
      })
      await seedTransaction(t, {
        accountId,
        categoryId,
        amount: 200,
        ownerId: userIdentity.subject,
        type: "income",
      })
      await seedTransaction(t, {
        accountId,
        categoryId,
        amount: 300,
        ownerId: userIdentity.subject,
        type: "income",
      })

      await asUser.mutation(api.account.setStartingBalance, {
        id: accountId,
        balance: 1000,
      })

      // Manually reconcile
      await t.mutation(internal.account.reconcileBalance, {
        account: accountId,
      })

      const updated = await t.run((ctx) => ctx.db.get(accountId))
      if (!updated) throw AppError.notFound("Account not found")
      expect(updated.startingBalance).toBe(1000)
      expect(updated.netFlow).toBe(500) // 200 + 300
      // computed balance should be 1500
      expect(updated.startingBalance + updated.netFlow).toBe(1500)
    })

    test("computed balance equals startingBalance when account has no transactions", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })
      const accountId = await seedAccount(t)

      await asUser.mutation(api.account.setStartingBalance, {
        id: accountId,
        balance: 2500,
      })

      const updated = await t.run((ctx) => ctx.db.get(accountId))
      if (!updated) throw AppError.notFound("Account not found")
      expect(updated.startingBalance).toBe(2500)
      expect(updated.netFlow).toBe(0)
      expect(updated.startingBalance + updated.netFlow).toBe(2500)
    })

    test("only reconciles transactions belonging to the target account", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })

      const accountId = await seedAccount(t, { name: "My Wallet" })
      const otherAccountId = await seedAccount(t, { name: "Other" })
      const categoryId = await seedCategory(t, {
        ownerId: userIdentity.subject,
        type: "income",
      })

      await seedTransaction(t, {
        accountId,
        categoryId,
        amount: 400,
        ownerId: userIdentity.subject,
        type: "income",
      })
      await seedTransaction(t, {
        accountId: otherAccountId,
        categoryId,
        amount: 9999,
        ownerId: userIdentity.subject,
        type: "income",
      })

      await asUser.mutation(api.account.setStartingBalance, {
        id: accountId,
        balance: 1000,
      })

      // Manually reconcile to update netFlow
      await t.mutation(internal.account.reconcileBalance, {
        account: accountId,
      })

      const updated = await t.run((ctx) => ctx.db.get(accountId))
      if (!updated) throw AppError.notFound("Account not found")
      expect(updated.startingBalance).toBe(1000)
      expect(updated.netFlow).toBe(400) // only transaction for this account
      expect(updated.startingBalance + updated.netFlow).toBe(1400) // 1000 + 400 only
    })
    test("does not mutate other fields on the account", async () => {
      const t = convexTest(schema)
      const asUser = t.withIdentity(userIdentity)
      await asUser.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })
      const accountId = await seedAccount(t)

      const before = await t.run((ctx) => ctx.db.get(accountId))

      await asUser.mutation(api.account.setStartingBalance, {
        id: accountId,
        balance: 999,
      })
      const account = await t.run((ctx) => ctx.db.get(accountId))
      expect(account?.is_active).toEqual(before?.is_active)
      expect(account?.is_archived).toEqual(before?.is_archived)
      expect(account?.name).toEqual(before?.name)
      expect(account?.icon).toEqual(before?.icon)
    })
  })

  describe("isolation", () => {
    test("does not affect other users' accounts", async () => {
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

      const myAccountId = await seedAccount(t, {
        ownerId: userIdentity.subject,
      })
      const otherAccountId = await seedAccount(t, {
        ownerId: otherUserIdentity.subject,
        startingBalance: 999,
      })

      await t
        .withIdentity(userIdentity)
        .mutation(api.account.setStartingBalance, {
          id: myAccountId,
          balance: 5000,
        })

      const otherAccount = await t.run((ctx) => ctx.db.get(otherAccountId))
      if (!otherAccount) throw AppError.notFound("Account not found")
      expect(otherAccount.startingBalance).toBe(999)
      expect(otherAccount.netFlow).toBe(0)
      expect(otherAccount.startingBalance + otherAccount.netFlow).toBe(999)
    })
  })
})
