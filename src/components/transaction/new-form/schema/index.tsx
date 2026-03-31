import z from "zod/v3"
import { limit } from "#lib/constants/constraints"
import { v } from "#lib/validators"
import { transactionTypes } from "@/lib/constants/transaction-types"

export const newTransactionSchema = z.object({
  amount: v.dollars(
    limit.amount.transaction.min / 100,
    limit.amount.transaction.max / 100
  ),
  note: v.name(1, limit.note.transaction.maxLength).optional(),
  category: z.string(), // v.id("categories")
  account: z.string(), // v.id("accounts")
  date: z.number(), // timestamp
  type: z.enum(transactionTypes), // "income" | "expense"
})
export type NewTransactionSchemaType = z.infer<typeof newTransactionSchema>
