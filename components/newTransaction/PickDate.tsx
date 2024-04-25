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
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField } from "@/components/ui/form";
import { NewTransactionFormSchemaType } from "@/lib/types/new-transaction-form-schema";

export function PickDate({
  form,
}: {
  form: UseFormReturn<NewTransactionFormSchemaType, any, undefined>;
}) {
  return (
    <>
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  className="h-10 w-28 items-center justify-start gap-2 rounded-full px-5 shadow-none"
                  variant="secondary"
                  type="button"
                >
                  <IoCalendarClear className="text-foreground/50" />

                  {field.value ? (
                    format(field.value, "dd LLL")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}
      />
    </>
  );
}
