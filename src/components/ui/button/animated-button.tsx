"use client"

import {RefObject} from "react"
import {mergeRefs} from "@react-aria/utils"
import {useAnimate} from "motion/react-mini"
import {
  Button as RacButton,
  type ButtonProps as RacButtonProps,
} from "react-aria-components"

import {cn} from "@/lib/utils"

interface ButtonProps extends RacButtonProps {
  ref?: RefObject<HTMLButtonElement | null>
}

const Button = ({className, ref, ...rest}: ButtonProps) => {
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
      className={cn(
        "border-separator-non-opaque rounded-2xl border p-3",
        "[--button-bg:var(--fill-opaque)] [--button-highlight:var(--ios-blue)]",
        className
      )}
      onPressStart={animatePressStart}
      onPressEnd={animatePressEnd}
      ref={mergeRefs(ref, scope)}
      {...rest}
    />
  )
}

export {Button}
