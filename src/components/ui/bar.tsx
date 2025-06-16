import {ComponentProps} from "react"
import {ark} from "@ark-ui/react/factory"

import {cn} from "@/lib/utils"

const Bar = ({
  className,
  size,
  orientation = "vertical",
  style,
  ...rest
}: ComponentProps<typeof ark.div> & {
  size: number
  orientation?: "horizontal" | "vertical"
}) => {
  const isVertical = orientation === "vertical"
  return (
    <ark.div
      className={cn(isVertical ? "w-full" : "h-full", className)}
      style={{
        height: isVertical ? `${size}%` : "full",
        width: !isVertical ? `${size}%` : "full",
        ...style,
      }}
      {...rest}
    />
  )
}

export default Bar
