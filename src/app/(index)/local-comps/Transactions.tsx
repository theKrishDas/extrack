"use client"

import {Fragment} from "react"
import {api} from "#/convex/_generated/api"
import {useQuery} from "convex/react"

import {type Transaction} from "@/lib/types/transactions"
import {cn} from "@/lib/utils"
import {buttonVariants} from "@/components/ui/button"
import {
  MatArrowDownwardAltRounded,
  MatArrowUpwardAltRounded,
} from "@/components/icons/mat"

export default function Transactions() {
  const transactions = useQuery(api.transactions.get)

  // Loading state
  if (!transactions)
    return (
      <div className="inline-grid w-full place-content-center py-4">
        Loading...
      </div>
    )

  // No transactions state
  if (transactions.length === 0)
    return (
      <div className="bg-fill-tertiary text-label-tertiary inline-grid w-full place-content-center py-4">
        No transactions found!
      </div>
    )

  // Render the transaction lists
  return (
    <ul className="bg-fill-quaternary mx-auto flex max-w-xl flex-col gap-2 rounded-2xl py-2">
      {transactions.map(transaction => (
        <Fragment key={transaction._id}>
          <List transaction={transaction} />

          {/* hide separator if last */}
          <Separator />
        </Fragment>
      ))}
    </ul>
  )
}

const List = ({transaction}: {transaction: Transaction}) => {
  const {_id: id, amount, note, type} = transaction
  const isExpense = type === "expense"

  return (
    <li id={id} className="flex items-center gap-4 pl-4">
      <span
        className={cn(
          buttonVariants({
            isIconOnly: true,
            size: "sm",
            color: isExpense ? "red" : "green",
          })
        )}
      >
        {isExpense ? (
          <MatArrowDownwardAltRounded />
        ) : (
          <MatArrowUpwardAltRounded />
        )}
      </span>

      {/* "border-b-separator-opaque flex w-full items-center justify-between border-b pr-6 py-2 transaction-info" */}
      <div className="border-b-separator-opaque flex w-full items-center justify-between py-2 pr-6">
        <span
          className={cn(
            note ? "text-label-primary/80 font-medium" : "text-label-secondary"
          )}
        >
          {note || "Add a note..."}
        </span>
        <span className="text-right font-semibold">${amount}</span>
      </div>
    </li>
  )
}

const Separator = () => {
  return (
    <div className="flex w-full items-center gap-4 pl-4 [&:not(:has(+li))]:hidden">
      <span
        className={cn(
          // just to get the width of the icons as it changes on different
          // screen-sizes and I didn't want to hardcode it.
          buttonVariants({
            isIconOnly: true,
            size: "sm",
          }),
          "invisible h-0 sm:h-0"
        )}
      />
      <div className="bg-separator-opaque h-px w-full rounded-full" />
    </div>
  )
}
