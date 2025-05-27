import {ComponentPropsWithoutRef, RefObject} from "react"
import {Slot} from "@radix-ui/react-slot"

import {cn} from "@/lib/utils"

export interface ContainerProps extends ComponentPropsWithoutRef<"div"> {
  asChild?: boolean
  as?: "div" | "section"
  ref?: RefObject<HTMLDivElement | null>
}

function Container({
  className,
  asChild = false,
  as = "div",
  ref,
  ...rest
}: ContainerProps) {
  const Comp = asChild ? Slot : as

  return (
    <Comp
      ref={ref}
      className={cn("mx-auto w-full max-w-xl", className)}
      {...rest}
    />
  )
}

export {Container}
