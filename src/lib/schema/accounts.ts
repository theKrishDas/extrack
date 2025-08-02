import z from "zod"

import {
  MAX_ACCOUNT_BALANCE,
  MAX_ACCOUNT_NAME_LENGTH,
  MIN_ACCOUNT_NAME_LENGTH,
} from "../constants/defaults"

export const newAccountSchema = z.object({
  name: z
    .string()
    .min(MIN_ACCOUNT_NAME_LENGTH, {
      message: `Name must be atleast ${MIN_ACCOUNT_NAME_LENGTH} characters`,
    })
    .max(MAX_ACCOUNT_NAME_LENGTH, {
      message: `Name must be within ${MAX_ACCOUNT_NAME_LENGTH} characters`,
    }),
  balance: z.number().max(MAX_ACCOUNT_BALANCE, {
    message: `Balance must be within ${MAX_ACCOUNT_BALANCE}`,
  }),
  icon: z.string().min(1),
})
export type NewAccountSchemaType = z.infer<typeof newAccountSchema>
