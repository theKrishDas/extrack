import {ComponentProps, CSSProperties} from "react"
import {ark} from "@ark-ui/react/factory"

import {Colors} from "@/lib/constants/colors"
import {cn} from "@/lib/utils"

import {Separator} from "./separator"

function Root({className, ...rest}: ComponentProps<typeof ark.div>) {
  return <ark.div className={cn("ListRoot", className)} {...rest} />
}

function Wrapper({className, ...rest}: ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      className={cn(
        "ListWrapper",
        "bg-fill-tertiary rounded-[1.625rem] leading-none",
        className
      )}
      {...rest}
    />
  )
}

function Item({className, ...rest}: ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      className={cn(
        "ListItem",
        "first:[&_[role='separator']]:bg-fill-opaque hover:[&_[role='separator']]:bg-fill-opaque group/item bg-fill-opaque hover:bg-fill-quaternary flex h-13 w-full gap-1 px-4 first:rounded-t-[1.625rem] last:rounded-b-[1.625rem]",
        className
      )}
      {...rest}
    />
  )
}

function Image({
  className,
  color = "default",
  style,
  ...rest
}: ComponentProps<typeof ark.div> & {color?: Colors | "default"}) {
  const colorVariable =
    color === "default" ? "var(--label-secondary)" : `var(--ios-${color})`

  return (
    <ark.div
      className={cn(
        "ListImage",
        "inline-flex h-full items-center pr-2 text-lg",
        className
      )}
      style={
        {
          "--list-image-color": colorVariable,
          color: colorVariable,
          ...style,
        } as CSSProperties
      }
      {...rest}
    />
  )
}

function Content({
  className,
  children,
  ...rest
}: ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      className={cn("ListContent", "flex h-full w-full flex-col", className)}
      {...rest}
    >
      <Separator orientation="horizontal" noMargin useBlendig />
      {children}
    </ark.div>
  )
}

function Trailing({className, ...rest}: ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      className={cn("ListTrailing", "flex h-full w-full", className)}
      {...rest}
    />
  )
}

function Title({className, ...rest}: ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      className={cn(
        "ListTitle",
        "flex h-full flex-1 items-center gap-2",
        className
      )}
      {...rest}
    />
  )
}

function Text({
  className,
  level = "2",
  srOnly = false,
  ...rest
}: ComponentProps<typeof ark.p> & {
  level?: "1" | "2" | "3" | "heading" | "footer"
  srOnly?: boolean
}) {
  return (
    <ark.p
      className={cn(
        "ListText",
        level === "1" &&
          "text-label-primary text-[1.15rem] font-semibold tracking-[0.01em]",
        level === "2" &&
          "text-label-primary text-base font-semibold tracking-[0.01em]",
        level === "3" && "text-label-secondary font-medium tracking-[0.01em]",
        level === "heading" &&
          "text-label-secondary text-sm font-medium uppercase",
        level === "footer" &&
          "text-label-tertiary text-sm leading-snug tracking-[0.015em]",
        srOnly && "sr-only",
        className
      )}
      {...rest}
    />
  )
}

function Accessories({className, ...rest}: ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      className={cn(
        "ListAccessories",
        "inline-flex h-full items-center justify-items-end",
        className
      )}
      {...rest}
    />
  )
}

function Header({className, ...rest}: ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      className={cn("ListHeader", "w-full px-4 pt-6 pb-1.5", className)}
      {...rest}
    />
  )
}

function Footer({
  className,
  srOnly = false,
  ...rest
}: ComponentProps<typeof ark.h4> & {srOnly?: boolean}) {
  return (
    <ark.h4
      className={cn(
        "ListFooter",
        "w-full px-4 pt-1.5 pb-10",
        srOnly && "sr-only",
        className
      )}
      {...rest}
    />
  )
}

const List = {
  Root,
  Wrapper,
  Item,
  Image,
  Content,
  Trailing,
  Title,
  Accessories,
  Text,
  Header,
  Footer,
}
export {List}
