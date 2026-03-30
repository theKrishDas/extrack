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
  })
    .index("by_owner", ["ownerId"])
    .index("by_date", ["ownerId", "date"])
    .index("by_owner_type_date", ["ownerId", "type", "date"])
    .index("by_account", ["ownerId", "account"])
    .index("by_category", ["ownerId", "category"]),

  categories: defineTable({
    ownerId: v.string(),
    name: v.string(),
    type: v.union(...transactionTypes.map((t) => v.literal(t))),
    color: v.union(...colors.map((c) => v.literal(c))),
    icon: v.string(),
    is_vendor: v.boolean(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_type_name", ["ownerId", "type", "name"]),

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
})
