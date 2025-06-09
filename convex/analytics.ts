import {v} from "convex/values"

import {Id} from "./_generated/dataModel"
import {query} from "./_generated/server"

export const getTopTransactionAmounts = query({
  args: {
    startTime: v.number(),
    endTime: v.number(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const {startTime, endTime, limit = 5} = args

    // Get transactions within the date range using the by_creation_time index
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_creation_time", q =>
        q.gte("_creationTime", startTime).lte("_creationTime", endTime)
      )
      .collect()

    // Count occurrences of each amount
    const amountCounts = new Map<number, number>()
    transactions.forEach(transaction => {
      const amount = transaction.amount
      amountCounts.set(amount, (amountCounts.get(amount) || 0) + 1)
    })

    // Convert to array, sort by amount descending
    return Array.from(amountCounts.entries())
      .map(([amount, count]) => ({amount, count}))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit)
  },
})

export const getTopCategories = query({
  args: {
    transactionType: v.union(v.literal("income"), v.literal("expense")),
    account: v.optional(v.id("accounts")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const {transactionType, account, limit = 5} = args

    // Get all categories of the specified type
    const categories = await ctx.db
      .query("categories")
      .filter(q => q.eq(q.field("type"), transactionType))
      .take(limit)

    // Count transactions for each relevant category
    const categoryStats = await Promise.all(
      categories.map(async category => {
        const usageCount = account
          ? await ctx.db
              .query("transactions")
              .withIndex("by_category_account", q =>
                q.eq("category", category._id).eq("account", account)
              )
              .collect()
              .then(transactions => transactions.length)
          : await ctx.db
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

export const getCategoryUsageStats = query({
  args: {
    categoryId: v.id("categories"),
  },
  handler: async (ctx, args) => {
    const {categoryId} = args

    // Get the category details
    const category = await ctx.db.get(categoryId)
    if (!category) {
      throw new Error("Category not found")
    }

    // Get all transactions for this category
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_category", q => q.eq("category", categoryId))
      .collect()

    // Calculate statistics
    const totalTransactions = transactions.length
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0)
    const averageAmount =
      totalTransactions > 0 ? totalAmount / totalTransactions : 0

    // Get transactions by account
    const accountUsage = new Map<Id<"accounts">, number>()
    for (const transaction of transactions) {
      const count = accountUsage.get(transaction.account) || 0
      accountUsage.set(transaction.account, count + 1)
    }

    // Get account details for the top accounts
    const topAccounts = []
    for (const [accountId, count] of accountUsage.entries()) {
      const account = await ctx.db.get(accountId)
      if (!account) {
        throw new Error("Account not found")
      }

      topAccounts.push({
        accountId,
        accountName: account.name,
        transactionCount: count,
      })
    }

    // Sort accounts by usage
    topAccounts.sort((a, b) => b.transactionCount - a.transactionCount)

    return {
      category: {
        id: category._id,
        name: category.name,
        color: category.color,
        type: category.type,
      },
      stats: {
        totalTransactions,
        totalAmount,
        averageAmount,
      },
      topAccounts: topAccounts.slice(0, 5), // Top 5 accounts
    }
  },
})
