import { convexTest, type TestConvex } from "convex-test"
import { describe, expect, test } from "vitest"
import {
  TRANSACTION_AMOUNT_MAX,
  TRANSACTION_AMOUNT_MIN,
} from "#lib/constants/constraints"
import { internal } from "../../_generated/api"
import schema from "../../schema"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function seedAccount(
  t: TestConvex<typeof schema>,
  opts: { currentBalance?: number } = {}
) {
  return t.run((ctx) =>
    ctx.db.insert("accounts", {
      ownerId: "user_clerk_123",
      is_active: true,
      is_default: false,
      name: "Test Account",
      startingBalance: 0,
      currentBalance: opts.currentBalance ?? 0,
      icon: "X",
    })
  )
}

function getDeletedAccountId(t: TestConvex<typeof schema>) {
  return t.run(async (ctx) => {
    const id = await ctx.db.insert("accounts", {
      ownerId: "user_clerk_123",
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

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("accounts.adjustBalance", () => {
  // -------------------------------------------------------------------------
  // Account existence
  // -------------------------------------------------------------------------

  describe("account existence", () => {
    test("throws when account id does not exist", async () => {
      const t = convexTest(schema)
      const deletedId = await getDeletedAccountId(t)

      await expect(
        t.mutation(internal.accounts.adjustBalance, {
          id: deletedId,
          type: "income",
          amount: 100,
        })
      ).rejects.toThrowError("Account not found.")
    })
  })

  // -------------------------------------------------------------------------
  // Balance adjustment
  // -------------------------------------------------------------------------

  describe("balance adjustment", () => {
    test("adds amount to balance for income", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, { currentBalance: 500 })

      await t.mutation(internal.accounts.adjustBalance, {
        id: accountId,
        type: "income",
        amount: 200,
      })

      const updated = await t.run((ctx) => ctx.db.get(accountId))
      expect(updated?.currentBalance).toBe(700)
    })

    test("subtracts amount from balance for expense", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, { currentBalance: 500 })

      await t.mutation(internal.accounts.adjustBalance, {
        id: accountId,
        type: "expense",
        amount: 200,
      })

      const updated = await t.run((ctx) => ctx.db.get(accountId))
      expect(updated?.currentBalance).toBe(300)
    })

    test("allows balance to go negative for expense exceeding balance", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, { currentBalance: 100 })

      await t.mutation(internal.accounts.adjustBalance, {
        id: accountId,
        type: "expense",
        amount: 300,
      })

      const updated = await t.run((ctx) => ctx.db.get(accountId))
      expect(updated?.currentBalance).toBe(-200)
    })

    test("correctly adjusts from a zero balance", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, { currentBalance: 0 })

      await t.mutation(internal.accounts.adjustBalance, {
        id: accountId,
        type: "income",
        amount: 150,
      })

      const updated = await t.run((ctx) => ctx.db.get(accountId))
      expect(updated?.currentBalance).toBe(150)
    })

    test("correctly adjusts from a negative balance", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, { currentBalance: -100 })

      await t.mutation(internal.accounts.adjustBalance, {
        id: accountId,
        type: "income",
        amount: 250,
      })

      const updated = await t.run((ctx) => ctx.db.get(accountId))
      expect(updated?.currentBalance).toBe(150)
    })

    test("throws when amount is out of range", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, { currentBalance: 500 })

      await expect(
        t.mutation(internal.accounts.adjustBalance, {
          id: accountId,
          type: "income",
          amount: TRANSACTION_AMOUNT_MAX + 1,
        })
      ).rejects.toThrowError("Amount is outside the allowed range.")

      await expect(
        t.mutation(internal.accounts.adjustBalance, {
          id: accountId,
          type: "income",
          amount: TRANSACTION_AMOUNT_MIN - 1,
        })
      ).rejects.toThrowError("Amount is outside the allowed range.")
    })

    test.todo("throws when amount has decimal points (not in cents)", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, { currentBalance: 500 })

      await expect(
        t.mutation(internal.accounts.adjustBalance, {
          id: accountId,
          type: "income",
          amount: 10.5,
        })
      ).rejects.toThrowError("Amount must be in cents (integer), received 10.5")
    })
  })

  // -------------------------------------------------------------------------
  // Return value
  // -------------------------------------------------------------------------

  describe("return value", () => {
    test("returns id, prevBalance, and updated balance for income", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, { currentBalance: 500 })

      const result = await t.mutation(internal.accounts.adjustBalance, {
        id: accountId,
        type: "income",
        amount: 200,
      })

      expect(result).toEqual({ id: accountId, prevBalance: 500, balance: 700 })
    })

    test("returns id, prevBalance, and updated balance for expense", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, { currentBalance: 500 })

      const result = await t.mutation(internal.accounts.adjustBalance, {
        id: accountId,
        type: "expense",
        amount: 200,
      })

      expect(result).toEqual({ id: accountId, prevBalance: 500, balance: 300 })
    })
  })

  // -------------------------------------------------------------------------
  // Cumulative adjustments
  // -------------------------------------------------------------------------

  describe("cumulative adjustments", () => {
    test("sequential adjustments compound correctly", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, { currentBalance: 1000 })

      await t.mutation(internal.accounts.adjustBalance, {
        id: accountId,
        type: "income",
        amount: 500,
      })
      await t.mutation(internal.accounts.adjustBalance, {
        id: accountId,
        type: "expense",
        amount: 300,
      })
      await t.mutation(internal.accounts.adjustBalance, {
        id: accountId,
        type: "expense",
        amount: 200,
      })

      const updated = await t.run((ctx) => ctx.db.get(accountId))
      expect(updated?.currentBalance).toBe(1000)
    })

    test("adjusting one account does not affect another account's balance", async () => {
      const t = convexTest(schema)
      const accountA = await seedAccount(t, { currentBalance: 500 })
      const accountB = await seedAccount(t, { currentBalance: 500 })

      await t.mutation(internal.accounts.adjustBalance, {
        id: accountA,
        type: "expense",
        amount: 200,
      })

      const updatedB = await t.run((ctx) => ctx.db.get(accountB))
      expect(updatedB?.currentBalance).toBe(500)
    })
  })
})
