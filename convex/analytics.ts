import {v} from "convex/values"

import {query} from "./_generated/server"

export const getTopCategoriesByType = query({
  args: {
    transactionType: v.union(v.literal("income"), v.literal("expense")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const {transactionType, limit = 5} = args

    // Get all categories of the specified type
    const categories = await ctx.db
      .query("categories")
      .filter(q => q.eq(q.field("type"), transactionType))
      .take(limit)

    // Count transactions for each relevant category
    const categoryStats = await Promise.all(
      categories.map(async category => {
        const usageCount = await ctx.db
          .query("transactions")
          .withIndex("by_category", q => q.eq("category", category._id))
          .collect()
          .then(transactions => transactions.length)

        return {
          ...category,
          usageCount,
        }
      })
    )

    // Sort by transaction count and return top results
    return categoryStats
      .filter(category => category.usageCount > 0)
      .sort((a, b) => b.usageCount - a.usageCount)
  },
})
