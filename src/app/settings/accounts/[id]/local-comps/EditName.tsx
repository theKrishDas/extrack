import {Fragment} from "react"
import {Doc} from "#/convex/_generated/dataModel"
import {motion} from "motion/react"
import {Input, Label, TextField} from "react-aria-components"
import {Controller, UseFormReturn} from "react-hook-form"

import {MAX_ACCOUNT_NAME_LENGTH} from "@/lib/constants/defaults"
import {NewAccountSchemaType} from "@/lib/schema/accounts"
import {cn, sanitizeName} from "@/lib/utils"

const MTextField = motion.create(TextField)

export function EditName({
  form,
  isEditing,
  account,
}: {
  form: UseFormReturn<NewAccountSchemaType>
  isEditing: boolean
  account: Doc<"accounts">
}) {
  if (!isEditing)
    return <p className="mt-2 text-2xl font-bold">{account.name}</p>

  return (
    <Controller
      control={form.control}
      name="name"
      render={({
        field: {name, value, onChange, onBlur, ref},
        fieldState: {invalid},
      }) => (
        <Fragment>
          <MTextField
            name={name}
            value={value}
            onChange={v => onChange(sanitizeName(v, MAX_ACCOUNT_NAME_LENGTH))}
            onBlur={onBlur}
            isRequired
            validationBehavior="aria"
            isInvalid={invalid}
            className="relative mt-2 w-50 md:w-70"
            variants={{
              shaking: {
                rotate: [-1, 1, -1],
                x: [0, 1, -1, 0],
              },
              idle: {
                rotate: 0,
                x: 0,
              },
            }}
            animate={isEditing ? "shaking" : "idle"}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              duration: 0.15,
            }}
          >
            <Label className="sr-only">Name</Label>
            <Input
              ref={ref}
              maxLength={MAX_ACCOUNT_NAME_LENGTH}
              placeholder="Enter name"
              className={cn(
                "placeholder-label-secondary bg-fill-tertiary h-12 w-full rounded-xl px-2 text-center text-2xl leading-none font-bold placeholder:font-medium",
                "data-[focus-visible]:ring-ios-blue/[var(--separator-non-opaque-opacity)] outline-none data-[focus-visible]:rounded data-[focus-visible]:ring-4"
              )}
            />
          </MTextField>
        </Fragment>
      )}
    />
  )
}
