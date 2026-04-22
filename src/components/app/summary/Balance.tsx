"use client"

/**
 * Balance summary with month-over-month delta.
 *
 * ## Month-over-month delta
 *
 * The "from last month" value compares **this month's net flow** to **last month's net flow**:
 *
 * - **Flow this month** = current balance − balance at start of this month
 * - **Flow previous month** = balance at start of this month − balance at start of previous month
 * - **Delta** = flow this month − flow previous month
 *
 * A positive delta means the user gained (or lost less) this month than last month; negative means the opposite.
 * Balances and flows use the same sign convention (e.g. stored in cents).
 */

import NumberFlow from "@number-flow/react"
import { startOfMonth, subMonths } from "date-fns"
import type { CSSProperties } from "react"
import { IoArrowDown, IoArrowUp } from "react-icons/io5"
import { useBalanceOn } from "@/hooks/convex/balance"
import { CURRENCY } from "@/lib/date-utils"

const Balance = () => {
  const startOfCurrentMonth = startOfMonth(subMonths(new Date(), 0))
  const startOfPreviousMonth = startOfMonth(subMonths(new Date(), 1))

  const balancesCurrent = useBalanceOn({
    date: startOfCurrentMonth.getTime(),
    account: "*",
  })
  const balancesPrevious = useBalanceOn({
    date: startOfPreviousMonth.getTime(),
    account: "*",
  })

  const balanceAtStartOfCurrentMonth = balancesCurrent?.balance ?? 0
  const currentBalance = balancesCurrent?.currentBalance ?? 0
  const balanceAtStartOfPreviousMonth = balancesPrevious?.balance ?? 0

  const flowThisMonth = currentBalance - balanceAtStartOfCurrentMonth
  const flowPrevMonth =
    balanceAtStartOfCurrentMonth - balanceAtStartOfPreviousMonth
  const delta = flowThisMonth - flowPrevMonth

  return (
    <div className="flex h-fit flex-col items-center justify-center text-center">
      <NumberFlow
        className="h-24 w-fit max-w-full font-bold text-6xl [&::part(fraction)]:text-[0.45em] [&::part(fraction)]:text-label-secondary"
        format={{
          style: "currency",
          currency: CURRENCY,
          trailingZeroDisplay: "stripIfInteger",
          maximumFractionDigits: 2,
        }}
        style={{ "--number-flow-char-height": "100%" } as CSSProperties}
        value={currentBalance / 100}
      />

      <p className="flex items-center text-label-secondary [&_svg]:mr-1 [&_svg]:text-lg">
        {delta < 0 ? (
          <IoArrowDown color="var(--ios-red)" />
        ) : (
          <IoArrowUp color="var(--ios-green)" />
        )}
        <NumberFlow
          className="mr-[0.5ch]"
          format={{
            style: "currency",
            currency: CURRENCY,
            trailingZeroDisplay: "stripIfInteger",
          }}
          value={Math.abs(delta) / 100}
        />
        from last month
      </p>
    </div>
  )
}

export default Balance
