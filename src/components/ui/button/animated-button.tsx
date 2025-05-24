"use client"

import {ReactElement, RefObject, SVGProps} from "react"
import {Slot} from "@radix-ui/react-slot"
import {mergeRefs} from "@react-aria/utils"
import {VariantProps} from "class-variance-authority"
import {useAnimate} from "motion/react-mini"
import {
  Button as RacButton,
  type ButtonProps as RacButtonProps,
} from "react-aria-components"

import {cn} from "@/lib/utils"

import {buttonVariants} from "./button-variants"

interface ButtonProps
  extends RacButtonProps,
    Omit<VariantProps<typeof buttonVariants>, "focusTreatment"> {
  ref?: RefObject<HTMLButtonElement | null>
  startIcon?: ReactElement<SVGProps<SVGSVGElement>>
  endIcon?: ReactElement<SVGProps<SVGSVGElement>>
}

const Button = ({
  className,
  variant,
  color,
  size,
  isIconOnly,
  ref,
  style,
  children,
  startIcon,
  endIcon,
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

  return (
    <RacButton
      {...rest}
      onPressStart={animatePressStart}
      onPressEnd={animatePressEnd}
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
      style={{
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
      ref={mergeRefs(ref, scope)}
    >
      <>
        <Slot className="-ml-1">{startIcon}</Slot>
        {children}
        <Slot className="-mr-1">{endIcon}</Slot>
      </>
    </RacButton>
  )
}

export {Button}
