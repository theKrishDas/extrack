import {createListCollection} from "@ark-ui/react/collection"
import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function wait(milliseconds: number) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds)
  })
}

export function formatDate(creationTime: number) {
  const date = new Date(creationTime)
  return date
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", " at")
}

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export function createCollection<T>(
  data: T[],
  value: keyof T,
  groupBy?: (item: T, index: number) => string
) {
  const mapped = data.map(t => ({...t, value: t[value]}))

  const collection = createListCollection({
    items: mapped,
    groupBy,
  })
  return collection
}

export function sanitizeName(raw: string, max?: number): string {
  let s = raw
  // Remove leading spaces
  s = s.replace(/^ +/, "")

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
