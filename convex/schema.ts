import {defineSchema, defineTable} from "convex/server"
import {v} from "convex/values"

import {colors} from "../src/lib/constants/colors"
import {transactionTypes} from "../src/lib/constants/transaction-types"

export default defineSchema({
  transactions: defineTable({
    amount: v.number(),
    note: v.optional(v.string()),
    type: v.union(...transactionTypes.map(t => v.literal(t))),
    category: v.id("categories"),
    account: v.id("accounts"),
    // ownerId
  })
    .index("by_category_account", ["category", "account"])
    .index("by_category", ["category"])
    .index("by_account", ["account"])
    .index("by_type", ["type"]),

  categories: defineTable({
    name: v.string(),
    color: v.union(...colors.map(c => v.literal(c))),
    type: v.union(...transactionTypes.map(t => v.literal(t))),
    // ownerId
  }).index("by_type", ["type"]),

  accounts: defineTable({
    //ownerId
    name: v.string(),
    startingBalance: v.number(),
    currentBalance: v.number(),
    is_active: v.boolean(),
  }).index("by_name", ["name"]),
})
