import { v } from "convex/values"

import { userQuery } from "./lib/userFunctions"
import { formatTransactionSummary } from "./lib/utils"

export const getFlowSummary = userQuery({
  args: {
    accounts: v.array(v.id("accounts")),
    timeframes: v.union(
      v.array(v.object({ start: v.number(), end: v.number() }))
    ),
  },
  handler: async (ctx, { accounts, timeframes }) => {
    const { user } = ctx
    /*
     * DB Query to get the transactions by each timeframe
     */
    const transactions = await Promise.all(
      timeframes.map(async (frame) => {
        const { start, end } = frame

        const txns = await ctx.db
          .query("transactions")
          .withIndex("by_date", (q) =>
            q.eq("ownerId", user.ownerId).gte("date", start).lte("date", end)
          )
          .collect()

        const relevantTransactions = accounts?.length
          ? txns.filter((v) => accounts.includes(v.account))
          : txns

        return {
          transactions: relevantTransactions,
          timeframe: { start, end },
        }
      })
    )

    /*
     * Format the return data
     */
    const formattedData = formatTransactionSummary(transactions)

    return formattedData
  },
})
