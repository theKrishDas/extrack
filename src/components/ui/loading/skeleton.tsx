import { ark } from "@ark-ui/react/factory"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

function Skeleton({ className, ...rest }: ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      className={cn("animate-pulse bg-fill-primary", className)}
      {...rest}
    />
  )
}

export { Skeleton }
