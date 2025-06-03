import {Fragment} from "react"
import {Input, Label, NumberField, Text} from "react-aria-components"
import {Control, Controller} from "react-hook-form"

import {
  MAXIMUM_TRANSACTION_AMOUNT,
  MINIMUM_TRANSACTION_AMOUNT,
} from "@/lib/constants/defaults"
import {NewTransactionSchemaType} from "@/lib/schema/new-transaction-schema"
import {cn} from "@/lib/utils"

export default function AmountInput({
  control,
}: {
  control: Control<NewTransactionSchemaType>
}) {
  return (
    <Controller
      control={control}
      name="amount"
      rules={{required: "Amount is required."}}
      render={({
        field: {name, value, onChange, onBlur, ref},
        fieldState: {invalid},
      }) => (
        <NumberField
          className="relative"
          minValue={MINIMUM_TRANSACTION_AMOUNT}
          maxValue={MAXIMUM_TRANSACTION_AMOUNT}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          isRequired
          validationBehavior="aria"
          isInvalid={invalid}
        >
          {({state: {numberValue}}) => (
            <Fragment>
              <Label className="sr-only">Amount</Label>
              <Input
                className={cn(
                  "text-label-primary/90 h-55 w-full text-center text-7xl font-bold tracking-tight outline-none",
                  "data-[focus-visible]:ring-ios-blue/[var(--separator-non-opaque-opacity)] data-[focus-visible]:rounded-xl data-[focus-visible]:ring-4",
                  numberValue > 999_999 && "text-5xl",
                  numberValue > 99_999_999 && "text-3xl"
                )}
                placeholder="0"
                ref={ref}
              />
              <Text slot="description" className="sr-only">
                Minimum transaction amount is 0.1
              </Text>
            </Fragment>
          )}
        </NumberField>
      )}
    />
  )
}
