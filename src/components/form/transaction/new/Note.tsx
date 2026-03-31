import { Label, TextArea, TextField } from "react-aria-components"
import { Controller } from "react-hook-form"

import { limit } from "#lib/constants/constraints"
import { cn } from "@/lib/utils"

import { useNewTransaction } from "./provider"

export default function Note() {
  const {
    form: { control },
  } = useNewTransaction()

  return (
    <Controller
      control={control}
      name="note"
      render={({
        field: { name, value, onChange, onBlur, ref },
        fieldState: { invalid },
      }) => (
        <>
          <TextField
            className="mb-4 flex flex-col gap-4"
            isInvalid={invalid}
            name={name}
            onBlur={onBlur}
            onChange={onChange}
            validationBehavior="aria"
            value={value}
          >
            <Label className="sr-only ml-1.5 font-bold">
              Add a note to yourself
            </Label>

            <TextArea
              className={cn(
                "h-20 resize-none rounded-2xl bg-fill-quaternary p-4",
                "outline-none data-[focus-visible]:rounded-xl data-[focus-visible]:ring-4 data-[focus-visible]:ring-ios-blue/[var(--separator-non-opaque-opacity)]"
              )}
              maxLength={limit.note.transaction.maxLength}
              placeholder="Add a note (optional)"
              ref={ref}
            />
          </TextField>
        </>
      )}
    />
  )
}
