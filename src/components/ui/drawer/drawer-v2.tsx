"use client"

import {ComponentProps, createContext, use} from "react"
import {Drawer as DrawerPrimitive} from "vaul"

import {cn} from "@/lib/utils"

import {Button} from "../button/animated-button"

export type DrawerContextType = {showHandle?: boolean; useBlur?: boolean}
export const DrawerContext = createContext<DrawerContextType | null>(null)
export const useDrawerContext = () => {
  const context = use(DrawerContext)
  if (!context)
    throw new Error("useDrawerContext must be used within the Provider.")
  return context
}

const Root = ({
  shouldScaleBackground = true,
  setBackgroundColorOnScale = false,
  showHandle = false,
  useBlur = false,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Root> &
  Pick<DrawerContextType, "showHandle" | "useBlur">) => (
  <DrawerContext value={{showHandle, useBlur}}>
    <DrawerPrimitive.Root
      data-slot="drawer"
      shouldScaleBackground={shouldScaleBackground}
      setBackgroundColorOnScale={setBackgroundColorOnScale}
      {...props}
    />
  </DrawerContext>
)

const NestedRoot = ({
  shouldScaleBackground = true,
  setBackgroundColorOnScale = false,
  showHandle = false,
  useBlur = false,
  ...props
}: ComponentProps<typeof DrawerPrimitive.NestedRoot> &
  Pick<DrawerContextType, "showHandle" | "useBlur">) => (
  <DrawerContext value={{showHandle, useBlur}}>
    <DrawerPrimitive.NestedRoot
      data-slot="nested-drawer"
      shouldScaleBackground={shouldScaleBackground}
      setBackgroundColorOnScale={setBackgroundColorOnScale}
      {...props}
    />
  </DrawerContext>
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
      className={cn("-mr-0.5 font-semibold", className)}
      asChild
    >
      <Button color="gray" size="xs" isIconOnly>
        􀆄
      </Button>
    </DrawerPrimitive.Close>
  )
}

const Overlay = ({
  className,
  ...rest
}: ComponentProps<typeof DrawerPrimitive.Overlay>) => {
  const {useBlur} = useDrawerContext()
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50",
        useBlur && "backdrop-blur-[6px]",
        className
      )}
      {...rest}
    />
  )
}

const Content = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof DrawerPrimitive.Content>) => {
  const {showHandle} = useDrawerContext()

  return (
    <Portal>
      <Overlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          "group/drawer-content bg-background-primary dark:bg-background-secondary/90 fixed z-50 flex h-auto flex-col backdrop-blur-3xl outline-none",
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mx-auto data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:max-w-xl data-[vaul-drawer-direction=top]:rounded-b-[1.25rem]",
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mx-auto data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:max-w-xl data-[vaul-drawer-direction=bottom]:rounded-t-[1.25rem]",
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:sm:max-w-sm",
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:sm:max-w-sm",
          // "[--initial-transform:calc(100%+0.375rem)]", // tailwind's 1.5 = 0.375rem
          className
        )}
        {...rest}
      >
        {showHandle && (
          <div className="handleContainer pt-1.5 pb-1">
            <DrawerPrimitive.Handle
              style={{backgroundColor: "var(--gray-2)"}}
            />
          </div>
        )}
        {children}
      </DrawerPrimitive.Content>
    </Portal>
  )
}

const Header = ({className, ...rest}: ComponentProps<"div">) => {
  const {showHandle} = useDrawerContext()
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "mt-[0.9375rem] flex h-10.5 justify-end px-4 pb-3 pl-4.5",
        showHandle && "mt-0",
        className
      )}
      {...rest}
    />
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

const Title = ({
  className,
  srOnly = false,
  ...rest
}: React.ComponentProps<typeof DrawerPrimitive.Title> & {srOnly?: boolean}) => {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn(
        "text-label-primary flex-1 text-lg font-semibold tracking-[0.01em]",
        srOnly && "sr-only",
        className
      )}
      {...rest}
    />
  )
}

const Drawer = {
  Root,
  NestedRoot,
  Trigger,
  Portal,
  ClosePrimitive,
  Close,
  Overlay,
  Content,
  Header,
  Footer,
  Title,
}
export {Drawer}
