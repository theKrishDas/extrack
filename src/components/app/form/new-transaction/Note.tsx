import {Fragment} from "react"
import {Label, TextArea, TextField} from "react-aria-components"
import {Controller} from "react-hook-form"

import {MAX_NOTE_LENGTH} from "@/lib/constants/defaults"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button/animated-button"
import {DrawerClose} from "@/components/ui/drawer"

import {useFormContext} from "./context-helpers"

export default function Note() {
  const {
    form: {control},
  } = useFormContext()

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
            className="flex flex-col gap-4 p-4"
          >
            <div className="relative flex justify-between">
              <Label className="ml-1.5 font-bold">Add a note to yourself</Label>
              <CloseButton />
            </div>

            <TextArea
              ref={ref}
              maxLength={MAX_NOTE_LENGTH}
              placeholder="Write your note"
              className={cn(
                "bg-fill-tertiary h-20 resize-none rounded-xl p-4",
                "data-[focus-visible]:ring-ios-blue/[var(--separator-non-opaque-opacity)] outline-none data-[focus-visible]:rounded-xl data-[focus-visible]:ring-4"
              )}
            />
          </TextField>

          <div className="flex w-full items-center justify-end gap-1 p-4 pt-0 pr-5 text-xs font-semibold tracking-tight">
            <span className="border-ios-blue inline-block h-4 w-4 rounded-full border-3 leading-none" />
            <p>
              <span className="font-bold">{value?.length}</span>
              <span className="text-label-tertiary">/50</span>
            </p>
          </div>
        </Fragment>
      )}
    />
  )
}

const CloseButton = () => {
  return (
    <DrawerClose asChild>
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-1/2 -right-1 -translate-y-1/2"
      >
        Done
      </Button>
    </DrawerClose>
  )
}
