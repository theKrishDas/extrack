import {RefObject, useRef} from "react"
import {AriaButtonProps, useButton} from "@react-aria/button"
import {FocusRing} from "@react-aria/focus"
import {PressEvent} from "@react-aria/interactions"
import {VariantProps} from "class-variance-authority"
import {mergeRefs} from "react-merge-refs"

import {cn} from "@/lib/utils"

import {buttonVariants} from "./button"

// export interface ButtonProps
//   extends Omit<
//       ButtonHTMLAttributes<HTMLButtonElement>,
//       keyof AriaButtonProps | "color"
//     >,
//     AriaButtonProps,
//     VariantProps<typeof buttonVariants> {
//   ref?: React.Ref<HTMLButtonElement>
// }

export interface ButtonProps
  extends AriaButtonProps,
    Omit<VariantProps<typeof buttonVariants>, "focusTreatment"> {
  className?: string
  ref?: RefObject<HTMLButtonElement | null>
}

const Button = ({
  variant,
  color,
  size,
  isIconOnly,
  children,
  className,
  onPressStart,
  onPressEnd,
  ref,
  ...rest
}: ButtonProps) => {
  const internalRef = useRef<HTMLButtonElement>(null)
  const handlePressStart = (e: PressEvent): void => {
    if (onPressStart) onPressStart(e)
  }
  const handlePressEnd = (e: PressEvent): void => {
    if (onPressEnd) onPressEnd(e)
  }

  const {buttonProps, isPressed} = useButton(
    {...rest, onPressStart: handlePressStart, onPressEnd: handlePressEnd},
    internalRef
  )

  return (
    <FocusRing focusRingClass="ring-offset-background ring-4 ring-[var(--button-color)]/50 ring-offset-2 focus:outline-none focus-visible:outline-none">
      <button
        className={cn(
          buttonVariants({
            variant,
            color,
            size,
            isIconOnly,
            focusTreatment: false,
            className,
          }),
          // isPressed && "bg-[color-mix(in_oklab,white_8%,var(--button-color)_20%)]"
          // isPressed && "bg-[color-mix(in_oklab,var(--gray-1)_30%,var(--button-color)_20%)]"
          // isPressed && "bg-[var(--button-color)] text-[var(--button-bg)]"
          isPressed && "bg-[var(--gray-3)]"
        )}
        {...buttonProps}
        ref={mergeRefs([internalRef, ref])}
      >
        {children}
      </button>
    </FocusRing>
  )
}

export {Button}
