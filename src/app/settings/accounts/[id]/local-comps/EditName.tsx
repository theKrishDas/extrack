import { motion } from "motion/react"
import { Input, Label, TextField } from "react-aria-components"
import { Controller, type UseFormReturn } from "react-hook-form"
import type { Doc } from "#/convex/_generated/dataModel"

import { MAX_ACCOUNT_NAME_LENGTH } from "@/lib/constants/defaults"
import type { NewAccountSchemaType } from "@/lib/schema/accounts"
import { cn, sanitizeName } from "@/lib/utils"

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
    return <p className="mt-2 font-bold text-2xl">{account.name}</p>

  return (
    <Controller
      control={form.control}
      name="name"
      render={({
        field: { name, value, onChange, onBlur, ref },
        fieldState: { invalid },
      }) => (
        <>
          <MTextField
            animate={isEditing ? "shaking" : "idle"}
            className="relative mt-2 w-50 md:w-70"
            isInvalid={invalid}
            isRequired
            name={name}
            onBlur={onBlur}
            onChange={(v) => onChange(sanitizeName(v, MAX_ACCOUNT_NAME_LENGTH))}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "easeInOut",
              duration: 0.15,
            }}
            validationBehavior="aria"
            value={value}
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
          >
            <Label className="sr-only">Name</Label>
            <Input
              className={cn(
                "h-12 w-full rounded-xl bg-fill-tertiary px-2 text-center font-bold text-2xl leading-none placeholder-label-secondary placeholder:font-medium",
                "outline-none data-[focus-visible]:rounded data-[focus-visible]:ring-4 data-[focus-visible]:ring-ios-blue/[var(--separator-non-opaque-opacity)]"
              )}
              maxLength={MAX_ACCOUNT_NAME_LENGTH}
              placeholder="Enter name"
              ref={ref}
            />
          </MTextField>
        </>
      )}
    />
  )
}
