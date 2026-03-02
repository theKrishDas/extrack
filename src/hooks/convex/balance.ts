import { useQuery } from "convex/react"
import type { FunctionArgs } from "convex/server"
import { endOfToday } from "date-fns"
import { api } from "#/convex/_generated/api"

/**
 * Calculates a date range from a given start date up to an optional end date,
 * defaulting to the end of today if no end date is provided.
 * @param date - The start date timestamp in milliseconds (e.g., `Date.now()`).
 * @param end - Optional: The end date timestamp. Defaults to the end of today.
 * @returns An object containing the `start` and `end` timestamps for the range.
 */
export const getDateRange = (date: number, end?: number) => {
  // Determine the effective end of the range, defaulting to the end of the current day.
  const today = end ?? endOfToday().getTime()

  return { start: date, end: today }
}

/**
 * Custom hook to fetch the balance on a specific date for a given account.
 * Uses convex query internally
 *
 * @param date - The timestamp (in milliseconds) representing the desired date.
 * @param account - The account ID or "all" to fetch the balance for all accounts.
 * @returns An object containing the balance on the specified date and the current balance.
 */
export const useBalanceOn = ({
  date,
  account,
}: FunctionArgs<typeof api.accounts.getBalance> & {
  date: number
}): { balance: number; currentBalance: number } | undefined => {
  // Define the date range from the given historical date up to today.
  const { start, end } = getDateRange(date)

  // Fetch all transactions that occurred within the calculated date range from Convex.
  const transactionsBetween = useQuery(api.transactions.getBetweenTimeframe, {
    start,
    end,
  })

  // Fetch the current total balance across all accounts from Convex.
  const balance = useQuery(api.accounts.getBalance, { account })

  // If either transactions or the current balance are still loading, return undefined.
  if (transactionsBetween === undefined || balance === undefined) {
    return undefined
  }

  const relevantTransactions =
    account === "all"
      ? transactionsBetween
      : transactionsBetween.filter((t) => t.account === account)

  // Calculate the net flow (sum of all incomes minus all expenses) within the period
  // from the historical date up to today.
  const totalSpent = relevantTransactions.reduce((acc, t) => {
    // Determine the sign for the amount: 1 for income, -1 for expense.
    const dir = t.type === "expense" ? -1 : 1
    return acc + t.amount * dir
  }, 0)

  // Adjust the current balance to reflect the balance on the historical date.
  // This is done by subtracting the net flow that occurred *after* the historical date
  // from the current balance.
  const balanceAtDate = balance - totalSpent
  return { balance: balanceAtDate, currentBalance: balance }
}
