import { useState } from "react"
import { IonArrowDown, IonArrowUp } from "@/components/icons/ion"
import { buttonVariants } from "@/components/ui/button"
import type { Transaction } from "@/lib/types/transactions"
import { cn } from "@/lib/utils"

import ExpantionDrawer from "./ExpantionDrawer"

export default function TransactionListItem({
  transaction,
}: {
  transaction: Transaction
}) {
  const [open, setOpen] = useState<boolean>(false)
  const { _id: id, amount, note, type } = transaction
  const isExpense = type === "expense"

  return (
    <>
      {/* TODO: Use listbox instead of list */}
      {/** biome-ignore lint/a11y/noNoninteractiveElementInteractions: Will fix later */}
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: Will fix later */}
      <li
        className="flex items-center gap-3 pl-3"
        id={id}
        onClick={() => setOpen(true)}
      >
        <span
          className={cn(
            buttonVariants({
              isIconOnly: true,
              size: "sm",
              color: isExpense ? "red" : "green",
            })
          )}
        >
          {isExpense ? <IonArrowDown /> : <IonArrowUp />}
        </span>

        {/* "border-b-separator-opaque flex w-full items-center justify-between border-b pr-6 py-2 transaction-info" */}
        <div className="flex w-full items-center justify-between gap-4 truncate border-b-separator-opaque py-2 pr-4">
          <span
            className={cn(
              "flex-1 overflow-hidden whitespace-nowrap",
              note ? "font-bold text-label-primary/80" : "text-label-tertiary"
            )}
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, black 80%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, black 80%, transparent 100%)",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
          >
            {note || "Empty"}
          </span>
          <span className="truncate text-right font-semibold">${amount}</span>
        </div>
      </li>

      <ExpantionDrawer
        open={open}
        setOpen={setOpen}
        transaction={transaction}
      />
    </>
  )
}
