import z from "zod"

import {TTransactionType} from "@/lib/schema/transactions"

export const categorySchema = z.object({
  id: z.string().min(1),
})

export function setLastUsedCategory(type: TTransactionType, category: string) {
  const key = `last_${type}_category`
  localStorage.setItem(key, category)
}

export function getLastUsedCategory(type: TTransactionType) {
  const key = `last_${type}_category`
  const value = localStorage.getItem(key)

  if (!value) return null

  const result = categorySchema.safeParse({id: value})

  if (!result.success) {
    // TODO: Reneder a toast
    // eslint-disable-next-line no-console
    console.error("Failed to parse category from localStorage:", result.error)
    return null
  }

  return result.data
}
