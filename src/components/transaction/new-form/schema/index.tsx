import z from "zod/v3"
import {
  MAX_NOTE_LENGTH,
  MAXIMUM_TRANSACTION_AMOUNT,
  MINIMUM_TRANSACTION_AMOUNT,
} from "@/lib/constants/defaults"
import { transactionTypes } from "@/lib/constants/transaction-types"

export const newTransactionSchema = z.object({
  amount: z
    .number({
      required_error: "Amount is required.",
    })
    .min(MINIMUM_TRANSACTION_AMOUNT, {
      message: `Amount must be at least ${MINIMUM_TRANSACTION_AMOUNT}.`,
    })
    .max(MAXIMUM_TRANSACTION_AMOUNT, {
      message: `Amount must not exceed ${MAXIMUM_TRANSACTION_AMOUNT}.`,
    }),
  note: z
    .string()
    .max(MAX_NOTE_LENGTH, {
      message: `Note must be within ${MAX_NOTE_LENGTH} characters`,
    })
    .transform((val) => val?.trim() || undefined)
    .optional(),
  category: z.string(),
  account: z.string(),
  date: z.number(),
  type: z.enum(transactionTypes),
})
export type NewTransactionSchemaType = z.infer<typeof newTransactionSchema>
