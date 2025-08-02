"use client"

import {ComponentProps} from "react"
import {ark} from "@ark-ui/react/factory"
import {Drawer as DrawerPrimitive} from "vaul"

import {cn} from "@/lib/utils"
import {Container} from "@/components/layout/container"

import {Button} from "../button/animated-button"
import {ProgressiveBlur} from "../progressive-blur"
import {Spacer} from "../spacer"

const Root = ({
  shouldScaleBackground = false,
  setBackgroundColorOnScale = false,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    data-slot="drawer"
    shouldScaleBackground={shouldScaleBackground}
    setBackgroundColorOnScale={setBackgroundColorOnScale}
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
    shouldScaleBackground={shouldScaleBackground}
    setBackgroundColorOnScale={setBackgroundColorOnScale}
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
      data-slot="drawer-close"
      className={cn("font-semibold", className)}
      asChild
    >
      <Button
        color="gray"
        size="sm"
        variant="ghost"
        isIconOnly
        className="backdrop-blur-sm [--button-bg:color-mix(var(--gray-6)_20%)]"
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
      data-slot="drawer-overlay"
      className={cn("fixed inset-0 z-50 bg-black/50", className)}
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
          data-slot="drawer-content"
          className={cn(
            "group/drawer-content fixed inset-x-0 bottom-0 z-50 flex h-full flex-col justify-end pt-4 outline-none",
            // "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mx-auto data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:max-w-xl data-[vaul-drawer-direction=top]:rounded-b-[1.25rem]",
            // "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mx-auto data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:max-w-xl data-[vaul-drawer-direction=bottom]:rounded-t-[1.25rem]",
            // "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:sm:max-w-sm",
            // "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:sm:max-w-sm",
            // "[--initial-transform:calc(100%+0.375rem)]", // tailwind's 1.5 = 0.375rem
            className
          )}
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
    <>
      <ark.div
        className={cn(
          "h-full w-full overflow-y-auto rounded-t-2xl",
          "dark:bg-gray-6 bg-background",
          className
        )}
        {...rest}
      >
        <Spacer className="from-background/80 to-background/0 sticky top-0 h-16 bg-gradient-to-b sm:h-15 dark:from-black/0 dark:to-black/0">
          <ProgressiveBlur
            height="100%"
            position="top"
            blurLevels={[0.5, 1, 2, 4, 8, 16, 32, 64]}
            // blurLevels={[0.5, 1, 2, 4, 8, 32, 64, 64]}
          />
        </Spacer>

        {children}
      </ark.div>
    </>
  )
}

const Header = ({className, ...rest}: ComponentProps<"div">) => {
  return (
    <>
      <div
        data-slot="drawer-header"
        className={cn(
          "absolute inset-x-0 top-4 z-51 flex h-16 items-center px-4 sm:h-15",
          className
        )}
        {...rest}
      />
    </>
  )
}

const Title = ({
  className,
  srOnly = false,
  ...rest
}: React.ComponentProps<typeof DrawerPrimitive.Title> & {srOnly?: boolean}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-center">
      <DrawerPrimitive.Title
        data-slot="drawer-title"
        className={cn(
          "text-label-primary dark:bg-gray-6/20 bg-background/20 max-w-[65%] truncate rounded-full px-2 py-0.5 text-xl font-semibold tracking-[0.015rem] backdrop-blur",
          srOnly && "sr-only",
          className
        )}
        {...rest}
      />
    </div>
  )
}

const Footer = ({className, ...props}: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("flex flex-row-reverse gap-1 px-4 pb-4", className)}
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
export {Drawer}
