import { z } from "zod"
import { CONSECUTIVE_SPACES, LEADING_WHITESPACE } from "../regex"

/** Builds a `ZodNumber` monetary schema with optional int constraint, bounds, and a min/max sanity check. */
export function monetary(int: boolean, min?: number, max?: number) {
  if (min !== undefined && max !== undefined && min > max)
    throw new RangeError(`min (${min}) must not exceed max (${max})`)

  /** Base schema for monetary values (cents or dollars): number, safe, nonnegative, and finite. */
  const monetaryNumberBase = z.number().safe().nonnegative().finite()

  const base = int ? monetaryNumberBase.int() : monetaryNumberBase
  const withMin = min !== undefined ? base.min(min) : base
  const withMax = max !== undefined ? withMin.max(max) : withMin
  return withMax
}

/**
 * Shared Zod schema validators.
 */
export const v = {
  /**
   * Returns a Zod schema for a monetary value in cents.
   *
   * @param min - Minimum cents value (inclusive).
   * @param max - Maximum cents value (inclusive).
   * @returns Zod schema validating an integer cent amount within the given bounds.
   *
   * @example
   * v.cents()        // any nonnegative integer
   * v.cents(0, 9999) // 0–9999 cents
   */
  cents: (min?: number, max?: number) => monetary(true, min, max),

  /**
   * Returns a Zod schema for a monetary value in dollars.
   *
   * @param min - Minimum dollar value (inclusive).
   * @param max - Maximum dollar value (inclusive).
   * @returns Zod schema validating a nonnegative finite dollar amount within the given bounds.
   *
   * @example
   * v.dollars()          // any nonnegative number
   * v.dollars(0, 999.99) // 0–999.99 dollars
   */
  dollars: (min?: number, max?: number) => monetary(false, min, max),

  /**
   * Trims whitespace, then validates no leading spaces or consecutive spaces.
   * @param min - Minimum character length (inclusive).
   * @param max - Maximum character length (inclusive).
   *
   * @returns Zod schema validating a name within the given length bounds.
   *
   * @example
   * v.name(1, 50) // non-empty name up to 50 chars
   */
  name: (min: number, max: number) =>
    z
      .string()
      .min(min)
      .max(max)
      .transform((val) => val.trim())
      .refine((val) => !CONSECUTIVE_SPACES.test(val), "No consecutive spaces")
      .refine(
        (val) => !LEADING_WHITESPACE.test(val),
        "Must not start with a space"
      ),
}
