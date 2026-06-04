import { useCallback, useState } from "react"

/**
 * Keeps a value controlled when `controlledValue` is provided, or stores it
 * internally when it is `undefined`.
 *
 * `onChange` is called in both modes. In controlled mode, the caller is
 * responsible for updating `controlledValue`.
 *
 * @example
 * ```tsx
 * function Disclosure() {
 *   const [open, setOpen] = useControllableState(undefined, false)
 *
 *   return (
 *     <button onClick={() => setOpen(!open)}>
 *       {open ? "Close" : "Open"}
 *     </button>
 *   )
 * }
 * ```
 */
export function useControllableState<T>(
  controlledValue: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void
): [T, (next: T) => void] {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternalValue(next)
      onChange?.(next)
    },
    [onChange, isControlled]
  )

  return [value, setValue]
}
