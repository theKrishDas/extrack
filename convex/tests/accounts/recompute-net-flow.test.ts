import { convexTest } from "convex-test"
import { describe, expect, test } from "vitest"
import { AppError } from "#lib/errors"
import { internal } from "../../_generated/api"
import schema from "../../schema"
import {
  getDeletedAccountId,
  seedAccount,
  seedCategory,
  seedTransaction,
} from "../helpers"

describe("accounts.reconcileBalance", () => {
  // -------------------------------------------------------------------------
  // Account existence
  // -------------------------------------------------------------------------

  describe("account existence", () => {
    test("throws when account id does not exist", async () => {
      const t = convexTest(schema)
      const deletedId = await getDeletedAccountId(t)

      await expect(
        t.mutation(internal.account.reconcileBalance, { account: deletedId })
      ).rejects.toThrowError("Account not found.")
    })
  })

  // -------------------------------------------------------------------------
  // Idempotency — no transactions
  // -------------------------------------------------------------------------

  describe("idempotency", () => {
    test("returns starting balance and netFlow unchanged when no transactions exist", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, {
        startingBalance: 1000,
        netFlow: 0,
      })

      const result = await t.mutation(internal.account.reconcileBalance, {
        account: accountId,
      })

      expect(result).toEqual({ startingBalance: 1000, netFlow: 0 })
    })

    test("resets netFlow to 0 and patches db when no transactions exist but netFlow is non-zero", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, {
        startingBalance: 1000,
        netFlow: 50, // intentionally stale
      })

      await t.mutation(internal.account.reconcileBalance, {
        account: accountId,
      })

      const account = await t.run((ctx) => ctx.db.get(accountId))
      if (!account) throw AppError.notFound("Account not found")
      expect(account.netFlow).toBe(0)
      expect(account.startingBalance + account.netFlow).toBe(1000)
    })
  })

  // -------------------------------------------------------------------------
  // Algorithm correctness
  // -------------------------------------------------------------------------

  describe("algorithm correctness", () => {
    test("computes netFlow from starting balance + income", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, { startingBalance: 500 })
      const categoryId = await seedCategory(t, { type: "income" })
      await seedTransaction(t, {
        accountId,
        categoryId,
        amount: 300,
        type: "income",
      })

      // netFlow should be 0 before reconciliation
      const before = await t.run((ctx) => ctx.db.get(accountId))
      if (!before) throw AppError.notFound("Account not found")
      expect(before.netFlow).toEqual(0)
      expect(before.startingBalance + before.netFlow).toEqual(500)

      const result = await t.mutation(internal.account.reconcileBalance, {
        account: accountId,
      })

      expect(result).toEqual({ startingBalance: 500, netFlow: 300 })
      const after = await t.run((ctx) => ctx.db.get(accountId))
      if (!after) throw AppError.notFound("Account not found")
      expect(after.startingBalance + after.netFlow).toBe(800)
    })

    test("computes netFlow from starting balance - expense", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, { startingBalance: 500 })
      const categoryId = await seedCategory(t, { type: "expense" })
      await seedTransaction(t, {
        accountId,
        categoryId,
        amount: 200,
        type: "expense",
      })

      const result = await t.mutation(internal.account.reconcileBalance, {
        account: accountId,
      })

      expect(result).toEqual({ startingBalance: 500, netFlow: -200 })
      const account = await t.run((ctx) => ctx.db.get(accountId))
      if (!account) throw AppError.notFound("Account not found")
      expect(account.startingBalance + account.netFlow).toBe(300)
    })

    test("correctly nets multiple income and expense transactions", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, { startingBalance: 1000 })
      const incomeCategoryId = await seedCategory(t, { type: "income" })
      const expenseCategoryId = await seedCategory(t, { type: "expense" })
      await seedTransaction(t, {
        accountId,
        categoryId: incomeCategoryId,
        amount: 500,
        type: "income",
      })
      await seedTransaction(t, {
        accountId,
        categoryId: expenseCategoryId,
        amount: 200,
        type: "expense",
      })
      await seedTransaction(t, {
        accountId,
        categoryId: expenseCategoryId,
        amount: 100,
        type: "expense",
      })
      await seedTransaction(t, {
        accountId,
        categoryId: incomeCategoryId,
        amount: 300,
        type: "income",
      })

      const result = await t.mutation(internal.account.reconcileBalance, {
        account: accountId,
      })

      // netFlow = 500 - 200 - 100 + 300 = 500
      expect(result).toEqual({ startingBalance: 1000, netFlow: 500 })
      const account = await t.run((ctx) => ctx.db.get(accountId))
      // computed balance = 1000 + 500 = 1500
      if (!account) throw AppError.notFound("Account not found")
      expect(account.startingBalance + account.netFlow).toBe(1500)
    })

    test("allows reconciled balance to go negative", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, { startingBalance: 100 })
      const categoryId = await seedCategory(t, { type: "expense" })
      await seedTransaction(t, {
        accountId,
        categoryId,
        amount: 400,
        type: "expense",
      })

      const result = await t.mutation(internal.account.reconcileBalance, {
        account: accountId,
      })

      expect(result).toEqual({ startingBalance: 100, netFlow: -400 })
      const account = await t.run((ctx) => ctx.db.get(accountId))
      if (!account) throw AppError.notFound("Account not found")
      expect(account.startingBalance + account.netFlow).toBe(-300)
    })

    test("overwrites a stale netFlow with the correct reconciled value", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, {
        startingBalance: 1000,
        netFlow: 8999, // stale/incorrect (would give balance of 9999)
      })
      const categoryId = await seedCategory(t, { type: "income" })
      await seedTransaction(t, {
        accountId,
        categoryId,
        amount: 200,
        type: "income",
      })

      await t.mutation(internal.account.reconcileBalance, {
        account: accountId,
      })

      const account = await t.run((ctx) => ctx.db.get(accountId))
      if (!account) throw AppError.notFound("Account not found")
      expect(account.netFlow).toBe(200)
      expect(account.startingBalance + account.netFlow).toBe(1200)
    })

    test("only counts transactions belonging to the given account", async () => {
      const t = convexTest(schema)
      const accountA = await seedAccount(t, { startingBalance: 500 })
      const accountB = await seedAccount(t, { startingBalance: 500 })
      const categoryId = await seedCategory(t, { type: "income" })
      await seedTransaction(t, {
        accountId: accountA,
        categoryId,
        amount: 300,
        type: "income",
      })
      await seedTransaction(t, {
        accountId: accountB,
        categoryId,
        amount: 999,
        type: "income",
      })

      const result = await t.mutation(internal.account.reconcileBalance, {
        account: accountA,
      })

      expect(result).toEqual({ startingBalance: 500, netFlow: 300 })
      const account = await t.run((ctx) => ctx.db.get(accountA))
      if (!account) throw AppError.notFound("Account not found")
      expect(account.startingBalance + account.netFlow).toBe(800)
    })

    test("handles large number of transactions correctly", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, { startingBalance: 10_000 })
      const incomeCategoryId = await seedCategory(t, { type: "income" })
      const expenseCategoryId = await seedCategory(t, { type: "expense" })

      // Create 20 transactions
      for (let i = 0; i < 10; i++) {
        await seedTransaction(t, {
          accountId,
          categoryId: incomeCategoryId,
          amount: 100,
          type: "income",
        })
        await seedTransaction(t, {
          accountId,
          categoryId: expenseCategoryId,
          amount: 50,
          type: "expense",
        })
      }

      const result = await t.mutation(internal.account.reconcileBalance, {
        account: accountId,
      })

      // netFlow = 10 * 100 - 10 * 50 = 500
      expect(result).toEqual({ startingBalance: 10_000, netFlow: 500 })
      const account = await t.run((ctx) => ctx.db.get(accountId))
      if (!account) throw AppError.notFound("Account not found")
      expect(account.startingBalance + account.netFlow).toBe(10_500)
    })
  })
})
