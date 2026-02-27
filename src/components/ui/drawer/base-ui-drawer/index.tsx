import { DrawerPreview as DrawerPrimitive } from "@base-ui/react/drawer"
import { cn } from "tailwind-variants"

const Root = DrawerPrimitive.Root
const Trigger = DrawerPrimitive.Trigger
const Close = DrawerPrimitive.Close
const Content = ({
  className,
  ...rest
}: React.ComponentProps<typeof DrawerPrimitive.Content>) => (
  <DrawerPrimitive.Portal>
    <DrawerPrimitive.Backdrop className="fixed inset-0 z-50 min-h-dvh bg-black opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress)))] transition-opacity duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] [--backdrop-opacity:0.2] [--bleed:3rem] data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-swiping:duration-0 supports-[-webkit-touch-callout:none]:absolute dark:[--backdrop-opacity:0.7]" />
    <DrawerPrimitive.Viewport className="fixed inset-0 z-50 flex items-end justify-center">
      <DrawerPrimitive.Popup
        className={cn(
          // "data-ending-style:transform-[translateY(calc(100%-3rem))] data-starting-style:transform-[translateY(calc(100%-3rem))] -mb-12 max-h-[calc(80vh+3rem)] pb-[calc(1.5rem+env(safe-area-inset-bottom,0px)+3rem)]",

          "mx-auto flex w-[calc(100%-var(--spacing)*1.5*2)] max-w-lg flex-col",
          // Gap from bottom via padding on the viewport or margin on popup
          "mb-1.5", // ← this lifts it off the bottom
          "max-h-[80vh] rounded-2xl bg-background-primary-elevated",
          "pb-[env(safe-area-inset-bottom,0px)]", // prevent content from being hidden behind iPhone home indicator
          "rounded-3xl supports-[corner-shape:squircle]:rounded-[3.25rem] supports-[corner-shape:squircle]:[corner-shape:superellipse(1.8)]",
          "touch-auto overflow-y-auto overscroll-contain",
          "transform-[translateY(var(--drawer-swipe-movement-y))]",
          "transition-transform duration-450 ease-[cubic-bezier(0.32,0.72,0,1)]",
          "data-starting-style:transform-[translateY(calc(100%+var(--spacing)*1.5))]",
          "data-ending-style:transform-[translateY(calc(100%+var(--spacing)*1.5))]", // ← +1rem accounts for the mb-4 gap
          "data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)]",
          "data-swiping:select-none"
        )}
      >
        <div className="mx-auto mt-1.25 mb-4 h-1.25 w-9 rounded-full bg-gray-300" />
        <DrawerPrimitive.Content
          className={cn("mx-auto w-full max-w-lg", className)}
          {...rest}
        />
      </DrawerPrimitive.Popup>
    </DrawerPrimitive.Viewport>
  </DrawerPrimitive.Portal>
)
const Title = ({
  className,
  ...rest
}: React.ComponentProps<typeof DrawerPrimitive.Title>) => (
  <DrawerPrimitive.Title
    className={cn(
      "max-w-[65%] truncate px-2 font-semibold text-label-primary text-xl tracking-[0.015rem]",
      className
    )}
    {...rest}
  />
)
const Description = DrawerPrimitive.Description
export const Drawer = { Root, Trigger, Close, Content, Title }
