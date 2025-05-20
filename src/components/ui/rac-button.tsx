import {RefObject, useRef} from "react"
import {AriaButtonProps, useButton} from "@react-aria/button"
import {FocusRing} from "@react-aria/focus"
import {PressEvent} from "@react-aria/interactions"
import {VariantProps} from "class-variance-authority"
import {useAnimate} from "motion/react-mini"
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
  const [scope, animate] = useAnimate()

  const handlePressStart = (e: PressEvent): void => {
    animate(
      scope.current,
      {backgroundColor: "color-mix( in oklab, var(--gray-1), transparent)"},
      {duration: 0}
    )

    if (onPressStart) onPressStart(e)
  }
  const handlePressEnd = (e: PressEvent): void => {
    animate(scope.current, {
      backgroundColor:
        "color-mix( in oklab, var(--fill-color) var(--fill-tertiary-opacity), transparent)",
    })
    if (onPressEnd) onPressEnd(e)
  }

  const {buttonProps} = useButton(
    {...rest, onPressStart: handlePressStart, onPressEnd: handlePressEnd},
    internalRef
  )

  return (
    <FocusRing focusRingClass="ring-offset-background ring-4 ring-[var(--button-color)]/50 ring-offset-2">
      <button
        style={{
          WebkitTapHighlightColor: "transparent",
        }}
        className={cn(
          "focus:outline-none focus-visible:outline-none",
          buttonVariants({
            variant,
            color,
            size,
            isIconOnly,
            focusTreatment: false,
            className,
          })
        )}
        {...buttonProps}
        // ref={mergeRefs([internalRef, ref])}
        ref={mergeRefs([internalRef, ref, scope])}
      >
        {children}
      </button>
    </FocusRing>
  )
}

export {Button}
