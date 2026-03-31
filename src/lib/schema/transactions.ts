import { z } from "zod"
import { limit } from "#lib/constants/constraints"

export type TTransactionType = "income" | "expense"

export const newTransactionSchema = z.object({
  amount: z
    .number({
      required_error: "Amount is required.",
    })
    .min(limit.amount.transaction.min / 100, {
      message: `Amount must be at least ${limit.amount.transaction.min / 100}.`,
    })
    .max(limit.amount.transaction.max / 100, {
      message: `Amount must not exceed ${limit.amount.transaction.max / 100}.`,
    }),
  note: z
    .string()
    .max(limit.note.transaction.maxLength, {
      message: `Note must be within ${limit.note.transaction.maxLength} characters`,
    })
    .transform((val) => val?.trim() || undefined)
    .optional(),
  category: z.string(),
  account: z.string(),
  date: z.number(),
})
export type NewTransactionSchemaType = z.infer<typeof newTransactionSchema>
