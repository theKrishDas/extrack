import {
  eachDayOfInterval,
  endOfDay,
  endOfToday,
  startOfDay,
  subDays,
} from "date-fns"
import type { TransactionTypes } from "#lib/constants/transaction-types"

export type TransactionLike<TExtra = unknown> = {
  amount: number
  type: TransactionTypes
  date: number | Date | string
} & TExtra

/**
 * Builds a complete daily balance timeline for a given lookback window.
 * Gaps between transactions are filled by carrying the previous day's balance forward.
 *
 * @param transactions - Sparse transactions within the lookback window, each with a positive
 *   integer amount. Sign is derived from `type`.
 * @param balanceAsOf - Settled EOD balance of `referenceDate`. Must include all transactions
 *   to date — caller's responsibility.
 * @param lookbackDays - Number of days before `referenceDate` to include. `0` = today only.
 *   Must be a non-negative integer. Output length = `lookbackDays + 1`.
 * @param referenceDate - The anchor date, normalized to EOD internally. Defaults to today.
 *
 * @returns Entries sorted ascending by date, each `date` normalized to SOD (midnight).
 *
 * @example
 * // $1000 settled balance as of today, with a $200 income recorded yesterday.
 * // The day before yesterday carries the pre-income balance; today carries forward.
 * buildDailyBalanceTimeline({
 *   transactions: [{ amount: 200, type: "income", date: oneDayAgoTimestamp }],
 *   balanceAsOf: 1000,
 *   lookbackDays: 2,
 * })
 * // [
 * //   { date: Date(day-2), balance: 800 },  // pre-income
 * //   { date: Date(day-1), balance: 1000 }, // income applied
 * //   { date: Date(day-0), balance: 1000 }, // carried forward
 * // ]
 */
export function buildDailyBalanceTimeline<T extends TransactionLike>({
  transactions,
  balanceAsOf,
  lookbackDays,
  referenceDate,
}: {
  transactions: T[]
  balanceAsOf: number
  lookbackDays: number
  referenceDate?: Date
}): { date: Date; balance: number }[] {
  const [sparseDailyNet, periodNet] = getSparse(transactions)

  const endDate = referenceDate ? endOfDay(referenceDate) : endOfToday()
  const startDate = startOfDay(subDays(endDate, lookbackDays))
  const interval = eachDayOfInterval({ start: startDate, end: endDate })

  let acc = periodNet
  const dailyBalances = interval.map((day) => {
    const key = day.toDateString()
    const dayNet = sparseDailyNet.get(key) ?? 0

    acc -= dayNet
    const balance = balanceAsOf - acc
    return { date: day, balance }
  })

  return dailyBalances
}

/** Nets transactions by day and returns those daily totals with the overall net. */
function getSparse(
  transactions: TransactionLike[]
): [Map<string, number>, number] {
  const sparseDailyNet = new Map<string, number>()
  let periodNet = 0
  for (const txn of transactions) {
    const key = endOfDay(txn.date).toDateString()
    const net = sparseDailyNet.get(key) ?? 0
    const amount = txn.amount * (txn.type === "expense" ? -1 : 1)
    periodNet += amount
    sparseDailyNet.set(key, net + amount)
  }

  return [sparseDailyNet, periodNet]
}
