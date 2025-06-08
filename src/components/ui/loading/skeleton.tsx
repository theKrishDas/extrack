import {ComponentProps} from "react"
import {ark} from "@ark-ui/react/factory"

import {cn} from "@/lib/utils"

function Skeleton({className, ...rest}: ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      className={cn("bg-fill-primary animate-pulse", className)}
      {...rest}
    />
  )
}

export {Skeleton}
