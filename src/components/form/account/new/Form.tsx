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
import {toast} from "sonner"

import {MAX_ACCOUNT_NAME_LENGTH} from "@/lib/constants/defaults"
import {CURRENCY} from "@/lib/date-utils"
import {newAccountSchema, NewAccountSchemaType} from "@/lib/schema/accounts"
import {cn, sanitizeName} from "@/lib/utils"
import {Button} from "@/components/ui/button/animated-button"
import {Drawer} from "@/components/ui/drawer/drawer-v2"
import {Spacer} from "@/components/ui/spacer"
import {EmojiSelect} from "@/app/settings/local-comps/EmojiSelect"

export function Form({afterSumbmit}: {afterSumbmit?: () => void}) {
  const form = useForm<NewAccountSchemaType>({
    defaultValues: {
      name: undefined,
      balance: 0,
      icon: "🌐",
    },
    resolver: zodResolver(newAccountSchema),
  })

  return (
    <RacForm
      className="flex h-full flex-col"
      onSubmit={form.handleSubmit(data => {
        // eslint-disable-next-line no-console
        console.info(
          "%cDATA",
          "color: black; background: #34c759; border-radius: 3px; padding: 1px 3px;",
          data
        )
        toast.info(JSON.stringify(data, null, 2), {position: "top-center"})

        afterSumbmit?.()
      })}
    >
      <EmojiSelect form={form} />
      <Spacer className="h-4" />

      <NameInput form={form} />
      <Spacer className="h-5" />

      <BalanceInput form={form} />
      <Spacer className="h-full flex-1" />

      <Drawer.Footer>
        <Button type="submit" variant="filled" fullWidth>
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
            <Label className="text-label-secondary w-full px-4 pt-6 pb-1.5 text-sm font-medium uppercase">
              Name
            </Label>
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
          <Label className="text-label-secondary w-full px-4 pt-6 pb-1.5 text-sm font-medium uppercase">
            Balance
          </Label>
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
