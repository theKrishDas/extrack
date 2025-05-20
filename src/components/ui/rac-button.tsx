import {RefObject} from "react"
import {AriaButtonProps, useButton} from "@react-aria/button"
import {FocusRing} from "@react-aria/focus"
import {mergeRefs} from "@react-aria/utils"
import {VariantProps} from "class-variance-authority"
import {useAnimate} from "motion/react-mini"

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
  const [scope, animate] = useAnimate()

  const animatePressStart = (): void => {
    animate(
      scope.current,
      {backgroundColor: "var(--button-highlight)"},
      {duration: 0}
    )
  }
  const animatePressEnd = (): void => {
    animate(scope.current, {backgroundColor: "var(--button-bg)"})
  }

  const {buttonProps} = useButton(
    {
      ...rest,
      onPressStart: e => {
        animatePressStart()
        onPressStart?.(e)
      },
      onPressEnd: e => {
        animatePressEnd()
        onPressEnd?.(e)
      },
    },
    scope
  )

  // TODO: Try playing with this
  // const mergedProps = mergeProps(buttonProps, rest) // import from @react-aria/utils

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
        ref={mergeRefs(ref, scope)}
      >
        {children}
      </button>
    </FocusRing>
  )
}

export {Button}
