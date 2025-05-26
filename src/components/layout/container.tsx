import {ComponentPropsWithoutRef, RefObject} from "react"
import {Slot} from "@radix-ui/react-slot"

import {cn} from "@/lib/utils"

export interface ContainerProps extends ComponentPropsWithoutRef<"div"> {
  asChild?: boolean
  ref?: RefObject<HTMLDivElement | null>
}

function Container({className, asChild = false, ref, ...rest}: ContainerProps) {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      ref={ref}
      className={cn("mx-auto w-full max-w-xl", className)}
      {...rest}
    />
  )
}

export {Container}
