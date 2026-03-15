import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "convex/react"
import { ConvexError } from "convex/values"
import {
  Input,
  Label,
  NumberField,
  Form as RacForm,
  TextField,
} from "react-aria-components"
import { Controller, type UseFormReturn, useForm } from "react-hook-form"
import { toast } from "sonner"
import { api } from "#/convex/_generated/api"
import { limit } from "#lib/constants/constraints"
import { NO_CONSECUTIVE_SPACES, NO_LEADING_SPACE } from "#lib/regex"
import { accountSchema, type CreateAccountSchemaType } from "#lib/schema"
import { vendorAccounts } from "#lib/seed/accounts"
import { EmojiSelect } from "@/app/settings/local-comps/EmojiSelect"
import { Button } from "@/components/ui/button/animated-button"
import { Drawer } from "@/components/ui/drawer/drawer-v2"
import { Spacer } from "@/components/ui/spacer"
import { currencyFormatOptions } from "@/hooks/useCurrencyFormatter"
import { cn } from "@/lib/utils"

export function Form({ afterSumbmit }: { afterSumbmit?: () => void }) {
  const create = useMutation(api.account.create)
  const form = useForm<CreateAccountSchemaType>({
    defaultValues: {
      name: undefined,
      balance: 0,
      icon: vendorAccounts[0].icon,
    },
    resolver: zodResolver(accountSchema.create),
  })

  const onSubmit = (data: CreateAccountSchemaType) => {
    afterSumbmit?.()
    create({
      name: data.name,
      balance: data.balance * 100,
      icon: data.icon,
    }).catch((err) => {
      toast.error("Failed to create account", {
        description:
          err instanceof ConvexError ? err.data.message : "Unknown err",
      })
    })
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

function NameInput({ form }: { form: UseFormReturn<CreateAccountSchemaType> }) {
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
            onChange={(value) => {
              onChange(
                value
                  .replace(NO_LEADING_SPACE, "") // don't let put space at the beginning
                  .replace(NO_CONSECUTIVE_SPACES, " ") // don't let put consecutive spaces
              )
            }}
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
              maxLength={limit.name.account.max}
              placeholder="Enter name"
              ref={ref}
            />
          </TextField>
        </>
      )}
    />
  )
}

function BalanceInput({
  form,
}: {
  form: UseFormReturn<CreateAccountSchemaType>
}) {
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
          formatOptions={currencyFormatOptions}
          isInvalid={invalid}
          maxValue={limit.amount.account.startingBalance.max}
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
