import { useNumberFormatter } from "@react-aria/i18n"
import { CURRENCY } from "@/lib/date-utils"

/** Default options for formatting currency values in {@link useCurrencyFormatter}. */
export const currencyFormatOptions = {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 0,
} as const

/** Formats a number as a currency string using the default {@link currencyFormatOptions}. */
export const useCurrencyFormatter = () =>
  useNumberFormatter(currencyFormatOptions)
