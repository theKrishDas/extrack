import { ark } from "@ark-ui/react/factory"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

export function Spacer({ className, ...rest }: ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      aria-hidden={true}
      className={cn("spacer h-3", className)}
      {...rest}
    />
  )
}
