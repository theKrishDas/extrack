import {Fragment} from "react"
import {Label, TextArea, TextField} from "react-aria-components"
import {Controller} from "react-hook-form"

import {MAX_NOTE_LENGTH} from "@/lib/constants/defaults"
import {cn} from "@/lib/utils"

import {useNewTransaction} from "./provider"

export default function Note() {
  const {
    form: {control},
  } = useNewTransaction()

  return (
    <Controller
      control={control}
      name="note"
      render={({
        field: {name, value, onChange, onBlur, ref},
        fieldState: {invalid},
      }) => (
        <Fragment>
          <TextField
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            validationBehavior="aria"
            isInvalid={invalid}
            className="mb-4 flex flex-col gap-4"
          >
            <Label className="sr-only ml-1.5 font-bold">
              Add a note to yourself
            </Label>

            <TextArea
              ref={ref}
              maxLength={MAX_NOTE_LENGTH}
              placeholder="Add a note (optional)"
              className={cn(
                "bg-fill-quaternary h-20 resize-none rounded-2xl p-4",
                "data-[focus-visible]:ring-ios-blue/[var(--separator-non-opaque-opacity)] outline-none data-[focus-visible]:rounded-xl data-[focus-visible]:ring-4"
              )}
            />
          </TextField>
        </Fragment>
      )}
    />
  )
}
