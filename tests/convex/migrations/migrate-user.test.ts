import { ConvexError } from "convex/values"
import { describe, expect, test } from "vitest"
import { internal } from "#/convex/_generated/api"
import type { Doc } from "#/convex/_generated/dataModel"
import { vendorAccounts } from "#lib/seed"
import {
  computeExpectedNetFlow,
  createMigrationTest,
  findCategoryByNameAndType,
  getAccount,
  getStoredUser,
  listAccountsForOwner,
  listCategoriesForOwner,
  listTransactionsForOwner,
  OWNER_A,
  OWNER_B,
  seedMigrationCategory,
  seedMigrationPreference,
  seedMigrationTransaction,
} from "./helpers"

async function getDefaultAccountState(
  t: ReturnType<typeof createMigrationTest>,
  ownerId: string
) {
  const storedUser = await getStoredUser(t, ownerId)

  if (!storedUser) {
    throw new Error(`Expected stored user for owner ${ownerId}`)
  }

  return await getAccount(t, storedUser.defaultAccount)
}

async function expectNoStoredState(
  t: ReturnType<typeof createMigrationTest>,
  ownerId: string
) {
  const [storedUser, accounts, categories, transactions] = await Promise.all([
    getStoredUser(t, ownerId),
    listAccountsForOwner(t, ownerId),
    listCategoriesForOwner(t, ownerId),
    listTransactionsForOwner(t, ownerId),
  ])

  if (storedUser) {
    throw new Error(`Expected no stored user for owner ${ownerId}`)
  }
  if (accounts.length) {
    throw new Error(`Expected no stored accounts for owner ${ownerId}`)
  }
  if (categories.length) {
    throw new Error(`Expected no stored categories for owner ${ownerId}`)
  }
  if (transactions.length) {
    throw new Error(`Expected no stored transactions for owner ${ownerId}`)
  }
}

function findTransactionByLegacyId(
  transactions: Doc<"transactions">[],
  legacyId: string
) {
  return transactions.find((transaction) => transaction.pg_id === legacyId)
}

describe("migrations.migrateUser", () => {
  describe("input contract", () => {
    test("fails when migration_preference is missing", async () => {
      const t = createMigrationTest()

      await seedMigrationCategory(t, {
        id: "cat_food",
        userId: OWNER_A,
        name: "Food",
      })
      await seedMigrationTransaction(t, {
        id: "txn_food",
        userId: OWNER_A,
        amount: 500,
        isExpense: true,
        category: "cat_food",
      })

      await expect(
        t.mutation(internal.migrations.migrateUser, {
          userId: OWNER_A,
        })
      ).rejects.toBeInstanceOf(ConvexError)
      await expect(
        t.mutation(internal.migrations.migrateUser, {
          userId: OWNER_A,
        })
      ).rejects.toThrow("Missing migration_preference")

      await expectNoStoredState(t, OWNER_A)
    })

    test("onboards a user with no categories or transactions and applies the initial balance", async () => {
      const t = createMigrationTest()

      await seedMigrationPreference(t, {
        userId: OWNER_A,
        initialBalance: -3500,
      })

      await t.mutation(internal.migrations.migrateUser, { userId: OWNER_A })

      const [accounts, categories, transactions, defaultAccount] =
        await Promise.all([
          listAccountsForOwner(t, OWNER_A),
          listCategoriesForOwner(t, OWNER_A),
          listTransactionsForOwner(t, OWNER_A),
          getDefaultAccountState(t, OWNER_A),
        ])

      expect(accounts).toHaveLength(vendorAccounts.length)
      expect(categories.length).toBeGreaterThan(0)
      expect(transactions).toHaveLength(0)
      expect(defaultAccount.name).toBe(vendorAccounts.at(0)?.name)
      expect(defaultAccount.startingBalance).toBe(-3500)
      expect(defaultAccount.netFlow).toBe(0)
    })
  })

  describe("migrateUser logic", () => {
    test("migrates a user end-to-end with reused, inserted, and uncategorized categories", async () => {
      const t = createMigrationTest()

      await seedMigrationPreference(t, {
        userId: OWNER_A,
        initialBalance: 4200,
      })
      await seedMigrationCategory(t, {
        id: "legacy_food",
        userId: OWNER_A,
        name: " food ",
        isExpense: true,
      })
      await seedMigrationCategory(t, {
        id: "legacy_salary",
        userId: OWNER_A,
        name: "Salary",
        isExpense: false,
      })
      await seedMigrationCategory(t, {
        id: "legacy_taxi",
        userId: OWNER_A,
        name: "Taxi",
        isExpense: true,
      })

      await seedMigrationTransaction(t, {
        id: "txn_food",
        userId: OWNER_A,
        amount: -1250,
        label: "Lunch",
        isExpense: true,
        date: "2024-01-02T00:00:00.000Z",
        category: "legacy_food",
      })
      await seedMigrationTransaction(t, {
        id: "txn_salary",
        userId: OWNER_A,
        amount: 5000,
        label: "Salary",
        isExpense: false,
        date: "2024-01-03T00:00:00.000Z",
        category: "legacy_salary",
      })
      await seedMigrationTransaction(t, {
        id: "txn_taxi",
        userId: OWNER_A,
        amount: 700,
        label: "Cab",
        isExpense: true,
        date: "2024-01-04T00:00:00.000Z",
        category: "legacy_taxi",
      })
      await seedMigrationTransaction(t, {
        id: "txn_bonus",
        userId: OWNER_A,
        amount: 300,
        label: "Bonus",
        isExpense: false,
        date: "2024-01-05T00:00:00.000Z",
        category: null,
      })
      await seedMigrationTransaction(t, {
        id: "txn_misc",
        userId: OWNER_A,
        amount: 250,
        label: "Misc",
        isExpense: true,
        date: "2024-01-06T00:00:00.000Z",
        category: "",
      })
      await seedMigrationTransaction(t, {
        id: "txn_zero",
        userId: OWNER_A,
        amount: 0,
        label: "Zero",
        isExpense: true,
        date: "2024-01-07T00:00:00.000Z",
        category: "legacy_taxi",
      })

      await t.mutation(internal.migrations.migrateUser, { userId: OWNER_A })

      const [storedUser, accounts, categories, transactions] =
        await Promise.all([
          getStoredUser(t, OWNER_A),
          listAccountsForOwner(t, OWNER_A),
          listCategoriesForOwner(t, OWNER_A),
          listTransactionsForOwner(t, OWNER_A),
        ])

      expect(storedUser).not.toBeNull()
      if (!storedUser) {
        throw new Error(`Expected stored user for owner ${OWNER_A}`)
      }

      const defaultAccount = await getAccount(t, storedUser.defaultAccount)
      const netFlow = computeExpectedNetFlow(transactions)

      expect(accounts).toHaveLength(vendorAccounts.length)
      expect(transactions).toHaveLength(5)
      expect(defaultAccount.startingBalance).toBe(4200)
      expect(defaultAccount.netFlow).toBe(netFlow)
      expect(defaultAccount.netFlow).toBe(3100)

      const nonDefaultAccount = accounts.find(
        (account) => account._id !== storedUser.defaultAccount
      )

      expect(nonDefaultAccount).toBeDefined()
      if (!nonDefaultAccount) {
        throw new Error("Expected a second seeded account")
      }
      expect(nonDefaultAccount.startingBalance).toBe(0)
      expect(nonDefaultAccount.netFlow).toBe(0)

      const foodCategory = findCategoryByNameAndType(
        categories,
        "Food",
        "expense"
      )
      const salaryCategory = findCategoryByNameAndType(
        categories,
        "Salary",
        "income"
      )
      const taxiCategory = findCategoryByNameAndType(
        categories,
        "Taxi",
        "expense"
      )
      const uncategorizedExpense = findCategoryByNameAndType(
        categories,
        "Uncategorized",
        "expense"
      )
      const uncategorizedIncome = findCategoryByNameAndType(
        categories,
        "Uncategorized",
        "income"
      )

      expect(foodCategory?.pg_id).toBe("legacy_food")
      expect(salaryCategory?.pg_id).toBe("legacy_salary")
      expect(taxiCategory).toMatchObject({
        pg_id: "legacy_taxi",
        color: "gray",
        icon: "_",
        is_vendor: false,
      })
      expect(uncategorizedExpense).toMatchObject({
        is_vendor: false,
        color: "gray",
        icon: "_",
      })
      expect(uncategorizedIncome).toMatchObject({
        is_vendor: false,
        color: "gray",
        icon: "_",
      })

      const salaryTransaction = findTransactionByLegacyId(
        transactions,
        "txn_salary"
      )
      const foodTransaction = findTransactionByLegacyId(
        transactions,
        "txn_food"
      )
      const bonusTransaction = findTransactionByLegacyId(
        transactions,
        "txn_bonus"
      )
      const miscTransaction = findTransactionByLegacyId(
        transactions,
        "txn_misc"
      )

      expect(salaryTransaction).toMatchObject({
        type: "income",
        amount: 5000,
        note: "Salary",
        account: storedUser.defaultAccount,
        category: salaryCategory?._id,
      })
      expect(foodTransaction).toMatchObject({
        type: "expense",
        amount: 1250,
        note: "Lunch",
        account: storedUser.defaultAccount,
        category: foodCategory?._id,
      })
      expect(bonusTransaction?.category).toBe(uncategorizedIncome?._id)
      expect(miscTransaction?.category).toBe(uncategorizedExpense?._id)
      expect(
        findTransactionByLegacyId(transactions, "txn_zero")
      ).toBeUndefined()
    })

    test("is a no-op when the user is already migrated", async () => {
      const t = createMigrationTest()

      await seedMigrationPreference(t, {
        userId: OWNER_A,
        initialBalance: 2500,
      })
      await seedMigrationCategory(t, {
        id: "legacy_food",
        userId: OWNER_A,
        name: "Food",
        isExpense: true,
      })
      await seedMigrationTransaction(t, {
        id: "txn_food",
        userId: OWNER_A,
        amount: 900,
        isExpense: true,
        category: "legacy_food",
      })

      await t.mutation(internal.migrations.migrateUser, { userId: OWNER_A })

      const firstCounts = await Promise.all([
        listAccountsForOwner(t, OWNER_A),
        listCategoriesForOwner(t, OWNER_A),
        listTransactionsForOwner(t, OWNER_A),
      ])
      const firstDefaultAccount = await getDefaultAccountState(t, OWNER_A)

      await t.mutation(internal.migrations.migrateUser, { userId: OWNER_A })

      const secondCounts = await Promise.all([
        listAccountsForOwner(t, OWNER_A),
        listCategoriesForOwner(t, OWNER_A),
        listTransactionsForOwner(t, OWNER_A),
      ])
      const secondDefaultAccount = await getDefaultAccountState(t, OWNER_A)

      expect(secondCounts[0]).toHaveLength(firstCounts[0].length)
      expect(secondCounts[1]).toHaveLength(firstCounts[1].length)
      expect(secondCounts[2]).toHaveLength(firstCounts[2].length)
      expect(secondDefaultAccount.startingBalance).toBe(
        firstDefaultAccount.startingBalance
      )
      expect(secondDefaultAccount.netFlow).toBe(firstDefaultAccount.netFlow)
    })

    test("reuses existing 'Uncategorized' vendor category instead of inserting a new one", async () => {
      const t = createMigrationTest()

      await seedMigrationPreference(t, { userId: OWNER_A, initialBalance: 0 })
      await seedMigrationTransaction(t, {
        id: "txn_null_cat",
        userId: OWNER_A,
        amount: 500,
        isExpense: true,
        date: "2024-01-01T00:00:00.000Z",
        category: null,
      })

      await t.mutation(internal.migrations.migrateUser, { userId: OWNER_A })

      const categories = await listCategoriesForOwner(t, OWNER_A)
      const uncategorizedExpense = categories.filter(
        (c) => c.name.toLowerCase() === "uncategorized" && c.type === "expense"
      )

      // Must reuse — not create a duplicate
      expect(uncategorizedExpense).toHaveLength(1)
    })

    test("allows the same category name for different types", async () => {
      const t = createMigrationTest()

      await seedMigrationPreference(t, { userId: OWNER_A, initialBalance: 0 })
      await seedMigrationCategory(t, {
        id: "legacy_other_expense",
        userId: OWNER_A,
        name: "Other",
        isExpense: true,
      })
      await seedMigrationCategory(t, {
        id: "legacy_other_income",
        userId: OWNER_A,
        name: "Other",
        isExpense: false,
      })
      await seedMigrationTransaction(t, {
        id: "txn_expense",
        userId: OWNER_A,
        amount: 500,
        isExpense: true,
        date: "2024-01-01T00:00:00.000Z",
        category: "legacy_other_expense",
      })
      await seedMigrationTransaction(t, {
        id: "txn_income",
        userId: OWNER_A,
        amount: 500,
        isExpense: false,
        date: "2024-01-02T00:00:00.000Z",
        category: "legacy_other_income",
      })

      await t.mutation(internal.migrations.migrateUser, { userId: OWNER_A })

      const categories = await listCategoriesForOwner(t, OWNER_A)
      const expenseOther = findCategoryByNameAndType(
        categories,
        "Other",
        "expense"
      )
      const incomeOther = findCategoryByNameAndType(
        categories,
        "Other",
        "income"
      )

      expect(expenseOther).toBeDefined()
      expect(incomeOther).toBeDefined()
      expect(expenseOther?._id).not.toBe(incomeOther?._id)
      expect(expenseOther?.pg_id).toBe("legacy_other_expense")
      expect(incomeOther?.pg_id).toBe("legacy_other_income")
    })
  })

  describe("failure modes", () => {
    test("rolls back the entire user migration on invalid date", async () => {
      const t = createMigrationTest()

      await seedMigrationPreference(t, {
        userId: OWNER_A,
        initialBalance: 1000,
      })
      await seedMigrationCategory(t, {
        id: "legacy_food",
        userId: OWNER_A,
        name: "Food",
        isExpense: true,
      })
      await seedMigrationTransaction(t, {
        id: "txn_food",
        userId: OWNER_A,
        amount: 500,
        isExpense: true,
        date: "not-a-date",
        category: "legacy_food",
      })

      await expect(
        t.mutation(internal.migrations.migrateUser, {
          userId: OWNER_A,
        })
      ).rejects.toThrow("Invalid date")

      await expectNoStoredState(t, OWNER_A)
    })

    test("fails on duplicate legacy transaction ids", async () => {
      const t = createMigrationTest()

      await seedMigrationPreference(t, {
        userId: OWNER_A,
        initialBalance: 1000,
      })
      await seedMigrationCategory(t, {
        id: "legacy_food",
        userId: OWNER_A,
        name: "Food",
        isExpense: true,
      })
      await seedMigrationTransaction(t, {
        id: "txn_duplicate",
        userId: OWNER_A,
        amount: 500,
        isExpense: true,
        category: "legacy_food",
      })
      await seedMigrationTransaction(t, {
        id: "txn_duplicate",
        userId: OWNER_A,
        amount: 250,
        isExpense: true,
        category: "legacy_food",
      })

      await expect(
        t.mutation(internal.migrations.migrateUser, { userId: OWNER_A })
      ).rejects.toThrow("Duplicate legacy transaction id")

      await expectNoStoredState(t, OWNER_A)
    })

    test("fails on duplicate legacy category ids", async () => {
      const t = createMigrationTest()

      await seedMigrationPreference(t, {
        userId: OWNER_A,
        initialBalance: 1000,
      })
      await seedMigrationCategory(t, {
        id: "legacy_duplicate",
        userId: OWNER_A,
        name: "Food",
        isExpense: true,
      })
      await seedMigrationCategory(t, {
        id: "legacy_duplicate",
        userId: OWNER_A,
        name: "Taxi",
        isExpense: true,
      })

      await expect(
        t.mutation(internal.migrations.migrateUser, { userId: OWNER_A })
      ).rejects.toThrow("Duplicate legacy category id")

      await expectNoStoredState(t, OWNER_A)
    })

    test("fails on duplicate legacy category names after trim and case normalization", async () => {
      const t = createMigrationTest()

      await seedMigrationPreference(t, {
        userId: OWNER_A,
        initialBalance: 1000,
      })
      await seedMigrationCategory(t, {
        id: "legacy_food_a",
        userId: OWNER_A,
        name: "Food",
        isExpense: true,
      })
      await seedMigrationCategory(t, {
        id: "legacy_food_b",
        userId: OWNER_A,
        name: " food ",
        isExpense: true,
      })

      await expect(
        t.mutation(internal.migrations.migrateUser, { userId: OWNER_A })
      ).rejects.toThrow("Duplicate legacy category name")

      await expectNoStoredState(t, OWNER_A)
    })

    test("fails on empty legacy category names", async () => {
      const t = createMigrationTest()

      await seedMigrationPreference(t, {
        userId: OWNER_A,
        initialBalance: 1000,
      })
      await seedMigrationCategory(t, {
        id: "legacy_blank",
        userId: OWNER_A,
        name: "   ",
        isExpense: true,
      })

      await expect(
        t.mutation(internal.migrations.migrateUser, { userId: OWNER_A })
      ).rejects.toThrow("Empty category name")

      await expectNoStoredState(t, OWNER_A)
    })

    test("fails when a transaction references a missing legacy category id", async () => {
      const t = createMigrationTest()

      await seedMigrationPreference(t, {
        userId: OWNER_A,
        initialBalance: 1000,
      })
      await seedMigrationTransaction(t, {
        id: "txn_missing_category",
        userId: OWNER_A,
        amount: 500,
        isExpense: true,
        category: "does_not_exist",
      })

      await expect(
        t.mutation(internal.migrations.migrateUser, { userId: OWNER_A })
      ).rejects.toThrow("assigned to invalid category")

      await expectNoStoredState(t, OWNER_A)
    })

    test("fails when a transaction category type conflicts with the transaction type", async () => {
      const t = createMigrationTest()

      await seedMigrationPreference(t, {
        userId: OWNER_A,
        initialBalance: 1000,
      })
      await seedMigrationCategory(t, {
        id: "legacy_salary",
        userId: OWNER_A,
        name: "Salary",
        isExpense: false,
      })
      await seedMigrationTransaction(t, {
        id: "txn_bad_type",
        userId: OWNER_A,
        amount: 500,
        isExpense: true,
        category: "legacy_salary",
      })

      await expect(
        t.mutation(internal.migrations.migrateUser, { userId: OWNER_A })
      ).rejects.toThrow("mismatched type")

      await expectNoStoredState(t, OWNER_A)
    })

    test("fails on duplicate category names within the same type but not across types", async () => {
      const t = createMigrationTest()

      await seedMigrationPreference(t, { userId: OWNER_A, initialBalance: 0 })
      await seedMigrationCategory(t, {
        id: "legacy_food_expense",
        userId: OWNER_A,
        name: "Food",
        isExpense: true,
      })
      await seedMigrationCategory(t, {
        id: "legacy_food_income",
        userId: OWNER_A,
        name: "Food",
        isExpense: false,
      })
      await seedMigrationCategory(t, {
        id: "legacy_food_expense_dup",
        userId: OWNER_A,
        name: " food ",
        isExpense: true, // same type as legacy_food_expense → duplicate
      })

      await expect(
        t.mutation(internal.migrations.migrateUser, { userId: OWNER_A })
      ).rejects.toThrow("Duplicate legacy category name")

      await expectNoStoredState(t, OWNER_A)
    })
  })

  describe("isolation", () => {
    test("a failed user migration does not affect another user", async () => {
      const t = createMigrationTest()

      await seedMigrationPreference(t, {
        userId: OWNER_A,
        initialBalance: 1500,
      })
      await seedMigrationCategory(t, {
        id: "legacy_food_a",
        userId: OWNER_A,
        name: "Food",
        isExpense: true,
      })
      await seedMigrationTransaction(t, {
        id: "txn_food_a",
        userId: OWNER_A,
        amount: 500,
        isExpense: true,
        category: "legacy_food_a",
      })

      await seedMigrationPreference(t, { userId: OWNER_B, initialBalance: 900 })
      await seedMigrationCategory(t, {
        id: "legacy_salary_b",
        userId: OWNER_B,
        name: "Salary",
        isExpense: false,
      })
      await seedMigrationTransaction(t, {
        id: "txn_bad_date_b",
        userId: OWNER_B,
        amount: 300,
        isExpense: false,
        date: "bad-date",
        category: "legacy_salary_b",
      })

      await t.mutation(internal.migrations.migrateUser, { userId: OWNER_A })
      await expect(
        t.mutation(internal.migrations.migrateUser, { userId: OWNER_B })
      ).rejects.toThrow("Invalid date")

      const [ownerATransactions, ownerADefaultAccount] = await Promise.all([
        listTransactionsForOwner(t, OWNER_A),
        getDefaultAccountState(t, OWNER_A),
      ])

      expect(ownerATransactions).toHaveLength(1)
      expect(ownerADefaultAccount.startingBalance).toBe(1500)
      expect(ownerADefaultAccount.netFlow).toBe(-500)

      await expectNoStoredState(t, OWNER_B)
    })
  })
})
