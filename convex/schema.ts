import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  tasks: defineTable({
    ownerId: v.string(),
    text: v.string(),
    isCompleted: v.boolean(),
    category: v.optional(v.id("categories")),
  }),
  categories: defineTable({
    ownerId: v.string(),
    name: v.string(),
  }),
})
