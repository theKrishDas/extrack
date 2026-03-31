import { Input, Label, NumberField } from "react-aria-components"
import { cn } from "tailwind-variants"
import { limit } from "#lib/constants/constraints"
import { currencyFormatOptions } from "@/hooks/useCurrencyFormatter"
import { useFieldContext } from "../hooks/form-context"

export function AmountField({
  label,
  placeholder,
}: {
  label: string
  placeholder: string
}) {
  const field = useFieldContext<number>()

  return (
    <NumberField
      className="flex h-fit w-full flex-col justify-end outline-none"
      formatOptions={currencyFormatOptions}
      isInvalid={!field.state.meta.isValid}
      maxValue={limit.amount.transaction.max / 100}
      // minValue={limit.amount.transaction.min / 100}
      name={field.name}
      onBlur={field.handleBlur}
      onChange={field.handleChange}
      validationBehavior="aria"
      value={field.state.value}
    >
      {({ state: { numberValue } }) => (
        <>
          <Label className="sr-only">{label}</Label>
          <Input
            className={cn(
              "flex w-full truncate text-center font-medium text-[3.9rem] text-label-primary leading-none",
              "outline-none data-focus-visible:rounded-xl data-focus-visible:ring-4 data-focus-visible:ring-ios-blue/(--separator-non-opaque-opacity)",
              numberValue.toString().length > 6 && "text-[3rem]",
              numberValue.toString().length > 8 && "text-[2.8rem]"
            )}
            placeholder={placeholder}
          />
        </>
      )}
    </NumberField>
  )
}
