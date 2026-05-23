"use client"

import { toast } from "sonner"
import type { Colors } from "#lib/constants/colors"
import type { TransactionTypes } from "#lib/constants/transaction-types"
import { TransactionToastPill } from "./transaction-toast-pill"

export type TransactionToast = {
  type: TransactionTypes
  amount: number
  categoryName: string
  emoji: string
  color: Colors
}

export function showTransactionToast(props: TransactionToast) {
  toast.custom(() => <TransactionToastPill {...props} />, {
    toasterId: "notification",
    className: "flex w-full justify-center",
  })
}
