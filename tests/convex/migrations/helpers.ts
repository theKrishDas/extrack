import { runToCompletion } from "@convex-dev/migrations"
import migrationsComponent from "@convex-dev/migrations/test"
import type { FunctionReference } from "convex/server"
import { convexTest, type TestConvex } from "convex-test"
import { components } from "#/convex/_generated/api"
import type { Doc, Id } from "#/convex/_generated/dataModel"
import schema from "#/convex/schema"
import type { TransactionTypes } from "#lib/constants/transaction-types"

export type MigrationTestConvex = TestConvex<typeof schema>

export const OWNER_A = "migration_owner_a"
export const OWNER_B = "migration_owner_b"

export const createMigrationTest = () => {
  const t = convexTest(schema)
  migrationsComponent.register(t)
  return t
}

export const runMigrationToCompletion = async (
  t: MigrationTestConvex,
  migration: FunctionReference<"mutation", "internal">
) =>
  await t.run(async (ctx) => {
    await runToCompletion(ctx, components.migrations, migration)
  })

export const seedMigrationPreference = async (
  t: MigrationTestConvex,
  {
    userId = OWNER_A,
    joinedAt = "2024-01-01T00:00:00.000Z",
    initialBalance = 0,
  }: {
    userId?: string
    joinedAt?: string
    initialBalance?: number
  } = {}
) =>
  await t.run((ctx) =>
    ctx.db.insert("migration_preference", {
      user_id: userId,
      joined_at: joinedAt,
      initial_balance: initialBalance,
    })
  )

export const seedMigrationCategory = async (
  t: MigrationTestConvex,
  {
    id,
    userId = OWNER_A,
    name,
    isExpense = true,
  }: {
    id: string
    userId?: string
    name: string
    isExpense?: boolean
  }
) =>
  await t.run((ctx) =>
    ctx.db.insert("migration_category", {
      id,
      user_id: userId,
      name,
      is_expense: isExpense,
    })
  )

export const seedMigrationTransaction = async (
  t: MigrationTestConvex,
  {
    id,
    userId = OWNER_A,
    amount,
    label,
    isExpense,
    date = "2024-01-01T00:00:00.000Z",
    category,
  }: {
    id: string
    userId?: string
    amount: number
    label?: string
    isExpense: boolean
    date?: string
    category?: string | null
  }
) =>
  await t.run((ctx) =>
    ctx.db.insert("migration_transax", {
      id,
      user_id: userId,
      amount,
      label,
      is_expense: isExpense,
      date,
      category,
    })
  )

export const getStoredUser = async (t: MigrationTestConvex, ownerId: string) =>
  await t.run((ctx) =>
    ctx.db
      .query("user")
      .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
      .unique()
  )

export const listStoredUsers = async (
  t: MigrationTestConvex,
  ownerId: string
) =>
  await t.run((ctx) =>
    ctx.db
      .query("user")
      .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
      .collect()
  )

export const listAccountsForOwner = async (
  t: MigrationTestConvex,
  ownerId: string
) =>
  await t.run((ctx) =>
    ctx.db
      .query("accounts")
      .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
      .collect()
  )

export const listCategoriesForOwner = async (
  t: MigrationTestConvex,
  ownerId: string
) =>
  await t.run((ctx) =>
    ctx.db
      .query("categories")
      .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
      .collect()
  )

export const listTransactionsForOwner = async (
  t: MigrationTestConvex,
  ownerId: string
) =>
  await t.run((ctx) =>
    ctx.db
      .query("transactions")
      .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
      .collect()
  )

export const getAccount = async (
  t: MigrationTestConvex,
  accountId: Id<"accounts">
) => {
  const account = await t.run((ctx) => ctx.db.get(accountId))
  if (!account) throw new Error(`Expected account ${accountId} to exist`)
  return account
}

export const getCategory = async (
  t: MigrationTestConvex,
  categoryId: Id<"categories">
) => {
  const category = await t.run((ctx) => ctx.db.get(categoryId))
  if (!category) throw new Error(`Expected category ${categoryId} to exist`)
  return category
}

export const countTransactionsByLegacyId = async (
  t: MigrationTestConvex,
  ownerId: string,
  legacyId: string
) => {
  const matchingTransactions = await t.run((ctx) =>
    ctx.db
      .query("migration_transax")
      .withIndex("by_user_id", (q) => q.eq("user_id", ownerId))
      .filter((q) => q.eq(q.field("id"), legacyId))
      .collect()
  )

  return matchingTransactions.length
}

export const computeExpectedNetFlow = (
  transactions: Pick<Doc<"transactions">, "amount" | "type">[]
) => {
  let netFlow = 0

  for (const transaction of transactions) {
    netFlow +=
      transaction.type === "income" ? transaction.amount : -transaction.amount
  }

  return netFlow
}

export const findCategoryByNameAndType = (
  categories: Doc<"categories">[],
  name: string,
  type: TransactionTypes
) =>
  categories.find(
    (category) => category.name === name && category.type === type
  )
