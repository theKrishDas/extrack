import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import { colors } from "#lib/constants/colors"
import { transactionTypes } from "#lib/constants/transaction-types"

export default defineSchema({
  transactions: defineTable({
    ownerId: v.string(),
    amount: v.number(),
    note: v.optional(v.string()),
    type: v.union(...transactionTypes.map((t) => v.literal(t))),
    category: v.id("categories"),
    account: v.id("accounts"),
    date: v.number(),
    pg_id: v.optional(v.string()), // CAUTION: REMOVE when all users are successfully migrated
  })
    .index("by_owner", ["ownerId"])
    .index("by_date", ["ownerId", "date"])
    .index("by_owner_type_date", ["ownerId", "type", "date"])
    .index("by_account", ["ownerId", "account"])
    .index("by_category", ["ownerId", "category"])
    .index("by_pg_id", ["ownerId", "pg_id"]), // CAUTION: REMOVE when all users are successfully migrated

  categories: defineTable({
    ownerId: v.string(),
    name: v.string(),
    type: v.union(...transactionTypes.map((t) => v.literal(t))),
    color: v.union(...colors.map((c) => v.literal(c))),
    icon: v.string(),
    is_vendor: v.boolean(),
    pg_id: v.optional(v.string()), // CAUTION: REMOVE when all users are successfully migrated
  })
    .index("by_owner", ["ownerId"])
    .index("by_type_name", ["ownerId", "type", "name"])
    .index("by_type_pg_id", ["ownerId", "type", "pg_id"]), // CAUTION: REMOVE when all users are successfully migrated

  accounts: defineTable({
    ownerId: v.string(),
    name: v.string(),
    startingBalance: v.number(),
    icon: v.string(),
    netFlow: v.number(),
    is_active: v.boolean(),
    is_archived: v.boolean(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_name", ["ownerId", "name"]),

  user: defineTable({
    ownerId: v.string(),
    defaultAccount: v.id("accounts"),
  }).index("by_owner", ["ownerId"]),

  // --- temporary migration tables ---

  migration_preference: defineTable({
    user_id: v.string(),
    joined_at: v.string(),
    initial_balance: v.number(),
  }).index("by_user_id", ["user_id"]),

  migration_category: defineTable({
    id: v.string(), // TODO: rename this to pg_id
    user_id: v.string(),
    name: v.string(),
    is_expense: v.boolean(),
  })
    .index("by_oid", ["id"])
    .index("by_user_id", ["user_id"]),

  migration_transax: defineTable({
    id: v.string(), // TODO: rename this to pg_id
    user_id: v.string(),
    amount: v.number(),
    label: v.optional(v.string()),
    is_expense: v.boolean(),
    date: v.string(),
    category: v.optional(v.union(v.string(), v.null())),
  })
    .index("by_oid", ["id"])
    .index("by_user_id", ["user_id"]),
})
