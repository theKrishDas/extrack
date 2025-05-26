"use client"

import * as React from "react"
import {RefObject} from "react"
import {Drawer as DrawerPrimitive} from "vaul"

import {cn} from "@/lib/utils"

interface RefType<T> {
  ref?: RefObject<T | null>
}

const Drawer = ({
  shouldScaleBackground = true,
  setBackgroundColorOnScale = false,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    setBackgroundColorOnScale={setBackgroundColorOnScale}
    {...props}
  />
)
Drawer.displayName = "Drawer"

const DrawerHandle = DrawerPrimitive.Handle

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

const DrawerOverlay = ({
  className,
  ref,
  ...rest
}: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay> &
  RefType<React.ComponentRef<typeof DrawerPrimitive.Overlay>>) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("bg-background/60 fixed inset-0 z-50", className)}
    {...rest}
  />
)
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const DrawerContent = ({
  className,
  children,
  ref,
  ...rest
}: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> &
  RefType<React.ComponentRef<typeof DrawerPrimitive.Content>>) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mx-auto mt-24 flex h-auto max-w-xl flex-col p-1.5 pt-0 outline-none",
        // "[--initial-transform:calc(100%+0.375rem)]", // tailwind's 1.5 = 0.375rem
        className
      )}
      {...rest}
    >
      <DrawerMaterial>{children}</DrawerMaterial>
    </DrawerPrimitive.Content>
  </DrawerPortal>
)
DrawerContent.displayName = "DrawerContent"

const DrawerMaterial = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "bg-fill-quaternary h-auto overflow-hidden rounded-2xl shadow-[inset_0_1px,inset_0_0_0_1px] shadow-white/[0.025] backdrop-blur-2xl",
      className
    )}
    {...props}
  />
)
DrawerMaterial.displayName = "DrawerMaterial"

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "DrawerHeader grid gap-1.5 p-4 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "DrawerBody mt-auto flex flex-row-reverse gap-2 p-4",
      className
    )}
    {...props}
  />
)
DrawerBody.displayName = "DrawerBody"

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "DrawerFooter mt-auto flex flex-row-reverse gap-2 p-4",
      className
    )}
    {...props}
  />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = ({
  className,
  ref,
  ...rest
}: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title> &
  RefType<React.ComponentRef<typeof DrawerPrimitive.Title>>) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg leading-none font-semibold tracking-tight",
      className
    )}
    {...rest}
  />
)
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = ({
  className,
  ref,
  ...rest
}: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description> &
  RefType<React.ComponentRef<typeof DrawerPrimitive.Description>>) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-label-tertiary text-sm", className)}
    {...rest}
  />
)

DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerMaterial,
  DrawerHeader,
  DrawerFooter,
  DrawerBody,
  DrawerTitle,
  DrawerDescription,
  DrawerHandle,
}
