import { ark } from "@ark-ui/react/factory"
import type { ComponentProps, CSSProperties } from "react"

import { cn } from "@/lib/utils"

const Root = ({
  className,
  noSpacing = false,
  ...rest
}: ComponentProps<typeof ark.ul> & { noSpacing?: boolean }) => {
  return (
    <ark.ul
      className={cn(
        "ListRoot",
        !noSpacing && [
          "[&:has(+.ListRoot)]:mb-8.5",
          // "[&:not(:has(.ListFooter))]:ring",
          "[&:has(.ListFooter):has(~_ul.ListRoot_.ListHeading)]:mb-5.5",
          "[&:not(:has(.ListFooter)):has(~_ul_.ListHeading)]:mb-8",
          "[&:has(.ListFooter):not(:has(~_ul.ListRoot_.ListHeading))]:mb-10",
          "last-of-type:[&:has(.ListFooter)]:mb-10 last-of-type:[&:not(:has(.ListFooter))]:mb-12.5",
        ],
        className
      )}
      {...rest}
    />
  )
}

function Item({ className, ...rest }: ComponentProps<typeof ark.li>) {
  return (
    <ark.li
      className={cn(
        "ListItem",
        "flex items-center gap-2 bg-fill-quaternary pl-4 first-of-type:rounded-t-[0.95rem] last-of-type:rounded-b-[0.95rem] sm:last-of-type:rounded-b-[0.8rem] sm:first-of-type:rounded-t-[0.8rem]",
        "last-of-type:[&_.ListContent]:border-none",
        className
      )}
      {...rest}
    />
  )
}

function Content({ className, ...rest }: ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      className={cn(
        "ListContent inline-flex min-h-12 w-full flex-1 items-center justify-between gap-2 truncate border-separator-non-opaque border-b-1 pr-4 sm:min-h-10",
        className
      )}
      {...rest}
    />
  )
}

function Icon({ className, ...rest }: ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      className={cn("ListIcon", "-ml-0.5 text-[1.32rem]", className)}
      {...rest}
    />
  )
}

function Text({
  className,
  level = "2",
  fullWidth = false,
  maskOverflow = false,
  style,
  align = "left",
  ...rest
}: ComponentProps<typeof ark.p> & {
  level?: "1" | "2" | "3"
  fullWidth?: boolean
  maskOverflow?: boolean
  align?: "left" | "center" | "right"
}) {
  const maskStyles: CSSProperties | undefined = maskOverflow
    ? {
        WebkitMaskImage: `linear-gradient(to ${align === "left" ? "right" : "left"}, black 80%, transparent 100%)`,
        maskImage: `linear-gradient(to ${align === "left" ? "right" : "left"}, black 80%, transparent 100%)`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
      }
    : undefined

  return (
    <ark.p
      className={cn(
        "ListText",
        "-tracking-[0.01em]",
        level === "1" && "font-medium text-label tracking-[0.0125em]",
        level === "2" && "font-medium text-label-secondary tracking-[0.01em]",
        level === "3" && "text-label-tertiary tracking-[0.01em]",
        align === "left" && "text-left",
        align === "center" && "text-center",
        align === "right" && "text-right",
        maskOverflow && "overflow-hidden whitespace-nowrap",
        fullWidth && "w-full max-w-full flex-1",
        className
      )}
      style={{
        ...maskStyles,
        ...style,
      }}
      {...rest}
    />
  )
}

function Heading({
  className,
  srOnly = false,
  ...rest
}: ComponentProps<typeof ark.h4> & { srOnly?: boolean }) {
  return (
    <ark.h4
      className={cn(
        "ListHeading",
        "px-4 pb-1.5 font-medium text-label-secondary text-sm uppercase",
        srOnly && "sr-only",
        className
      )}
      {...rest}
    />
  )
}

function Footer({
  className,
  srOnly = false,
  ...rest
}: ComponentProps<typeof ark.p> & { srOnly?: boolean }) {
  return (
    <ark.p
      className={cn(
        "ListFooter",
        "px-4 pt-1.5 text-label-tertiary text-sm leading-snug tracking-[0.013em]",
        srOnly && "sr-only",
        className
      )}
      {...rest}
    />
  )
}

const List = { Root, Item, Content, Icon, Text, Heading, Footer }

/**
 * @deprecated Use `InsetList` from `@/components/ui/inset-list` instead.
 */
export { List }
