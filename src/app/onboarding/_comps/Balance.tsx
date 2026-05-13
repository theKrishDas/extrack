import { Input, Label, NumberField } from "react-aria-components"
import { Controller, type UseFormReturn } from "react-hook-form"
import { limit } from "#lib/constants/constraints"
import {
  currencyFormatOptions,
  useCurrencyFormatter,
} from "@/hooks/useCurrencyFormatter"
import { cn } from "@/lib/utils"
import type { BalanceFormValues } from "./OnboardingBalanceForm"

export function Balance({ form }: { form: UseFormReturn<BalanceFormValues> }) {
  const formatter = useCurrencyFormatter()

  return (
    <Controller
      control={form.control}
      name="amount"
      render={({
        field: { name, value, onChange, onBlur, ref },
        fieldState: { invalid },
      }) => (
        <NumberField
          className="flex flex-1 flex-col items-center justify-center gap-5.5 text-center"
          formatOptions={currencyFormatOptions}
          isInvalid={invalid}
          isRequired
          maxValue={
            limit.amount.account.startingBalance.max /
            100 /* Convert from cents to dollars */
          }
          name={name}
          onBlur={onBlur}
          onChange={onChange}
          validationBehavior="aria"
          value={value}
        >
          <Label className="text-center text-xl leading-none">
            What is your balance now?
          </Label>
          <Input
            className={cn(
              "h-12 w-64 rounded-full px-4 font-medium text-lg",
              "border border-gray-6/50 bg-white shadow-[#F2F3F2] shadow-[inset_0_1px,inset_0_0_0_1px] dark:border-transparent dark:bg-fill-quaternary dark:shadow-white/2.5",
              "focus:outline-none focus-visible:outline-none",
              "ring-ios-blue/50 ring-offset-ios-blue/60 data-focused:ring-4 data-focused:ring-offset-2"
            )}
            placeholder={formatter.format(0)}
            ref={ref}
          />
        </NumberField>
      )}
    />
  )
}
