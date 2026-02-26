"use client"

import {
  Calendar as AriaCalendar,
  CalendarGridHeader as AriaCalendarGridHeader,
  type CalendarProps as AriaCalendarProps,
  CalendarGrid,
  CalendarGridBody,
  CalendarHeaderCell,
  type DateValue,
  Heading,
  Text,
  useLocale,
} from "react-aria-components"
import {
  IoChevronBack as ChevronLeft,
  IoChevronForward as ChevronRight,
} from "react-icons/io5"
import { Button } from "@/components/ui/button"
import { composeTailwindRenderProps } from "@/lib/styles/utils"
import { CalendarCell } from "./cell"

export interface CalendarProps<T extends DateValue>
  extends Omit<AriaCalendarProps<T>, "visibleDuration"> {
  errorMessage?: string
}

export function Calendar<T extends DateValue>({
  errorMessage,
  ...props
}: CalendarProps<T>) {
  return (
    <AriaCalendar
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "@container flex w-[calc(11*var(--spacing)*7)] max-w-full flex-col" // tailwind's (w-11 * 7 cells)
      )}
    >
      <CalendarHeader />
      <CalendarGrid className="border-spacing-0" weekdayStyle="short">
        <CalendarGridHeader />
        <CalendarGridBody>
          {(date) => <CalendarCell date={date} />}
        </CalendarGridBody>
      </CalendarGrid>
      {errorMessage && (
        <Text
          className="mx-2 font-medium text-ios-red text-sm"
          slot="errorMessage"
        >
          {errorMessage}
        </Text>
      )}
    </AriaCalendar>
  )
}

export function CalendarHeader() {
  const { direction } = useLocale()

  return (
    <header className="flex h-11 items-center border-box px-2">
      <Heading className="flex-1 font-semibold text-label-primary text-lg leading-none [font-variation-settings:normal]" />
      <Button isIconOnly size="sm" slot="previous" variant="ghost">
        {direction === "rtl" ? (
          <ChevronRight aria-hidden size={18} />
        ) : (
          <ChevronLeft aria-hidden size={18} />
        )}
      </Button>
      <Button isIconOnly size="sm" slot="next" variant="ghost">
        {direction === "rtl" ? (
          <ChevronLeft aria-hidden size={18} />
        ) : (
          <ChevronRight aria-hidden size={18} />
        )}
      </Button>
    </header>
  )
}

export function CalendarGridHeader() {
  return (
    <AriaCalendarGridHeader>
      {(day) => (
        <CalendarHeaderCell className="font-semibold text-label-tertiary text-xs uppercase">
          {day}
        </CalendarHeaderCell>
      )}
    </AriaCalendarGridHeader>
  )
}
