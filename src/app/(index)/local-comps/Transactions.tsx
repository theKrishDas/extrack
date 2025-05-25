"use client"

import {Fragment} from "react"
import {api} from "#/convex/_generated/api"
import {useQuery} from "convex/react"

import {cn} from "@/lib/utils"
import {buttonVariants} from "@/components/ui/button"

import TransactionListItem from "./TransactionListItem"

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
    <ul className="bg-fill-quaternary mx-auto flex max-w-xl flex-col gap-2 rounded-3xl py-2.5">
      {transactions.map(transaction => (
        <Fragment key={transaction._id}>
          <TransactionListItem transaction={transaction} />

          <Separator />
        </Fragment>
      ))}
    </ul>
  )
}

const Separator = () => {
  return (
    // hide separator if last
    <div className="flex w-full items-center gap-3 pl-3 [&:not(:has(+li))]:hidden">
      <span
        className={cn(
          // just to get the width of the icons as it changes on different
          // screen-sizes and I didn't want to hardcode it.
          buttonVariants({
            isIconOnly: true,
            size: "sm",
            className: "invisible h-0 sm:h-0",
          })
        )}
      />
      <div className="bg-separator-opaque h-px w-full rounded-full" />
    </div>
  )
}
