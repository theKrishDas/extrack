"use client"

import {RefObject} from "react"
import {
  Button as RacButton,
  type ButtonProps as RacButtonProps,
} from "react-aria-components"

import {cn} from "@/lib/utils"

interface ButtonProps extends RacButtonProps {
  ref?: RefObject<HTMLButtonElement | null>
}

const Button = ({className, ref, ...rest}: ButtonProps) => {
  return (
    <RacButton
      className={cn(
        "border-separator-non-opaque rounded-2xl border p-3",
        className
      )}
      ref={ref}
      {...rest}
    />
  )
}

export {Button}
