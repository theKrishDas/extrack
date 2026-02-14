"use client"

import type { ComponentProps } from "react"
import { Drawer as DrawerPrimitive } from "vaul"
import { Container } from "@/components/layout/container"
import { cn } from "@/lib/utils"

import { Button, type ButtonProps } from "../button/animated-button"

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
      color={color}
      fullWidth={fullWidth}
      size={size}
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
            "group/drawer-content fixed inset-x-0 bottom-0 z-50 h-fit p-2 outline-none",
            className
          )}
          data-slot="drawer-content"
          {...rest}
        >
          <div className="flex flex-col gap-2.5 rounded-[2.35rem] bg-gray-6 p-4">
            {children}
          </div>
        </DrawerPrimitive.Content>
      </Container>
    </Portal>
  )
}

const Header = ({ className, ...rest }: ComponentProps<"div">) => {
  return (
    <div
      className={cn("flex flex-col gap-2.5 p-2 pb-6", className)}
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
    <DrawerPrimitive.Title
      className={cn(
        "font-semibold text-label-primary text-xl tracking-[0.015rem]",
        srOnly && "sr-only",
        className
      )}
      data-slot="drawer-title"
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
      className={cn(
        "text-label-primary text-lg leading-snug tracking-[0.015rem]",
        srOnly && "sr-only",
        className
      )}
      data-slot="drawer-description"
      {...rest}
    />
  )
}

const Footer = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn("flex flex-col gap-2.5", className)}
      data-slot="drawer-footer"
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
export { Drawer }
