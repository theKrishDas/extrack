import {v} from "convex/values"

import {query} from "./_generated/server"

export const getTransactionsByTimeframe = query({
  args: {timeFrames: v.array(v.object({start: v.number(), end: v.number()}))},
  handler: async (ctx, {timeFrames}) => {
    // Fetch transactions for each time period
    const dailyTransactionGroups = await Promise.all(
      timeFrames.map(async ({start, end}) => {
        return await ctx.db
          .query("transactions")
          .withIndex("by_creation_time", q =>
            q.gte("_creationTime", start).lte("_creationTime", end)
          )
          .collect()
      })
    )

    // Process and categorize transactions for each day
    const dailyBreakdown = dailyTransactionGroups.map(
      (dayTransactions, idx) => {
        const {start, end} = timeFrames[idx]

        const incomeTransactions = dayTransactions.filter(
          t => t.type === "income"
        )
        const expenseTransactions = dayTransactions.filter(
          t => t.type === "expense"
        )

        return {
          timeframe: {start, end},
          income: {
            transactions: incomeTransactions,
            count: incomeTransactions.length,
            total: incomeTransactions.reduce((sum, t) => sum + t.amount, 0),
          },
          expense: {
            transactions: expenseTransactions,
            count: expenseTransactions.length,
            total: expenseTransactions.reduce((sum, t) => sum + t.amount, 0),
          },
          all: {
            transactions: dayTransactions,
            count: dayTransactions.length,
            total: dayTransactions.reduce((sum, t) => sum + t.amount, 0),
          },
        }
      }
    )

    // Flatten all transactions across the timeframe
    const allTransactions = dailyTransactionGroups.flat()
    const allIncomeTransactions = allTransactions.filter(
      t => t.type === "income"
    )
    const allExpenseTransactions = allTransactions.filter(
      t => t.type === "expense"
    )

    // Calculate the highest transaction amount
    const highestAmount =
      allTransactions.length > 0
        ? Math.max(...allTransactions.map(t => t.amount))
        : 0

    // Grab all transactions that match the highest amount
    const highestTransactions = allTransactions.filter(
      t => t.amount === highestAmount
    )

    // Calculate the lowest transaction amount
    const lowestAmount =
      allTransactions.length > 0
        ? Math.min(...allTransactions.map(t => t.amount))
        : 0

    // Grab all transactions that match the lowest amount
    const lowestTransactions = allTransactions.filter(
      t => t.amount === highestAmount
    )

    // Calculate summary statistics
    const summaryStats = {
      totalTransactionCount: allTransactions.length,
      totalIncomeCount: allIncomeTransactions.length,
      totalExpenseCount: allExpenseTransactions.length,
      totalIncomeAmount: allIncomeTransactions.reduce(
        (sum, t) => sum + t.amount,
        0
      ),
      totalExpenseAmount: allExpenseTransactions.reduce(
        (sum, t) => sum + t.amount,
        0
      ),
      netAmount:
        allIncomeTransactions.reduce((sum, t) => sum + t.amount, 0) -
        allExpenseTransactions.reduce((sum, t) => sum + t.amount, 0),
      highestDailyTransactionCount: Math.max(
        ...dailyBreakdown.map(day => day.all.count),
        0 // Fallback for empty arrays
      ),
      extremes: {
        highest: {
          amount: highestAmount,
          transactions: highestTransactions,
          count: highestTransactions.length,
        },
        lowest: {
          amount: lowestAmount,
          transactions: lowestTransactions,
          count: lowestTransactions.length,
        },
      },
    }

    return {
      // Raw data organized by day
      transactions: {
        raw: dailyTransactionGroups,
        breakdown: dailyBreakdown,
      },

      // All transactions flattened
      overview: {
        all: {
          transactions: allTransactions,
          count: allTransactions.length,
        },
        income: {
          transactions: allIncomeTransactions,
          count: allIncomeTransactions.length,
        },
        expense: {
          transactions: allExpenseTransactions,
          count: allExpenseTransactions.length,
        },
      },

      // Summary statistics
      stats: summaryStats,

      // Quick access properties for common use cases
      quickAccess: {
        totalTransactions: allTransactions.length,
        totalIncome: summaryStats.totalIncomeAmount,
        totalExpenses: summaryStats.totalExpenseAmount,
        netIncome: summaryStats.netAmount,
        busiestDay: Math.max(...dailyBreakdown.map(day => day.all.count), 0),
      },
    }
  },
})

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
    const transactionsByTimeframes = await Promise.all(
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
     * Calculate breakdowns for each timeframe
     */
    const breakdownsForEachFrame = transactionsByTimeframes.map(data => {
      const {transactions} = data

      const incomes = transactions.filter(t => t.type == "income")
      const expenses = transactions.filter(t => t.type == "expense")

      const totalFlow = transactions.reduce((acc, v) => acc + v.amount, 0)
      const expenseAmount = expenses.reduce((acc, v) => acc + v.amount, 0)
      const incomeAmount = totalFlow - expenseAmount
      const netFlow = incomeAmount - expenseAmount
      const eiRatio = expenseAmount / incomeAmount // this Could be infinity

      const count = transactions.length

      const breakdown = {
        totalFlow,
        expenseAmount,
        incomeAmount,
        netFlow,
        eiRatio,
        count,
      }

      return {...data, incomes, expenses, breakdown}
    })

    /*
     * Get only the breakdown info for each timeframe
     */
    const breakdownsByFrame = breakdownsForEachFrame.map(t => t.breakdown)

    /*
     * Breakdown accross all the timeframes
     */
    const totalFlow = breakdownsByFrame
      .map(b => b.totalFlow)
      .reduce((acc, v) => acc + v, 0)
    const expenseAmount = breakdownsByFrame
      .map(b => b.expenseAmount)
      .reduce((acc, v) => acc + v, 0)
    const incomeAmount = totalFlow - expenseAmount
    const netFlow = incomeAmount - expenseAmount
    const eiRatio = expenseAmount / incomeAmount // this Could be infinity

    const count = breakdownsByFrame
      .map(b => b.count)
      .reduce((acc, v) => acc + v, 0)

    const breakdown = {
      totalFlow,
      expenseAmount,
      incomeAmount,
      netFlow,
      eiRatio,
      count,
    }

    return {breakdown, byFrames: breakdownsForEachFrame}
  },
})
