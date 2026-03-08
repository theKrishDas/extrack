import { z } from "zod"
import { NO_CONSECUTIVE_SPACES, NO_LEADING_SPACE } from "../regex"

/** Base schema for monetary values in cents: integer, safe, nonnegative, finite. */
export const centsBase = z.number().int().safe().nonnegative().finite()

/** Base schema for name strings: no leading space, no consecutive spaces. */
export const nameBase = z
  .string()
  .regex(NO_LEADING_SPACE, "Must not start with a space")
  .regex(NO_CONSECUTIVE_SPACES, "No consecutive spaces")

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
  cents(min?: number, max?: number) {
    let schema = centsBase
    if (min !== undefined) schema = schema.min(min) as typeof centsBase
    if (max !== undefined) schema = schema.max(max) as typeof centsBase
    return schema
  },

  /**
   * Returns a Zod schema for a name string with length constraints.
   *
   * @param min - Minimum string length (inclusive).
   * @param max - Maximum string length (inclusive).
   * @returns Zod schema validating a name within the given length bounds.
   *
   * @example
   * v.name(1, 50) // non-empty name up to 50 chars
   */
  name(min: number, max: number) {
    return nameBase.min(min).max(max)
  },
}
