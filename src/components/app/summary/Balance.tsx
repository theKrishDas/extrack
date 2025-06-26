"use client"

import {useNumberFormatter} from "@react-aria/i18n"
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
  const formatter = useNumberFormatter({
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 0,
  })

  if (!balances) return <p>Loading balance...</p>

  const {balance: prevBalance, currentBalance: balance} = balances
  const fmtBalance = formatter.format(balance)
  const balanceDiff = balance - prevBalance
  const fmtBalanceDiff = formatter.format(Math.abs(balanceDiff))

  return (
    <div className="flex h-110 flex-col items-center justify-center pb-18 text-center">
      <p className="text-6xl leading-snug font-bold">{fmtBalance}</p>
      <p className="text-label-secondary flex items-center [&_svg]:mr-1 [&_svg]:text-lg">
        {balanceDiff < 0 ? <IoArrowDownCircle /> : <IoArrowUpCircle />}
        {fmtBalanceDiff} from last month
      </p>
    </div>
  )
}

export default Balance
