import { parseAbsoluteToLocal } from "@internationalized/date"
import { Group, DatePicker as RacDatePicker } from "react-aria-components"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { useFieldContext } from "../hooks/form-context"
import { Popover as RacPopover } from "./date-popover"

export function DateField() {
  const field = useFieldContext<number>()

  return (
    <RacDatePicker
      granularity="minute"
      name={field.name}
      onBlur={field.handleBlur}
      onChange={(v) => {
        if (!v) return
        field.handleChange(v.toDate().getTime())
      }}
      value={parseAbsoluteToLocal(new Date(field.state.value).toISOString())}
    >
      <Group>
        <Button className="font-medium text-base" color="gray" size="sm">
          􀉉
        </Button>
      </Group>
      <RacPopover className="p-3" placement="top">
        <Calendar />
      </RacPopover>
    </RacDatePicker>
  )
}
