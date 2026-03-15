import { ConvexError } from "convex/values"
import { NoOp } from "convex-helpers/server/customFunctions"
import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod3"
import type { Doc } from "../_generated/dataModel"
import type { MutationCtx, QueryCtx } from "../_generated/server"
import { mutation, query } from "../functions"

/** @deprecated Use `zUserMutation` from ./userFunctions instead. */
export const zMutation = zCustomMutation(mutation, NoOp)

/** @deprecated Use `zUserQuery` from ./userFunctions instead. */
export const zQuery = zCustomQuery(query, NoOp)

// biome-ignore lint/performance/noBarrelFile: we need to export zid for convenience
export { zid } from "convex-helpers/server/zod3"

/** @deprecated Use `userQuery`/`userMutation` from ./userFunctions instead. */
export async function getCurrentUserOrThrow(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) throw new ConvexError({ code: "UNAUTHENTICATED" })

  const user = await ctx.db
    .query("user")
    .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
    .unique()

  if (!user) throw new ConvexError({ code: "USER_NOT_STORED" })

  return user
}

type FormatTransactionSummaryType = {
  transactions: Doc<"transactions">[]
  timeframe: { start: number; end: number }
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
