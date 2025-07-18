"use client"

import {ComponentProps} from "react"
import {
  useSeparator,
  type SeparatorProps as SeparatorPrimitiveProps,
} from "react-aria"

import {cn} from "@/lib/utils"

export interface SeparatorProps extends SeparatorPrimitiveProps {
  className?: string
  opacity?: "opaque" | "non-opaque"
  noMargin?: boolean
  useBlendig?: boolean
}

function Separator({
  className,
  opacity = "opaque",
  orientation,
  noMargin = false,
  useBlendig = false,
  ...rest
}: SeparatorProps) {
  const {separatorProps} = useSeparator(rest)

  return (
    <div
      className={cn(
        "mt-1 rounded-full",
        opacity === "opaque"
          ? "bg-separator-opaque"
          : "bg-separator-non-opaque",
        orientation === "vertical"
          ? "mx-1.5 h-full w-px"
          : "my-1.5 h-px w-full",
        useBlendig && [
          // "bg-separator-opaque mix-blend-screen dark:mix-blend-color-dodge",
          "bg-black/12 mix-blend-plus-darker dark:bg-[#1A1A1A]/100 dark:mix-blend-screen",
        ],
        noMargin && "m-0",
        className
      )}
      {...separatorProps}
    />
  )
}

export {Separator}
