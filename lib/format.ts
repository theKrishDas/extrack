/**
 * Format options for compact number display.
 *
 * @example
 * new Intl.NumberFormat("en", compactNumberFormatOptions).format(4500)  // "4.5K"
 * new Intl.NumberFormat("en", compactNumberFormatOptions).format(2_000_000)  // "2M"
 */
export const compactNumberFormatOptions = {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 1,
} as const satisfies Intl.NumberFormatOptions
