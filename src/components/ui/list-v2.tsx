import { ark } from "@ark-ui/react/factory"
import type { ComponentProps, CSSProperties } from "react"

import type { Colors } from "@/lib/constants/colors"
import { cn } from "@/lib/utils"

import { Separator } from "./separator"

function Root({ className, ...rest }: ComponentProps<typeof ark.div>) {
  return <ark.div className={cn("ListRoot", className)} {...rest} />
}

function Wrapper({ className, ...rest }: ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      className={cn(
        "ListWrapper",
        "rounded-[1.625rem] bg-fill-tertiary leading-none",
        className
      )}
      {...rest}
    />
  )
}

function Item({ className, ...rest }: ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      className={cn(
        "ListItem",
        "group/item flex h-13 w-full gap-1 bg-fill-opaque px-4 first:rounded-t-[1.625rem] last:rounded-b-[1.625rem] first:[&_[role='separator']]:bg-fill-opaque",
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
}: ComponentProps<typeof ark.div> & { color?: Colors | "default" }) {
  const colorVariable =
    color === "default" ? "var(--label-secondary)" : `var(--ios-${color})`

  return (
    <ark.div
      className={cn(
        "ListImage",
        "inline-flex h-full items-center pr-2 text-(--list-image-color) text-lg",
        className
      )}
      style={{ "--list-image-color": colorVariable, ...style } as CSSProperties}
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
      <Separator noMargin orientation="horizontal" useBlendig />
      {children}
    </ark.div>
  )
}

function Trailing({ className, ...rest }: ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      className={cn("ListTrailing", "flex h-full w-full", className)}
      {...rest}
    />
  )
}

function Title({ className, ...rest }: ComponentProps<typeof ark.div>) {
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
          "font-semibold text-[1.15rem] text-label-primary tracking-[0.01em]",
        level === "2" &&
          "font-semibold text-base text-label-primary tracking-[0.01em]",
        level === "3" && "font-medium text-label-secondary tracking-[0.01em]",
        level === "heading" &&
          "font-medium text-label-secondary text-sm uppercase",
        level === "footer" &&
          "text-label-tertiary text-sm leading-snug tracking-[0.015em]",
        srOnly && "sr-only",
        className
      )}
      {...rest}
    />
  )
}

function Accessories({ className, ...rest }: ComponentProps<typeof ark.div>) {
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

function Header({ className, ...rest }: ComponentProps<typeof ark.div>) {
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
}: ComponentProps<typeof ark.h4> & { srOnly?: boolean }) {
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
export { List }
