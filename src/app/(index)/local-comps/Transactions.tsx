"use client"

import {Fragment} from "react"
import {api} from "#/convex/_generated/api"
import {useQuery} from "convex/react"

import {cn} from "@/lib/utils"
import {buttonVariants} from "@/components/ui/button"

import TransactionListItem from "./TransactionListItem"

export default function Transactions() {
  const transactions = useQuery(api.transactions.getAll)

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
    <ul className="bg-fill-quaternary flex flex-col gap-2 rounded-3xl py-2.5">
      {transactions.map(transaction => (
        <Fragment key={transaction._id}>
          <TransactionListItem transaction={transaction} />

          {/* // hide separator if last */}
          <ListSeparator className="pl-3 [&:not(:has(+li))]:hidden" />
        </Fragment>
      ))}
    </ul>
  )
}

export const ListSeparator = ({className}: {className?: string}) => {
  // equivalent left padding: pl-17 sm:pl-14
  // This depents on the icon sizes (button sizes)
  return (
    <div className={cn("flex h-px w-full items-center gap-3", className)}>
      <span
        className={cn(
          // just to get the width of the icons as it changes on different
          // screen-sizes and I didn't want to hardcode it.
          buttonVariants({
            isIconOnly: true,
            size: "sm",
            className: "invisible h-full sm:h-full",
          })
        )}
      />
      <div className="bg-separator-opaque h-full flex-1 rounded-full" />
    </div>
  )
}
