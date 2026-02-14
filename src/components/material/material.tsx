import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentPropsWithoutRef, RefObject } from "react"

import { cn } from "@/lib/utils"

export const materialVariants = cva(["material-surface h-auto w-auto"], {
  variants: {
    // ultrathin | thin | [x] regular | [x] thick | chrome
    thickness: {
      regular: "bg-fill-quaternary backdrop-blur-[8px]",
      thick: "bg-fill-quaternary backdrop-blur-2xl",
      chrome:
        "relative isolate bg-fill-quaternary backdrop-blur-2xl before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:bg-background/50 before:content-['']",
    },
    withBorder: {
      true: "shadow-[inset_0_1px,inset_0_0_0_1px] shadow-white/[0.025]",
      false: "",
    },
  },
  defaultVariants: {
    thickness: "regular",
    withBorder: false,
  },
})

export interface MaterialProps
  extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof materialVariants> {
  asChild?: boolean
  as?: "div" | "section"
  ref?: RefObject<HTMLDivElement | null>
}

const Material = ({
  thickness,
  withBorder,
  className,
  asChild = false,
  as = "div",
  ref,
  ...rest
}: MaterialProps) => {
  const Comp = asChild ? Slot : as

  return (
    <Comp
      className={cn(materialVariants({ thickness, withBorder, className }))}
      ref={ref}
      {...rest}
    />
  )
}
Material.displayName = "Material"

export { Material }
