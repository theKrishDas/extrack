"use client"

import {ComponentProps} from "react"
import {mergeRefs} from "@react-aria/utils"
import {VariantProps} from "class-variance-authority"
import {useAnimate} from "motion/react-mini"
import {Button as RacButton} from "react-aria-components"

import {cn} from "@/lib/utils"

import {buttonVariants} from "./button-variants"

interface ButtonProps
  extends ComponentProps<typeof RacButton>,
    Omit<VariantProps<typeof buttonVariants>, "focusTreatment"> {}

const Button = ({
  className,
  variant,
  color,
  size,
  isIconOnly,
  fullWidth,
  ref,
  style,
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
          fullWidth,
          focusTreatment: false,
          className,
        })
      )}
      style={{
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
      ref={mergeRefs(ref, scope)}
    />
  )
}

export {Button, type ButtonProps}
