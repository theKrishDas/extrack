import { Input, Label, NumberField, Text } from "react-aria-components"
import { Controller } from "react-hook-form"

import { limit } from "#lib/constants/constraints"
import { cn } from "@/lib/utils"

import { useNewTransaction } from "./provider"

export default function AmountInput() {
  const {
    form: { control },
  } = useNewTransaction()

  return (
    <Controller
      control={control}
      name="amount"
      render={({
        field: { name, value, onChange, onBlur, ref },
        fieldState: { invalid },
      }) => (
        <NumberField
          className="relative"
          isInvalid={invalid}
          isRequired
          maxValue={limit.amount.transaction.max / 100}
          minValue={limit.amount.transaction.min / 100}
          name={name}
          onBlur={onBlur}
          onChange={onChange}
          validationBehavior="aria"
          value={value}
        >
          {({ state: { numberValue } }) => (
            <>
              <Label className="sr-only">Amount</Label>
              <Input
                className={cn(
                  "h-55 w-full text-center font-bold text-7xl text-label-primary/90 tracking-tight outline-none",
                  "data-[focus-visible]:rounded-xl data-[focus-visible]:ring-4 data-[focus-visible]:ring-ios-blue/[var(--separator-non-opaque-opacity)]",
                  numberValue > 999_999 && "text-5xl",
                  numberValue > 99_999_999 && "text-3xl"
                )}
                placeholder="0"
                ref={ref}
              />
              <Text className="sr-only" slot="description">
                Minimum transaction amount is 0.1
              </Text>
            </>
          )}
        </NumberField>
      )}
      rules={{ required: "Amount is required." }}
    />
  )
}
