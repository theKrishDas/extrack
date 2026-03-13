import z from "zod/v3"
import {
  TRANSACTION_AMOUNT_MAX,
  TRANSACTION_AMOUNT_MIN,
  TRANSACTION_NOTE_MAX_LENGTH,
} from "#lib/constants/constraints"
import { v } from "#lib/validators"
import { transactionTypes } from "@/lib/constants/transaction-types"

export const newTransactionSchema = z.object({
  amount: v.dollars(TRANSACTION_AMOUNT_MIN / 100, TRANSACTION_AMOUNT_MAX / 100),
  note: v.name(1, TRANSACTION_NOTE_MAX_LENGTH).optional(),
  category: z.string(), // v.id("categories")
  account: z.string(), // v.id("accounts")
  date: z.number(), // timestamp
  type: z.enum(transactionTypes), // "income" | "expense"
})
export type NewTransactionSchemaType = z.infer<typeof newTransactionSchema>
