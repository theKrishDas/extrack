import {z} from "zod"

import {
  MAXIMUM_TRANSACTION_AMOUNT,
  MINIMUM_TRANSACTION_AMOUNT,
} from "../constants/defaults"

export type TTransactionType = "income" | "expense"

export const newTransactionSchema = z.object({
  amount: z
    .number()
    .min(MINIMUM_TRANSACTION_AMOUNT, {
      message: `Amount must be at least ${MINIMUM_TRANSACTION_AMOUNT}.`,
    })
    .max(MAXIMUM_TRANSACTION_AMOUNT, {
      message: `Amount must not exceed ${MAXIMUM_TRANSACTION_AMOUNT}.`,
    }),
  note: z.string().optional(),
  // category: z.string().nullable().optional(),
  type: z.union([z.literal("income"), z.literal("expense")], {
    message: "Type must be `income` or `expense`",
  }),
})
export type NewTransactionSchemaType = z.infer<typeof newTransactionSchema>
