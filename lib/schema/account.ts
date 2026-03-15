import z from "zod/v3"
import { limit } from "#lib/constants/constraints"
import { v } from "#lib/validators"

const baseSchema = z.object({
  name: v.name(limit.name.account.min, limit.name.account.max),
  icon: v.name(1, 10),
})

/** Use this schema when updating an account*/
const update = baseSchema

/** Use this schema when creating a new account */
const create = baseSchema.extend({
  balance: v.dollars(
    limit.amount.account.startingBalance.min / 100,
    limit.amount.account.startingBalance.max / 100
  ),
})

type UpdateAccountSchemaType = z.infer<typeof update>
type CreateAccountSchemaType = z.infer<typeof create>

const accountSchema = { update, create }

export {
  accountSchema,
  type UpdateAccountSchemaType,
  type CreateAccountSchemaType,
}
