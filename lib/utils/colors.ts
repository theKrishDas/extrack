import type { Colors } from "#lib/constants/colors"

export type ColorCSSVar =
  | "var(--gray-1)"
  | `var(--ios-${Exclude<Colors, "gray">})`

/**
 * Maps a {@link Colors} token to its CSS custom property reference.
 *
 * @example
 * // In a style prop:
 * { "--item-color": colorToCSSVar(color) }
 * // In Tailwind:
 * "bg-(--item-color)"
 */
export function colorToCSSVar(color: Colors): ColorCSSVar {
  return color === "gray" ? "var(--gray-1)" : `var(--ios-${color})`
}
