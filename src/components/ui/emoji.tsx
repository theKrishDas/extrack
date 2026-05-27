import { ark } from "@ark-ui/react/factory"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

export function Emoji({
  className,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
  ...rest
}: ComponentProps<typeof ark.span>) {
  return (
    <ark.span
      aria-hidden={ariaHidden ?? (ariaLabel ? undefined : true)}
      aria-label={ariaLabel}
      className={cn(
        "ui-emoji",
        "select-none font-rnx-rounded text-white leading-none tracking-[0]",
        className
      )}
      data-ui="emoji"
      {...rest}
    />
  )
}
