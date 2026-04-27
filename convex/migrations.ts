import { Migrations } from "@convex-dev/migrations"
import type { GenericMutationCtx } from "convex/server"
import { ConvexError, v } from "convex/values"
import {
  type TransactionTypes,
  transactionTypes,
} from "#lib/constants/transaction-types"
import { components, internal } from "./_generated/api"
import type { DataModel, Doc, Id } from "./_generated/dataModel"
import { internalMutation, internalQuery } from "./_generated/server"

const UNASSIGNED_CATEGORY_NAME = "Uncategorized" as const
const MIGRATED_CATEGORY_COLOR = "gray" as const
const MIGRATED_CATEGORY_ICON = "📦" as const

export const migrations = new Migrations<DataModel>(components.migrations)

type MigrationContext = GenericMutationCtx<DataModel>

export const runMigrateUsers = migrations.runner(
  internal.migrations.migrateUsers
)

export const migrateUsers = migrations.define({
  table: "migration_preference",
  batchSize: 1,
  migrateOne: async (ctx, doc) => {
    await migrateLegacyUser(ctx, doc.user_id)
  },
})

export const migrateUser = internalMutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    await migrateLegacyUser(ctx, userId)
  },
})

const migrateLegacyUser = async (ctx: MigrationContext, userId: string) => {
  const existingUser = await ctx.db
    .query("user")
    .withIndex("by_owner", (q) => q.eq("ownerId", userId))
    .unique()

  if (existingUser) return

  const [preferences, legacyCategories, legacyTransactions] = await Promise.all(
    [
      ctx.db
        .query("migration_preference")
        .withIndex("by_user_id", (q) => q.eq("user_id", userId))
        .collect(),
      ctx.db
        .query("migration_category")
        .withIndex("by_user_id", (q) => q.eq("user_id", userId))
        .collect(),
      ctx.db
        .query("migration_transax")
        .withIndex("by_user_id", (q) => q.eq("user_id", userId))
        .collect(),
    ]
  )

  if (!preferences.length) {
    throw new ConvexError(
      `Missing migration_preference row. Aborting migration for ${userId}.`
    )
  }

  if (preferences.length > 1) {
    throw new ConvexError(
      `Duplicate migration_preference rows found. Aborting migration for ${userId}.`
    )
  }

  assertUniqueLegacyCategoryIds(legacyCategories, userId)
  assertUniqueLegacyTransactionIds(legacyTransactions, userId)
  assertUniqueLegacyCategoryNames(legacyCategories, userId)

  await ctx.runMutation(internal.userOnboarding.onboardUser, { userId })

  const onboardedUser = await ctx.db
    .query("user")
    .withIndex("by_owner", (q) => q.eq("ownerId", userId))
    .unique()

  if (!onboardedUser) {
    throw new ConvexError(
      `Owner not found after onboarding. Aborting migration for ${userId}.`
    )
  }

  const categoryMap = new Map<string, Id<"categories">>()
  const uncategorizedByType = new Map<TransactionTypes, Id<"categories">>()

  for (const legacyCategory of legacyCategories) {
    const trimmedName = legacyCategory.name.trim()
    if (!trimmedName.length) {
      throw new ConvexError(
        `Empty category name found for ${legacyCategory.id}. Aborting migration for ${userId}.`
      )
    }

    const categoryType = getDocType(legacyCategory.is_expense)
    const resolvedCategoryId = await resolveCategoryId(ctx, {
      legacyId: legacyCategory.id,
      name: trimmedName,
      ownerId: onboardedUser.ownerId,
      type: categoryType,
    })

    categoryMap.set(legacyCategory.id, resolvedCategoryId)
  }

  const transactionTypesNeedingUncategorized = new Set<TransactionTypes>()

  for (const transaction of legacyTransactions) {
    if (isMissingCategory(transaction.category)) {
      transactionTypesNeedingUncategorized.add(
        getDocType(transaction.is_expense)
      )
    }
  }

  for (const transactionType of transactionTypesNeedingUncategorized) {
    const uncategorizedCategoryId = await resolveCategoryId(ctx, {
      legacyId: undefined,
      name: UNASSIGNED_CATEGORY_NAME,
      ownerId: onboardedUser.ownerId,
      type: transactionType,
    })
    uncategorizedByType.set(transactionType, uncategorizedCategoryId)
  }

  let netFlow = 0

  for (const legacyTransaction of legacyTransactions) {
    const amount = Math.abs(legacyTransaction.amount)
    if (!amount) continue

    const date = new Date(legacyTransaction.date).getTime()
    if (Number.isNaN(date)) {
      throw new ConvexError(
        `Invalid date found for ${legacyTransaction.id}. Aborting migration for ${userId}.`
      )
    }

    const transactionType = getDocType(legacyTransaction.is_expense)
    const categoryId = resolveTransactionCategoryId({
      categoryMap,
      legacyCategories,
      legacyTransaction,
      transactionType,
      uncategorizedByType,
      userId,
    })

    await ctx.db.insert("transactions", {
      ownerId: onboardedUser.ownerId,
      pg_id: legacyTransaction.id,
      account: onboardedUser.defaultAccount,
      category: categoryId,
      type: transactionType,
      amount,
      note: legacyTransaction.label,
      date,
    })

    netFlow += transactionType === "income" ? amount : -amount
  }

  await ctx.db.patch("accounts", onboardedUser.defaultAccount, {
    startingBalance: preferences[0].initial_balance,
    netFlow,
  })
}

const assertUniqueLegacyCategoryIds = (
  legacyCategories: Doc<"migration_category">[],
  userId: string
) => {
  const seenIds = new Set<string>()

  for (const category of legacyCategories) {
    if (seenIds.has(category.id)) {
      throw new ConvexError(
        `Duplicate legacy category id ${category.id}. Aborting migration for ${userId}.`
      )
    }
    seenIds.add(category.id)
  }
}

const assertUniqueLegacyTransactionIds = (
  legacyTransactions: Doc<"migration_transax">[],
  userId: string
) => {
  const seenIds = new Set<string>()

  for (const transaction of legacyTransactions) {
    if (seenIds.has(transaction.id)) {
      throw new ConvexError(
        `Duplicate legacy transaction id ${transaction.id}. Aborting migration for ${userId}.`
      )
    }
    seenIds.add(transaction.id)
  }
}

const assertUniqueLegacyCategoryNames = (
  legacyCategories: Doc<"migration_category">[],
  userId: string
) => {
  const seenNames = new Set<string>()

  for (const category of legacyCategories) {
    const trimmedName = category.name.trim()
    if (!trimmedName.length) continue

    const normalizedName = makeCategoryKey({
      type: getDocType(category.is_expense),
      name: trimmedName,
    })

    if (seenNames.has(normalizedName)) {
      throw new ConvexError(
        `Duplicate legacy category name ${trimmedName}. Aborting migration for ${userId}.`
      )
    }

    seenNames.add(normalizedName)
  }
}

const resolveCategoryId = async (
  ctx: MigrationContext,
  {
    legacyId,
    name,
    ownerId,
    type,
  }: {
    legacyId?: string
    name: string
    ownerId: string
    type: TransactionTypes
  }
) => {
  const normalizedName = normalizeCategoryName(name)
  const existingCategories = await ctx.db
    .query("categories")
    .withIndex("by_type_name", (q) => q.eq("ownerId", ownerId).eq("type", type))
    .collect()

  const existingCategory = existingCategories.find(
    (category) => normalizeCategoryName(category.name) === normalizedName
  )

  if (existingCategory) {
    if (legacyId) {
      await ctx.db.patch("categories", existingCategory._id, {
        pg_id: legacyId,
      })
    }
    return existingCategory._id
  }

  return await ctx.db.insert("categories", {
    color: MIGRATED_CATEGORY_COLOR,
    icon: MIGRATED_CATEGORY_ICON,
    is_vendor: false,
    name,
    ownerId,
    type,
    pg_id: legacyId,
  })
}

const resolveTransactionCategoryId = ({
  categoryMap,
  legacyCategories,
  legacyTransaction,
  transactionType,
  uncategorizedByType,
  userId,
}: {
  categoryMap: Map<string, Id<"categories">>
  legacyCategories: Doc<"migration_category">[]
  legacyTransaction: Doc<"migration_transax">
  transactionType: TransactionTypes
  uncategorizedByType: Map<TransactionTypes, Id<"categories">>
  userId: string
}) => {
  if (isMissingCategory(legacyTransaction.category)) {
    const uncategorizedCategoryId = uncategorizedByType.get(transactionType)
    if (!uncategorizedCategoryId) {
      throw new ConvexError(
        `Default uncategorized category for ${transactionType} not found. Aborting migration for ${userId}.`
      )
    }
    return uncategorizedCategoryId
  }

  const legacyCategoryId = legacyTransaction.category
  const matchingLegacyCategory = legacyCategories.find(
    (category) => category.id === legacyCategoryId
  )

  if (!matchingLegacyCategory) {
    throw new ConvexError(
      `Transaction ${legacyTransaction.id} is assigned to invalid category. Aborting migration for ${userId}.`
    )
  }

  const expectedType = getDocType(matchingLegacyCategory.is_expense)
  if (expectedType !== transactionType) {
    throw new ConvexError(
      `Transaction ${legacyTransaction.id} is assigned to category with mismatched type. Aborting migration for ${userId}.`
    )
  }

  const resolvedCategoryId = categoryMap.get(legacyCategoryId)
  if (!resolvedCategoryId) {
    throw new ConvexError(
      `Resolved category not found for ${legacyCategoryId}. Aborting migration for ${userId}.`
    )
  }

  return resolvedCategoryId
}

const isMissingCategory = (category: string | null | undefined) =>
  category === null || category === undefined || category === ""

const normalizeCategoryName = (name: string) => name.trim().toLocaleLowerCase()

const makeCategoryKey = ({
  type,
  name,
}: {
  type: TransactionTypes
  name: string
}) => `${type}:${normalizeCategoryName(name)}`

const getDocType = (isExpense: boolean) => {
  return (isExpense ? "expense" : "income") satisfies TransactionTypes
}

export const getCategoryNameFromTransaction = internalQuery({
  args: { categoryId: v.optional(v.nullable(v.string())) },
  handler: async (ctx, { categoryId }) => {
    if (!categoryId) return UNASSIGNED_CATEGORY_NAME

    const category = await ctx.db
      .query("migration_category")
      .withIndex("by_oid", (q) => q.eq("id", categoryId))
      .first()

    if (!category) throw new ConvexError("Invariant error")

    if (category.name.length) return category.name

    return UNASSIGNED_CATEGORY_NAME
  },
})

export const createCategoryFromNameIfNotExist = internalMutation({
  args: {
    categoryName: v.string(),
    type: v.union(...transactionTypes.map((t) => v.literal(t))),
    ownerId: v.string(),
  },
  handler: async (ctx, { categoryName, type, ownerId }) => {
    const trimmed = categoryName.trim()

    const existingCategories = await ctx.db
      .query("categories")
      .withIndex("by_type_name", (q) =>
        q.eq("ownerId", ownerId).eq("type", type)
      )
      .collect()
    const existing = existingCategories.find(
      (category) =>
        category.name.toLocaleLowerCase() === trimmed.toLocaleLowerCase()
    )
    if (existing) return existing._id

    const newName = trimmed.length ? trimmed : UNASSIGNED_CATEGORY_NAME

    return await ctx.db.insert("categories", {
      color: MIGRATED_CATEGORY_COLOR,
      icon: MIGRATED_CATEGORY_ICON,
      is_vendor: false,
      name: newName,
      ownerId,
      type,
    })
  },
})
