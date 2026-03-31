import z from "zod"
import { colors } from "#lib/constants/colors"
import { limit } from "#lib/constants/constraints"

export const newCategorySchema = z.object({
  name: z
    .string()
    .min(limit.name.category.min, {
      message: `Category name must be at least ${limit.name.category.min} character long.`,
    })
    .max(limit.name.category.max, {
      message: `Category name must be within ${limit.name.category.max} characters.`,
    }),
  color: z.enum(colors, {
    message: `Color must be one of: ${colors.join(", ")}`,
  }),
  icon: z.string().min(1),
  type: z.union([z.literal("income"), z.literal("expense")], {
    message: "Type must be `income` or `expense`",
  }),
})
export type NewCategorySchemaType = z.infer<typeof newCategorySchema>
