import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

import { colors } from "../src/lib/constants/colors"
import { transactionTypes } from "../src/lib/constants/transaction-types"

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
    .index("by_type", ["ownerId", "type"])
    .index("by_account", ["ownerId", "account"])
    .index("by_category", ["ownerId", "category"]),

  categories: defineTable({
    ownerId: v.string(),
    name: v.string(),
    color: v.union(...colors.map((c) => v.literal(c))),
    type: v.union(...transactionTypes.map((t) => v.literal(t))),
    is_vendor: v.boolean(),
    icon: v.string(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_type", ["ownerId", "type"])
    .index("by_type_name", ["ownerId", "type", "name"]),

  accounts: defineTable({
    ownerId: v.string(),
    is_default: v.boolean(),
    name: v.string(),
    startingBalance: v.number(),
    currentBalance: v.number(),
    is_active: v.boolean(),
    icon: v.string(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_name", ["ownerId", "name"])
    .index("by_default", ["ownerId", "is_default"]),

  user: defineTable({
    ownerId: v.string(),
    defaultAccount: v.id("accounts"),
  }).index("by_owner", ["ownerId"]),
})
