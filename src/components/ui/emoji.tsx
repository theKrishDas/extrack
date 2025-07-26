import {ComponentProps} from "react"
import {ark} from "@ark-ui/react/factory"

import {cn} from "@/lib/utils"

export function Emoji({className, ...rest}: ComponentProps<typeof ark.p>) {
  return (
    <ark.p className={cn("font-rnx-rounded text-white", className)} {...rest} />
  )
}
