import {
  type CalendarCellRenderProps,
  composeRenderProps,
  CalendarCell as RacCalendarCell,
} from "react-aria-components"
import { tv, type VariantProps } from "tailwind-variants"
import { focusRing } from "@/lib/styles/utils"

const calendarCell = tv({
  extend: focusRing,
  base: "pointer-default inline-flex aspect-square w-[calc(100cqw/7)] select-none items-center justify-center rounded-full text-center align-middle text-lg leading-none transition-colors forced-color-adjust-none [-webkit-tap-highlight-color:transparent]",
  variants: {
    state: {
      default: "text-label-primary",
      current: "font-medium text-ios-blue",
      selected:
        "bg-ios-blue/(--fill-quaternary-opacity) font-medium text-ios-blue text-xl",
      "current selected": "bg-ios-blue font-medium text-white text-xl",
    },
    isOutsideMonth: {
      true: "opacity-0",
    },
    isDisabled: {
      true: "text-label-quaternary forced-colors:text-[GrayText]",
    },
  },
  defaultVariants: {
    state: "default",
  },
})
export type CalendarCellVariants = VariantProps<typeof calendarCell>

function getState({
  isToday,
  isSelected,
}: CalendarCellRenderProps): NonNullable<CalendarCellVariants["state"]> {
  if (isToday && isSelected) return "current selected"
  if (isToday) return "current"
  if (isSelected) return "selected"
  return "default"
}

export type CalendarCellProps = React.ComponentProps<typeof RacCalendarCell>
export function CalendarCell(props: CalendarCellProps) {
  return (
    <RacCalendarCell
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        calendarCell({
          ...renderProps,
          state: getState(renderProps),
          className,
        })
      )}
    />
  )
}
