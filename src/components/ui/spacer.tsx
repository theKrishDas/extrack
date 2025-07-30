import {ComponentProps} from "react"
import {ark} from "@ark-ui/react/factory"

import {cn} from "@/lib/utils"

export function Spacer({className, ...rest}: ComponentProps<typeof ark.div>) {
  return (
    <ark.div className={cn("spacer h-3", className)} aria-hidden {...rest} />
  )
}
