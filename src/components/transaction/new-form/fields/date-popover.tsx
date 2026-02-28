import type React from "react"
import {
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
  composeRenderProps,
  OverlayArrow,
} from "react-aria-components"
import { tv } from "tailwind-variants"

export interface PopoverProps extends Omit<AriaPopoverProps, "children"> {
  showArrow?: boolean
  children: React.ReactNode
}

const styles = tv({
  base: [
    "z-50 bg-background-tertiary bg-clip-padding shadow-ios-md outline-0 dark:backdrop-blur-2xl dark:backdrop-saturate-200 forced-colors:bg-[Canvas]",
    "supports-[corner-shape:squircle]:corner-squircle rounded-xl supports-[corner-shape:squircle]:rounded-2xl",
  ],
  variants: {
    isEntering: {
      true: "fade-in placement-bottom:slide-in-from-top-1 placement-top:slide-in-from-bottom-1 placement-left:slide-in-from-right-1 placement-right:slide-in-from-left-1 animate-in duration-200 ease-out",
    },
    isExiting: {
      true: "fade-out placement-bottom:slide-out-to-top-1 placement-top:slide-out-to-bottom-1 placement-left:slide-out-to-right-1 placement-right:slide-out-to-left-1 animate-out duration-150 ease-in",
    },
  },
})

export function Popover({
  children,
  showArrow,
  className,
  ...props
}: PopoverProps) {
  const offset = showArrow ? 12 : 8
  return (
    <AriaPopover
      offset={offset}
      {...props}
      className={composeRenderProps(className, (className, renderProps) =>
        styles({ ...renderProps, className })
      )}
    >
      {showArrow && (
        <OverlayArrow className="group">
          <svg
            className="block fill-white stroke-1 stroke-black/10 group-placement-bottom:rotate-180 group-placement-left:-rotate-90 group-placement-right:rotate-90 dark:fill-[#1f1f21] dark:stroke-neutral-700 forced-colors:fill-[Canvas] forced-colors:stroke-[ButtonBorder]"
            height={12}
            viewBox="0 0 12 12"
            width={12}
          >
            <title>arrow</title>
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        </OverlayArrow>
      )}
      {children}
    </AriaPopover>
  )
}
