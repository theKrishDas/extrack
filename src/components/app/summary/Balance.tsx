"use client"

import NumberFlow from "@number-flow/react"
import { startOfMonth, subMonths } from "date-fns"
import type { CSSProperties } from "react"
import { IoArrowDown, IoArrowUp } from "react-icons/io5"
import { useBalanceOn } from "@/hooks/convex/balance"
import { CURRENCY } from "@/lib/date-utils"

const Balance = () => {
  const date = startOfMonth(subMonths(new Date(), 0))
  const balances = useBalanceOn({
    date: date.getTime(),
    account: "*",
  })
  if (!balances) return <p>Loading balance...</p>

  const { balance: prevBalance, currentBalance: balance } = balances
  const balanceDiff = balance - prevBalance

  return (
    <div className="flex h-110 flex-col items-center justify-center pb-18 text-center">
      <NumberFlow
        className="font-bold text-6xl"
        format={{
          style: "currency",
          currency: CURRENCY,
          trailingZeroDisplay: "stripIfInteger",
          maximumFractionDigits: 2,
        }}
        style={{ "--number-flow-char-height": "1.2ch" } as CSSProperties}
        value={balance / 100}
      />

      <p className="flex items-center text-label-secondary [&_svg]:mr-1 [&_svg]:text-lg">
        {balanceDiff < 0 ? (
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
          value={Math.abs(balanceDiff)}
        />
        from last month
      </p>
    </div>
  )
}

export default Balance
