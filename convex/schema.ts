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
    // ownerId
    // account
  }),
  // TODO: do indexing
  // .index("by_owner_and_type", ["ownerId", "type"])
  // .index("by_owner", ["ownerId"]),

  categories: defineTable({
    name: v.string(),
    color: v.union(...colors.map(c => v.literal(c))),
    type: v.union(...transactionTypes.map(t => v.literal(t))),
    // ownerId
  }),
  // TODO: do indexing
  // .index("by_owner_and_type", ["ownerId", "type"])
  // .index("by_owner", ["ownerId"]),
})
