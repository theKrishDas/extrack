import z from "zod"
import { limit } from "#lib/constants/constraints"

export const newAccountSchema = z.object({
  name: z
    .string()
    .min(limit.name.account.min, {
      message: `Name must be atleast ${limit.name.account.min} characters`,
    })
    .max(limit.name.account.max, {
      message: `Name must be within ${limit.name.account.max} characters`,
    }),
  balance: z.number().max(limit.amount.account.startingBalance.max / 100, {
    message: `Balance must be within ${limit.amount.account.startingBalance.max / 100}`,
  }),
  icon: z.string().min(1),
})
export type NewAccountSchemaType = z.infer<typeof newAccountSchema>
