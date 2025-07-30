"use client"

import {ComponentProps} from "react"
import {ark} from "@ark-ui/react/factory"
import {Drawer as DrawerPrimitive} from "vaul"

import {cn} from "@/lib/utils"
import {Container} from "@/components/layout/container"

import {Button, ButtonProps} from "../button/animated-button"
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

const Action = ({
  className,
  size = "lg",
  fullWidth = true,
  color = "gray",
  variant = "gray",
  ...rest
}: ButtonProps) => {
  return (
    <Button
      className={cn("rounded-full", className)}
      size={size}
      fullWidth={fullWidth}
      color={color}
      variant={variant}
      {...rest}
    />
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
            "group/drawer-content fixed inset-x-0 bottom-0 z-50 h-fit p-2 outline-none",
            className
          )}
          {...rest}
        >
          <div className="bg-gray-6 flex flex-col gap-2.5 rounded-[2.35rem] p-4">
            {children}
          </div>
        </DrawerPrimitive.Content>
      </Container>
    </Portal>
  )
}

const Header = ({className, ...rest}: ComponentProps<"div">) => {
  return (
    <>
      <div
        data-slot="drawer-header"
        className={cn("flex flex-col gap-2.5 p-2 pb-6", className)}
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
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn(
        "text-label-primary text-xl font-semibold tracking-[0.015rem]",
        srOnly && "sr-only",
        className
      )}
      {...rest}
    />
  )
}

const Description = ({
  className,
  srOnly = false,
  ...rest
}: React.ComponentProps<typeof DrawerPrimitive.Description> & {
  srOnly?: boolean
}) => {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn(
        "text-label-primary text-lg leading-snug tracking-[0.015rem]",
        srOnly && "sr-only",
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
      className={cn("flex flex-col gap-2.5", className)}
      {...props}
    />
  )
}

const Drawer = {
  Root,
  NestedRoot,
  Trigger,
  Portal,
  ClosePrimitive,
  Action,
  Overlay,
  Content,
  Header,
  Description,
  Footer,
  Title,
}
export {Drawer}
