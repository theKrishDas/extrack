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
