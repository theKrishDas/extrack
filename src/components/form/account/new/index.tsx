import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "convex/react"
import {
  Input,
  Label,
  NumberField,
  Form as RacForm,
  TextField,
} from "react-aria-components"
import { Controller, type UseFormReturn, useForm } from "react-hook-form"
import { api } from "#/convex/_generated/api"
import { EmojiSelect } from "@/app/settings/local-comps/EmojiSelect"
import { Button } from "@/components/ui/button/animated-button"
import { Drawer } from "@/components/ui/drawer/drawer-v2"
import { Spacer } from "@/components/ui/spacer"
import { MAX_ACCOUNT_NAME_LENGTH } from "@/lib/constants/defaults"
import { CURRENCY } from "@/lib/date-utils"
import {
  type NewAccountSchemaType,
  newAccountSchema,
} from "@/lib/schema/accounts"
import { cn, sanitizeName } from "@/lib/utils"

export function Form({ afterSumbmit }: { afterSumbmit?: () => void }) {
  const create = useMutation(api.account.create)
  const form = useForm<NewAccountSchemaType>({
    defaultValues: {
      name: undefined,
      balance: 0,
      icon: "🌐",
    },
    resolver: zodResolver(newAccountSchema),
  })

  const onSubmit = (data: NewAccountSchemaType) => {
    create(data)
    afterSumbmit?.()
  }

  return (
    <RacForm
      className="flex h-full flex-col"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <EmojiSelect form={form} />
      <Spacer className="h-4" />

      <NameInput form={form} />
      <Spacer className="h-5" />

      <BalanceInput form={form} />
      <Spacer className="h-full flex-1" />

      <Drawer.Footer>
        <Button fullWidth type="submit" variant="filled">
          Save
        </Button>
      </Drawer.Footer>
    </RacForm>
  )
}

function NameInput({ form }: { form: UseFormReturn<NewAccountSchemaType> }) {
  return (
    <Controller
      control={form.control}
      name="name"
      render={({
        field: { name, value, onChange, onBlur, ref },
        fieldState: { invalid },
      }) => (
        <>
          <TextField
            className="w-full px-4"
            isInvalid={invalid}
            isRequired
            name={name}
            onBlur={onBlur}
            onChange={(v) => onChange(sanitizeName(v, MAX_ACCOUNT_NAME_LENGTH))}
            validationBehavior="aria"
            value={value}
          >
            <Label className="w-full px-4 pt-6 pb-1.5 font-medium text-label-secondary text-sm uppercase">
              Name
            </Label>
            <Input
              className={cn(
                "h-12 w-full rounded-xl bg-fill-quaternary pr-8.5 pl-4 text-lg leading-none tracking-[0.01em] placeholder-label-secondary",
                "outline-none data-focus-visible:rounded data-focus-visible:ring-4 data-focus-visible:ring-ios-blue/(--separator-non-opaque-opacity)"
              )}
              // TODO: add a max and min length
              // maxLength={MAX_NOTE_LENGTH}
              placeholder="Enter name"
              ref={ref}
            />
          </TextField>
        </>
      )}
    />
  )
}

function BalanceInput({ form }: { form: UseFormReturn<NewAccountSchemaType> }) {
  return (
    <Controller
      control={form.control}
      name="balance"
      render={({
        field: { name, value, onChange, onBlur, ref },
        fieldState: { invalid },
      }) => (
        <NumberField
          className="w-full px-4"
          formatOptions={{
            style: "currency",
            currency: CURRENCY,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          }}
          isInvalid={invalid}
          name={name}
          onBlur={onBlur}
          onChange={onChange}
          validationBehavior="aria"
          value={value}
        >
          <Label className="w-full px-4 pt-6 pb-1.5 font-medium text-label-secondary text-sm uppercase">
            Balance
          </Label>
          <Input
            className={cn(
              "h-12 w-full rounded-xl bg-fill-quaternary pr-8.5 pl-4 text-lg leading-none tracking-[0.01em] placeholder-label-secondary",
              "outline-none data-focus-visible:rounded data-focus-visible:ring-4 data-focus-visible:ring-ios-blue/(--separator-non-opaque-opacity)"
            )}
            placeholder="₹0"
            ref={ref}
          />
        </NumberField>
      )}
      rules={{ required: "Amount is required." }}
    />
  )
}
