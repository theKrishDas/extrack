import { format, isThisYear, isToday, isYesterday } from "date-fns"

/** @todo Replace with dynamic locale detection. */
export const LOCALE = "en-IN" as const
/** @todo Replace with dynamic currency detection. */
export const CURRENCY = "INR" as const

/**
 * Formats an object's `date` (timestamp) into a human-readable string.
 *
 * - Today → `"Today"`
 * - Yesterday → `"Yesterday"`
 * - This year → `"Monday, 23 Feb"`
 * - Older → `"Monday, 23 Feb 2025"`
 */
export function formatDateGroup<T extends { date: number }>({
  date,
}: T): string {
  if (isToday(date)) return "Today"
  if (isYesterday(date)) return "Yesterday"
  if (isThisYear(date)) return format(date, "EEEE, dd MMM")
  return format(date, "EEEE, dd MMM yyyy")
}
