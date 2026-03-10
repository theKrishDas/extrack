import { convexTest } from "convex-test"
import { describe, expect, test } from "vitest"
import {
  TRANSACTION_AMOUNT_MAX,
  TRANSACTION_AMOUNT_MIN,
} from "#lib/constants/constraints"
import { AppError } from "#lib/errors"
import { internal } from "../../_generated/api"
import schema from "../../schema"
import { getDeletedAccountId, seedAccount } from "../helpers"

describe("account.applyTransactionFlow", () => {
  // -------------------------------------------------------------------------
  // Account existence
  // -------------------------------------------------------------------------

  describe("account existence", () => {
    test("throws when account id does not exist", async () => {
      const t = convexTest(schema)
      const deletedId = await getDeletedAccountId(t)

      await expect(
        t.mutation(internal.account.applyTransactionFlow, {
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
    test("adds amount to netFlow for income", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, {
        startingBalance: 0,
        netFlow: 500,
      })

      await t.mutation(internal.account.applyTransactionFlow, {
        id: accountId,
        type: "income",
        amount: 200,
      })

      const updated = await t.run((ctx) => ctx.db.get(accountId))
      if (!updated)
        throw AppError.notFound("Account not found.", {
          context: { accountId },
        })
      expect(updated.netFlow).toBe(700)
      expect(updated.startingBalance + updated.netFlow).toBe(700)
    })

    test("subtracts amount from netFlow for expense", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, {
        startingBalance: 0,
        netFlow: 500,
      })

      await t.mutation(internal.account.applyTransactionFlow, {
        id: accountId,
        type: "expense",
        amount: 200,
      })

      const updated = await t.run((ctx) => ctx.db.get(accountId))
      if (!updated)
        throw AppError.notFound("Account not found.", {
          context: { accountId },
        })
      expect(updated.netFlow).toBe(300)
      expect(updated.startingBalance + updated.netFlow).toBe(300)
    })

    test("allows balance to go negative for expense exceeding balance", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, {
        startingBalance: 0,
        netFlow: 100,
      })

      await t.mutation(internal.account.applyTransactionFlow, {
        id: accountId,
        type: "expense",
        amount: 300,
      })

      const updated = await t.run((ctx) => ctx.db.get(accountId))
      if (!updated)
        throw AppError.notFound("Account not found.", {
          context: { accountId },
        })
      expect(updated.netFlow).toBe(-200)
      expect(updated.startingBalance + updated.netFlow).toBe(-200)
    })

    test("correctly adjusts from a zero balance", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, { startingBalance: 0, netFlow: 0 })

      await t.mutation(internal.account.applyTransactionFlow, {
        id: accountId,
        type: "income",
        amount: 150,
      })

      const updated = await t.run((ctx) => ctx.db.get(accountId))
      if (!updated)
        throw AppError.notFound("Account not found.", {
          context: { accountId },
        })
      expect(updated.netFlow).toBe(150)
      expect(updated.startingBalance + updated.netFlow).toBe(150)
    })

    test("correctly adjusts from a negative balance", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, {
        startingBalance: 0,
        netFlow: -100,
      })

      await t.mutation(internal.account.applyTransactionFlow, {
        id: accountId,
        type: "income",
        amount: 250,
      })

      const updated = await t.run((ctx) => ctx.db.get(accountId))
      if (!updated)
        throw AppError.notFound("Account not found.", {
          context: { accountId },
        })
      expect(updated.netFlow).toBe(150)
      expect(updated.startingBalance + updated.netFlow).toBe(150)
    })

    test("throws when amount is out of range", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, {
        startingBalance: 0,
        netFlow: 500,
      })

      await expect(
        t.mutation(internal.account.applyTransactionFlow, {
          id: accountId,
          type: "income",
          amount: TRANSACTION_AMOUNT_MAX + 1,
        })
      ).rejects.toThrowError("Amount is outside the allowed range.")

      await expect(
        t.mutation(internal.account.applyTransactionFlow, {
          id: accountId,
          type: "income",
          amount: TRANSACTION_AMOUNT_MIN - 1,
        })
      ).rejects.toThrowError("Amount is outside the allowed range.")
    })

    test.todo("throws when amount has decimal points (not in cents)", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, {
        startingBalance: 0,
        netFlow: 500,
      })

      await expect(
        t.mutation(internal.account.applyTransactionFlow, {
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
    test("returns id, previousBalance, and updated balance for income", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, {
        startingBalance: 0,
        netFlow: 500,
      })

      const result = await t.mutation(internal.account.applyTransactionFlow, {
        id: accountId,
        type: "income",
        amount: 200,
      })

      expect(result).toEqual({
        id: accountId,
        previousBalance: 500,
        balance: 700,
      })
    })

    test("returns id, previousBalance, and updated balance for expense", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, {
        startingBalance: 0,
        netFlow: 500,
      })

      const result = await t.mutation(internal.account.applyTransactionFlow, {
        id: accountId,
        type: "expense",
        amount: 200,
      })

      expect(result).toEqual({
        id: accountId,
        previousBalance: 500,
        balance: 300,
      })
    })
  })

  // -------------------------------------------------------------------------
  // Cumulative adjustments
  // -------------------------------------------------------------------------

  describe("cumulative adjustments", () => {
    test("sequential adjustments compound correctly", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, {
        startingBalance: 0,
        netFlow: 1000,
      })

      await t.mutation(internal.account.applyTransactionFlow, {
        id: accountId,
        type: "income",
        amount: 500,
      })
      await t.mutation(internal.account.applyTransactionFlow, {
        id: accountId,
        type: "expense",
        amount: 300,
      })
      await t.mutation(internal.account.applyTransactionFlow, {
        id: accountId,
        type: "expense",
        amount: 200,
      })

      const updated = await t.run((ctx) => ctx.db.get(accountId))
      if (!updated)
        throw AppError.notFound("Account not found.", {
          context: { accountId },
        })
      expect(updated.netFlow).toBe(1000) // 1000 + 500 - 300 - 200 = 1000
      expect(updated.startingBalance + updated.netFlow).toBe(1000)
    })

    test("adjusting one account does not affect another account's balance", async () => {
      const t = convexTest(schema)
      const accountA = await seedAccount(t, {
        startingBalance: 0,
        netFlow: 500,
      })
      const accountB = await seedAccount(t, {
        startingBalance: 0,
        netFlow: 500,
      })

      await t.mutation(internal.account.applyTransactionFlow, {
        id: accountA,
        type: "expense",
        amount: 200,
      })

      const updatedB = await t.run((ctx) => ctx.db.get(accountB))
      if (!updatedB)
        throw AppError.notFound("Account not found.", {
          context: { accountB },
        })
      expect(updatedB.netFlow).toBe(500)
      expect(updatedB.startingBalance + updatedB.netFlow).toBe(500)
    })

    test("correctly handles netFlow with non-zero startingBalance", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, {
        startingBalance: 1000,
        netFlow: 200,
      })

      await t.mutation(internal.account.applyTransactionFlow, {
        id: accountId,
        type: "expense",
        amount: 300,
      })

      const updated = await t.run((ctx) => ctx.db.get(accountId))
      if (!updated)
        throw AppError.notFound("Account not found.", {
          context: { accountId },
        })
      expect(updated.netFlow).toBe(-100) // 200 - 300
      expect(updated.startingBalance + updated.netFlow).toBe(900) // 1000 - 100
    })
  })
})
