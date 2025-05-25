import {useState} from "react"

import {Transaction} from "@/lib/types/transactions"
import {cn} from "@/lib/utils"
import {buttonVariants} from "@/components/ui/button"
import {
  MatArrowDownwardAltRounded,
  MatArrowUpwardAltRounded,
} from "@/components/icons/mat"

import ExpantionDrawer from "./ExpantionDrawer"

export default function TransactionListItem({
  transaction,
}: {
  transaction: Transaction
}) {
  const [open, setOpen] = useState<boolean>(false)
  const {_id: id, amount, note, type} = transaction
  const isExpense = type === "expense"

  return (
    <>
      <li
        id={id}
        className="flex items-center gap-4 pl-4"
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
              note
                ? "text-label-primary/80 font-medium"
                : "text-label-secondary"
            )}
          >
            {note || "Add a note..."}
          </span>
          <span className="text-right font-semibold">${amount}</span>
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
