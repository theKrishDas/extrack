import type { Doc } from "./_generated/dataModel"
import type { MutationCtx, QueryCtx } from "./_generated/server"

type FormatTransactionSummaryType = {
  transactions: Doc<"transactions">[]
  timeframe: { start: number; end: number }
}

/**
 * Gets the authenticated user ID from the Clerk session.
 * @throws Error if the user is not authenticated
 * @returns The Clerk user ID (subject)
 */
export async function getAuthenticatedUserId(
  ctx: QueryCtx | MutationCtx
): Promise<string> {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) {
    throw new Error("User not authenticated")
  }
  return identity.subject
}

function formatTransactionSummary(args: FormatTransactionSummaryType[]) {
  /*
   * Calculate breakdowns for each timeframe
   */
  const breakdownsForEachFrame = args.map((data) => {
    const { transactions: txn } = data

    const incomes = txn.filter((t) => t.type === "income")
    const expenses = txn.filter((t) => t.type === "expense")

    const totalFlow = txn.reduce((acc, v) => acc + v.amount, 0)
    const expenseAmount = expenses.reduce((acc, v) => acc + v.amount, 0)
    const incomeAmount = totalFlow - expenseAmount
    const netFlow = incomeAmount - expenseAmount
    const eiRatio = expenseAmount / incomeAmount // this Could be infinity

    const count = txn.length

    const breakdown = {
      totalFlow,
      expenseAmount,
      incomeAmount,
      netFlow,
      eiRatio,
      count,
    }

    return { ...data, incomes, expenses, breakdown }
  })

  /*
   * Get only the breakdown info for each timeframe
   */
  const breakdownsByFrame = breakdownsForEachFrame.map((t) => t.breakdown)

  /*
   * Breakdown accross all the timeframes
   */
  const totalFlow = breakdownsByFrame
    .map((b) => b.totalFlow)
    .reduce((acc, v) => acc + v, 0)
  const expenseAmount = breakdownsByFrame
    .map((b) => b.expenseAmount)
    .reduce((acc, v) => acc + v, 0)
  const incomeAmount = totalFlow - expenseAmount
  const netFlow = incomeAmount - expenseAmount
  const eiRatio = expenseAmount / incomeAmount // this Could be infinity

  const highestFlow = Math.max(...breakdownsByFrame.map((b) => b.totalFlow))
  const lowestFlow = Math.min(...breakdownsByFrame.map((b) => b.totalFlow))

  const count = breakdownsByFrame
    .map((b) => b.count)
    .reduce((acc, v) => acc + v, 0)

  const breakdown = {
    totalFlow,
    expenseAmount,
    incomeAmount,
    netFlow,
    highestFlow,
    lowestFlow,
    eiRatio,
    count,
  }

  return { breakdown, byFrames: breakdownsForEachFrame }
}

export { formatTransactionSummary, type FormatTransactionSummaryType }
