import { createListCollection } from "@ark-ui/react/collection"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { LEADING_SPACES_REGEX } from "./regex"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function wait(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

/**
 * Creates a type-safe, groupable collection from an array of items.
 *
 * @param data - Items to collect
 * @param value - Property key used as the value identifier
 * @param groupBy - Optional grouping function
 *
 * @example
 * const collection = createCollection(items, "id", ({ id }) =>
 *   id % 2 === 0 ? "even" : "odd"
 * )
 *
 * collection.group()
 * // => [["even", [{ id: 0, ... }]], ["odd", [{ id: 1, ... }]]]
 */
export function createCollection<T>(
  data: T[],
  value: keyof T,
  groupBy?: (item: T, index: number) => string
) {
  const mapped = data.map((t) => ({ ...t, value: t[value] }))

  const collection = createListCollection({
    items: mapped,
    groupBy,
  })
  return collection
}

export function sanitizeName(raw: string, max?: number): string {
  let s = raw
  // Remove leading spaces
  s = s.replace(LEADING_SPACES_REGEX, "")

  // Strip any char that is not [A-Za-z0-9_@\-\ ]
  // Disabled as it only supports english
  // s = s.replace(/[^A-Za-z0-9_@\-() ]+/g, "")

  // Replace multiple consecutive spaces with single space
  s = s.replace(/ +/g, " ")

  // optional: Limit length
  if (max) {
    s = s.slice(0, max)
  }
  return s
}
