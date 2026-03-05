import { convexTest } from "convex-test"
import { describe, expect, test } from "vitest"
import { internal } from "../../_generated/api"
import schema from "../../schema"
import {
  getDeletedAccountId,
  seedAccount,
  seedCategory,
  seedTransaction,
} from "../helpers"

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("accounts.syncBalance", () => {
  // -------------------------------------------------------------------------
  // Account existence
  // -------------------------------------------------------------------------

  describe("account existence", () => {
    test("throws when account id does not exist", async () => {
      const t = convexTest(schema)
      const deletedId = await getDeletedAccountId(t)

      await expect(
        t.mutation(internal.accounts.syncBalance, { account: deletedId })
      ).rejects.toThrowError("Account not found.")
    })
  })

  // -------------------------------------------------------------------------
  // Idempotency — no transactions
  // -------------------------------------------------------------------------

  describe("idempotency", () => {
    test("returns starting and current balance unchanged when no transactions exist", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, {
        startingBalance: 1000,
        currentBalance: 1000,
      })

      const result = await t.mutation(internal.accounts.syncBalance, {
        account: accountId,
      })

      expect(result).toEqual({ startingBalance: 1000, currentBalance: 1000 })
    })

    test.todo("resets currentBalance to startingBalance and patches db when no transactions exist but balances are out of sync", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, {
        startingBalance: 1000,
        currentBalance: 999, // intentionally stale
      })

      await t.mutation(internal.accounts.syncBalance, { account: accountId })

      const account = await t.run((ctx) => ctx.db.get(accountId))
      expect(account?.currentBalance).toBe(1000)
    })
  })

  // -------------------------------------------------------------------------
  // Algorithm correctness
  // -------------------------------------------------------------------------

  describe("algorithm correctness", () => {
    test("computes balance from starting balance + income", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, { startingBalance: 500 })
      const categoryId = await seedCategory(t, { type: "income" })
      await seedTransaction(t, {
        accountId,
        categoryId,
        amount: 300,
        type: "income",
      })

      // currentBalance must not change now
      const _ = await t.run((ctx) => ctx.db.get(accountId))
      expect(_?.currentBalance).toEqual(500)

      const result = await t.mutation(internal.accounts.syncBalance, {
        account: accountId,
      })

      expect(result).toEqual({ startingBalance: 500, currentBalance: 800 })
    })

    test("computes balance from starting balance - expense", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, { startingBalance: 500 })
      const categoryId = await seedCategory(t, { type: "expense" })
      await seedTransaction(t, {
        accountId,
        categoryId,
        amount: 200,
        type: "expense",
      })

      const result = await t.mutation(internal.accounts.syncBalance, {
        account: accountId,
      })

      expect(result).toEqual({ startingBalance: 500, currentBalance: 300 })
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

      const result = await t.mutation(internal.accounts.syncBalance, {
        account: accountId,
      })

      // 1000 + 500 - 200 - 100 + 300 = 1500
      expect(result).toEqual({ startingBalance: 1000, currentBalance: 1500 })
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

      const result = await t.mutation(internal.accounts.syncBalance, {
        account: accountId,
      })

      expect(result).toEqual({ startingBalance: 100, currentBalance: -300 })
    })

    test("overwrites a stale currentBalance with the correct reconciled value", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, {
        startingBalance: 1000,
        currentBalance: 9999, // stale/incorrect
      })
      const categoryId = await seedCategory(t, { type: "income" })
      await seedTransaction(t, {
        accountId,
        categoryId,
        amount: 200,
        type: "income",
      })

      await t.mutation(internal.accounts.syncBalance, { account: accountId })

      const account = await t.run((ctx) => ctx.db.get(accountId))
      expect(account?.currentBalance).toBe(1200)
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

      const result = await t.mutation(internal.accounts.syncBalance, {
        account: accountA,
      })

      expect(result).toEqual({ startingBalance: 500, currentBalance: 800 })
    })
  })
})
