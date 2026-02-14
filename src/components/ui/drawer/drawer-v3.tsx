"use client"

import { ark } from "@ark-ui/react/factory"
import type { ComponentProps } from "react"
import { Drawer as DrawerPrimitive } from "vaul"
import { Container } from "@/components/layout/container"
import { cn } from "@/lib/utils"

import { Button } from "../button/animated-button"
import { ProgressiveBlur } from "../progressive-blur"
import { Spacer } from "../spacer"

const Root = ({
  shouldScaleBackground = false,
  setBackgroundColorOnScale = false,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    data-slot="drawer"
    setBackgroundColorOnScale={setBackgroundColorOnScale}
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
)

const NestedRoot = ({
  shouldScaleBackground = false,
  setBackgroundColorOnScale = false,
  ...props
}: ComponentProps<typeof DrawerPrimitive.NestedRoot>) => (
  <DrawerPrimitive.NestedRoot
    data-slot="nested-drawer"
    setBackgroundColorOnScale={setBackgroundColorOnScale}
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
)

const Trigger = ({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) => {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

const Portal = ({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) => {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

const ClosePrimitive = ({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) => {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

const Close = ({
  className,
  ...props
}: Omit<React.ComponentProps<typeof DrawerPrimitive.Close>, "asChild">) => {
  return (
    <DrawerPrimitive.Close
      {...props}
      asChild
      className={cn("font-semibold", className)}
      data-slot="drawer-close"
    >
      <Button
        className="backdrop-blur-sm [--button-bg:color-mix(var(--gray-6)_20%)]"
        color="gray"
        isIconOnly
        size="sm"
        variant="ghost"
      >
        􀆄
      </Button>
    </DrawerPrimitive.Close>
  )
}

const Overlay = ({
  className,
  ...rest
}: ComponentProps<typeof DrawerPrimitive.Overlay>) => {
  return (
    <DrawerPrimitive.Overlay
      className={cn("fixed inset-0 z-50 bg-black/50", className)}
      data-slot="drawer-overlay"
      {...rest}
    />
  )
}

const Content = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof DrawerPrimitive.Content>) => {
  return (
    <Portal>
      <Overlay />
      <Container asChild>
        <DrawerPrimitive.Content
          className={cn(
            "group/drawer-content fixed inset-x-0 bottom-0 z-50 flex h-full flex-col justify-end pt-4 outline-none",
            // "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mx-auto data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:max-w-xl data-[vaul-drawer-direction=top]:rounded-b-[1.25rem]",
            // "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mx-auto data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:max-w-xl data-[vaul-drawer-direction=bottom]:rounded-t-[1.25rem]",
            // "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:sm:max-w-sm",
            // "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:sm:max-w-sm",
            // "[--initial-transform:calc(100%+0.375rem)]", // tailwind's 1.5 = 0.375rem
            className
          )}
          data-slot="drawer-content"
          {...rest}
        >
          {children}
        </DrawerPrimitive.Content>
      </Container>
    </Portal>
  )
}

const Scroll = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ark.div>) => {
  return (
    <ark.div
      className={cn(
        "h-full w-full overflow-y-auto rounded-t-2xl",
        "bg-background dark:bg-gray-6",
        className
      )}
      {...rest}
    >
      <Spacer className="sticky top-0 h-16 bg-gradient-to-b from-background/80 to-background/0 sm:h-15 dark:from-black/0 dark:to-black/0">
        <ProgressiveBlur
          blurLevels={[0.5, 1, 2, 4, 8, 16, 32, 64]}
          height="100%"
          position="top"
          // blurLevels={[0.5, 1, 2, 4, 8, 32, 64, 64]}
        />
      </Spacer>

      {children}
    </ark.div>
  )
}

const Header = ({ className, ...rest }: ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "absolute inset-x-0 top-4 z-51 flex h-16 items-center px-4 sm:h-15",
        className
      )}
      data-slot="drawer-header"
      {...rest}
    />
  )
}

const Title = ({
  className,
  srOnly = false,
  ...rest
}: React.ComponentProps<typeof DrawerPrimitive.Title> & {
  srOnly?: boolean
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-center">
      <DrawerPrimitive.Title
        className={cn(
          "max-w-[65%] truncate rounded-full bg-background/20 px-2 py-0.5 font-semibold text-label-primary text-xl tracking-[0.015rem] backdrop-blur dark:bg-gray-6/20",
          srOnly && "sr-only",
          className
        )}
        data-slot="drawer-title"
        {...rest}
      />
    </div>
  )
}

const Footer = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn("flex flex-row-reverse gap-1 px-4 pb-4", className)}
      data-slot="drawer-footer"
      {...props}
    />
  )
}

// Handle
// <div className="h-4.5 pt-1.5">
//   <DrawerPrimitive.Handle style={{backgroundColor: "var(--gray-2)"}} />
// </div>

const Drawer = {
  Root,
  NestedRoot,
  Trigger,
  Portal,
  ClosePrimitive,
  Close,
  Overlay,
  Content,
  Scroll,
  Header,
  Footer,
  Title,
}
export { Drawer }
