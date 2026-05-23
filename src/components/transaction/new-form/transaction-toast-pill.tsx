"use client"

import { LuArrowDown, LuArrowUp } from "react-icons/lu"
import type { Colors } from "#lib/constants/colors"
import type { TransactionTypes } from "#lib/constants/transaction-types"
import { Emoji } from "@/components/ui/emoji"
import { useCurrencyFormatter } from "@/hooks/useCurrencyFormatter"
import { cn } from "@/lib/utils"

export type TransactionToastPillProps = {
  type: TransactionTypes
  amount: number
  categoryName: string
  emoji: string
  color: Colors
}

export function TransactionToastPill({
  type,
  amount,
  categoryName,
  emoji,
  color,
}: TransactionToastPillProps) {
  const isExpense = type === "expense"
  const TransactionIcon = isExpense ? LuArrowDown : LuArrowUp

  const formatter = useCurrencyFormatter()
  const formattedAmount = formatter.format(amount)
  const amountClasses = isExpense ? "text-ios-red" : "text-ios-green"

  return (
    <div
      className={cn(
        "flex h-fit w-fit max-w-none shrink-0 select-none flex-nowrap items-center gap-2 whitespace-nowrap rounded-full bg-background-primary-elevated p-2.5 font-rnx-rounded",
        "shadow-2xl shadow-black/12 dark:shadow-black/20 dark:shadow-xl",
        "border border-gray-6 dark:border-gray-5/50"
      )}
      style={
        {
          "--toast-color": `var(--ios-${color}, var(--gray-1))`,
        } as React.CSSProperties
      }
    >
      <Emoji className="inline-grid size-8 place-content-center rounded-full bg-(--toast-color)/(--fill-tertiary-opacity) font-medium text-sm ring ring-(--toast-color)/15 dark:ring-(--toast-color)/30">
        {emoji}
      </Emoji>
      <span className="mr-1 shrink-0 whitespace-nowrap">{categoryName}</span>
      <span
        className={cn(
          "mr-px inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap align-middle font-semibold leading-none tracking-tight",
          amountClasses
        )}
      >
        <TransactionIcon aria-hidden="true" size={19} strokeWidth={2.25} />
        {formattedAmount}
      </span>
    </div>
  )
}
