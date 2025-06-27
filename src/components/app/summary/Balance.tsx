"use client"

import {CSSProperties} from "react"
import NumberFlow from "@number-flow/react"
import {startOfMonth, subMonths} from "date-fns"
import {IoArrowDownCircle, IoArrowUpCircle} from "react-icons/io5"

import {CURRENCY} from "@/lib/date-utils"
import {useBalanceOn} from "@/hooks/convex/balance"

const Balance = () => {
  const date = startOfMonth(subMonths(new Date(), 0))
  const balances = useBalanceOn({
    date: date.getTime(),
    account: "all",
  })
  if (!balances) return <p>Loading balance...</p>

  const {balance: prevBalance, currentBalance: balance} = balances
  const balanceDiff = balance - prevBalance

  return (
    <div className="flex h-110 flex-col items-center justify-center pb-18 text-center">
      <NumberFlow
        className="text-6xl font-bold"
        style={{"--number-flow-char-height": "1.2ch"} as CSSProperties}
        format={{
          style: "currency",
          currency: CURRENCY,
          trailingZeroDisplay: "stripIfInteger",
        }}
        value={balance}
      />

      <p className="text-label-secondary flex items-center [&_svg]:mr-1 [&_svg]:text-lg">
        {balanceDiff < 0 ? <IoArrowDownCircle /> : <IoArrowUpCircle />}
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
