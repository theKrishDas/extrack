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
      invalid_type_error: "Amount must be a number.",
    })
    .min(MINIMUM_TRANSACTION_AMOUNT, {
      message: `Amount must be at least ${MINIMUM_TRANSACTION_AMOUNT}.`,
    })
    .max(MAXIMUM_TRANSACTION_AMOUNT, {
      message: `Amount must not exceed ${MAXIMUM_TRANSACTION_AMOUNT}.`,
    }),
  note: z
    .string({ invalid_type_error: "Note must be a string." })
    .max(MAX_NOTE_LENGTH, {
      message: `Note must be within ${MAX_NOTE_LENGTH} characters.`,
    })
    .transform((val) => val?.trim() || undefined)
    .optional(),
  category: z.string({
    required_error: "Category is required.",
    invalid_type_error: "Category must be a string.",
  }),
  account: z.string({
    required_error: "Account is required.",
    invalid_type_error: "Account must be a string.",
  }),
  date: z.number({
    required_error: "Date is required.",
    invalid_type_error: "Date must be a number.",
  }),
  type: z.enum(transactionTypes, {
    required_error: "Transaction type is required.",
    invalid_type_error: `Type must be one of: ${transactionTypes.join(", ")}.`,
  }),
})
export type NewTransactionSchemaType = z.infer<typeof newTransactionSchema>
