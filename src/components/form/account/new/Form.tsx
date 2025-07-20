import {Fragment} from "react"
import {zodResolver} from "@hookform/resolvers/zod"
import {
  Input,
  Label,
  NumberField,
  Form as RacForm,
  TextField,
} from "react-aria-components"
import {Controller, useForm, UseFormReturn} from "react-hook-form"
import z from "zod"

import {
  MAX_ACCOUNT_NAME_LENGTH,
  MIN_ACCOUNT_NAME_LENGTH,
} from "@/lib/constants/defaults"
import {CURRENCY} from "@/lib/date-utils"
import {cn, sanitizeName} from "@/lib/utils"
import {Button} from "@/components/ui/button/animated-button"
import {Drawer} from "@/components/ui/drawer/drawer-v2"
import {Spacer} from "@/components/ui/spacer"

export function Form() {
  const form = useForm<NewAccountSchemaType>({
    defaultValues: {
      name: undefined,
      balance: 0,
    },
    resolver: zodResolver(newAccountSchema),
  })

  return (
    <RacForm
      onSubmit={form.handleSubmit(data => {
        console.info(
          "%cINFO",
          "color: black; background: #34c759; border-radius: 3px; padding: 1px 3px;",
          "data:",
          data
        )
      })}
    >
      <NameInput form={form} />
      <Spacer className="h-5" />

      <BalanceInput form={form} />
      <Spacer className="h-5" />

      {/* <EmojiSelect /> */}

      <Drawer.Footer>
        <Button
          type="submit"
          variant="filled"
          fullWidth
          isDisabled={!form.formState.isValid}
        >
          Save
        </Button>
      </Drawer.Footer>
    </RacForm>
  )
}

function NameInput({form}: {form: UseFormReturn<NewAccountSchemaType>}) {
  return (
    <Controller
      control={form.control}
      name="name"
      render={({
        field: {name, value, onChange, onBlur, ref},
        fieldState: {invalid},
      }) => (
        <Fragment>
          <TextField
            name={name}
            value={value}
            onChange={v => onChange(sanitizeName(v, MAX_ACCOUNT_NAME_LENGTH))}
            onBlur={onBlur}
            isRequired
            validationBehavior="aria"
            isInvalid={invalid}
            className="w-full px-4"
          >
            <Label className="sr-only">Add a note to yourself</Label>
            <Input
              ref={ref}
              // TODO: add a max and min length
              // maxLength={MAX_NOTE_LENGTH}
              placeholder="Enter name"
              className={cn(
                "placeholder-label-secondary bg-fill-quaternary h-12 w-full rounded-xl pr-8.5 pl-4 text-lg leading-none tracking-[0.01em]",
                "data-[focus-visible]:ring-ios-blue/[var(--separator-non-opaque-opacity)] outline-none data-[focus-visible]:rounded data-[focus-visible]:ring-4"
              )}
            />
          </TextField>
        </Fragment>
      )}
    />
  )
}

function BalanceInput({form}: {form: UseFormReturn<NewAccountSchemaType>}) {
  return (
    <Controller
      control={form.control}
      name="balance"
      rules={{required: "Amount is required."}}
      render={({
        field: {name, value, onChange, onBlur, ref},
        fieldState: {invalid},
      }) => (
        <NumberField
          className="w-full px-4"
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          validationBehavior="aria"
          isInvalid={invalid}
          formatOptions={{
            style: "currency",
            currency: CURRENCY,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          }}
        >
          <Label className="sr-only">Amount</Label>
          <Input
            ref={ref}
            placeholder="₹0"
            className={cn(
              "placeholder-label-secondary bg-fill-quaternary h-12 w-full rounded-xl pr-8.5 pl-4 text-lg leading-none tracking-[0.01em]",
              "data-[focus-visible]:ring-ios-blue/[var(--separator-non-opaque-opacity)] outline-none data-[focus-visible]:rounded data-[focus-visible]:ring-4"
            )}
          />
        </NumberField>
      )}
    />
  )
}

export const newAccountSchema = z.object({
  name: z
    .string()
    .min(MIN_ACCOUNT_NAME_LENGTH, {
      message: `Name must be atleast ${MIN_ACCOUNT_NAME_LENGTH} characters`,
    })
    .max(MAX_ACCOUNT_NAME_LENGTH, {
      message: `Name must be within ${MAX_ACCOUNT_NAME_LENGTH} characters`,
    })
    .trim(),
  balance: z.number().optional(),
})
export type NewAccountSchemaType = z.infer<typeof newAccountSchema>
