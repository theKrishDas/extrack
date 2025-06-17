"use client"

import {useNumberFormatter} from "@react-aria/i18n"
import {startOfMonth, subMonths} from "date-fns"

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
  const fmtBalanceDiff = formatter.format(balanceDiff)

  return (
    <>
      <p>{fmtBalance}</p>
      <p>{fmtBalanceDiff} from last month</p>
    </>
  )
}

export default Balance
