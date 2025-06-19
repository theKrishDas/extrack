import {v} from "convex/values"

import {query} from "./_generated/server"
import {formatTransactionSummary} from "./utils"

export const getTransactionSummaryByTimeframe = query({
  args: {
    accounts: v.array(v.id("accounts")),
    timeframes: v.union(
      v.array(v.object({start: v.number(), end: v.number()}))
    ),
  },
  handler: async (ctx, {accounts, timeframes}) => {
    /*
     * DB Query to get the transactions by each timeframe
     */
    const transactions = await Promise.all(
      timeframes.map(async frame => {
        const {start, end} = frame

        const txns = await ctx.db
          .query("transactions")
          .withIndex("by_creation_time", q =>
            q.gte("_creationTime", start).lte("_creationTime", end)
          )
          .collect()

        const relevantTransactions = accounts?.length
          ? txns.filter(v => accounts.includes(v.account))
          : txns

        return {
          transactions: relevantTransactions,
          timeframe: {start, end},
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
