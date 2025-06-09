import {DateArg, differenceInCalendarDays, format, isToday} from "date-fns"

export function getRelativeDate(date: DateArg<Date>): string {
  if (isToday(date)) {
    return "today"
  }

  // Check if the date is exactly one day before today.
  if (differenceInCalendarDays(Date.now(), date) === 1) {
    return "yesterday"
  }

  // For other dates, you may choose your preferred format.
  return format(date, "MMMM d")
}
