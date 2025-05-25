import {useState} from "react"

import {Transaction} from "@/lib/types/transactions"
import {cn} from "@/lib/utils"
import {buttonVariants} from "@/components/ui/button"
import {IonArrowDown, IonArrowUp} from "@/components/icons/ion"

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
        className="flex items-center gap-3 pl-3"
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
        <div className="border-b-separator-opaque flex w-full items-center justify-between gap-4 truncate py-2 pr-4">
          <span
            className={cn(
              "flex-1 overflow-hidden whitespace-nowrap",
              note ? "text-label-primary/80 font-bold" : "text-label-tertiary"
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
            {note || "Add a note"}
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
