import z from "zod"

import {colors} from "../constants/colors"
import {
  MAX_CATEGORY_NAME_LENGTH,
  MIN_CATEGORY_NAME_LENGTH,
} from "../constants/defaults"

export const categorySchema = z.object({
  name: z
    .string()
    .min(MIN_CATEGORY_NAME_LENGTH, {
      message: `Category name must be at least ${MIN_CATEGORY_NAME_LENGTH} character long.`,
    })
    .max(MAX_CATEGORY_NAME_LENGTH, {
      message: `Category name must be within ${MAX_CATEGORY_NAME_LENGTH} characters.`,
    }),
  color: z.enum(colors, {
    message: `Color must be one of: ${colors.join(", ")}`,
  }),
  type: z.union([z.literal("income"), z.literal("expense")], {
    message: "Type must be `income` or `expense`",
  }),
})
export type Category = z.infer<typeof categorySchema>
