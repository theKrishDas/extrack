import * as React from "react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IoCalendarClear } from "react-icons/io5";

export function PickDate() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="h-10 w-28 items-center justify-start gap-2 rounded-full px-5 shadow-none"
          variant="secondary"
          type="button"
        >
          <IoCalendarClear className="text-foreground/50" />
          {date ? format(date, "dd LLL") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => setDate(d)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
