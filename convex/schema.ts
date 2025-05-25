import {defineSchema, defineTable} from "convex/server"
import {v} from "convex/values"

export default defineSchema({
  transactions: defineTable({
    amount: v.number(),
    note: v.optional(v.string()),
    type: v.union(v.literal("expense"), v.literal("income")),
    // ownerId
    // category
  }),
})
