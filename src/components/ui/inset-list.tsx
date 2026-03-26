import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import type { ComponentPropsWithoutRef, JSX } from "react"

import { cn } from "@/lib/utils"

type SlottableProps<T extends keyof JSX.IntrinsicElements> =
  ComponentPropsWithoutRef<T> & {
    asChild?: boolean
  }

const itemVariants = cva(
  [
    "InsetListItem",
    "flex",
    "w-full",
    "gap-3",
    "rounded-none",
    "bg-fill-tertiary",
    "px-4",
    "[&:not(.InsetListItem~.InsetListItem)]:rounded-t-[1.625rem]",
    "[&:not(:has(+.InsetListItem))]:rounded-b-[1.625rem]",
    "[&_.InsetListItemContent]:after:border-b-separator-non-opaque",
    "[&[data-separator='auto']:not(:has(+.InsetListItem))_.InsetListItemContent]:after:border-b-transparent",
    "[&[data-separator='false']_.InsetListItemContent]:after:border-b-transparent",
    "[&[data-separator='true']_.InsetListItemContent]:after:border-b-separator-non-opaque",
    "[&[data-separator='true']:not(:has(+.InsetListItem))_.InsetListItemContent]:after:border-b-transparent",
  ],
  {
    variants: {
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
      },
    },
    defaultVariants: {
      align: "center",
    },
  }
)

const itemContentVariants = cva([
  "InsetListItemContent",
  "relative",
  "flex",
  "min-h-13",
  "w-full",
  "flex-1",
  "items-stretch",
  "gap-2",
  "after:pointer-events-none",
  "after:absolute",
  "after:right-0",
  "after:bottom-0",
  "after:translate-y-1/2",
  "after:left-0",
  "after:border-b-transparent",
  "after:border-b",
  "after:content-['']",
])

const itemMediaVariants = cva(
  [
    "InsetListItemMedia",
    "inline-flex",
    "shrink-0",
    "items-center",
    "justify-center",
    "overflow-hidden",
  ],
  {
    variants: {
      size: {
        regular: "size-7",
        tall: "h-12 w-9",
      },
      variant: {
        fill: "bg-fill-secondary text-label-primary",
        rounded: "rounded-[0.7rem] bg-fill-secondary text-label-primary",
        symbol: "text-label-secondary",
      },
    },
    compoundVariants: [
      {
        size: "tall",
        variant: "rounded",
        className: "rounded-[0.9rem]",
      },
    ],
    defaultVariants: {
      size: "regular",
      variant: "fill",
    },
  }
)

const Root = ({
  className,
  asChild = false,
  ...rest
}: SlottableProps<"div">) => {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      className={cn("InsetListRoot flex flex-col gap-0.5", className)}
      {...rest}
    />
  )
}

const SectionHeader = ({
  className,
  asChild = false,
  visuallyHidden = false,
  ...rest
}: SlottableProps<"div"> & { visuallyHidden?: boolean }) => {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      className={cn(
        "InsetListSectionHeader w-full px-4 pt-6 pb-1.5",
        visuallyHidden && "sr-only",
        className
      )}
      {...rest}
    />
  )
}

const SectionFooter = ({
  className,
  asChild = false,
  ...rest
}: SlottableProps<"div">) => {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      className={cn(
        "InsetListSectionFooter w-full px-4 pt-1.5 pb-10",
        className
      )}
      {...rest}
    />
  )
}

const SectionTitle = ({
  className,
  ...rest
}: ComponentPropsWithoutRef<"h4">) => {
  return (
    <h4
      className={cn(
        "InsetListSectionTitle font-medium text-label-secondary text-sm uppercase",
        className
      )}
      {...rest}
    />
  )
}

const SectionDescription = ({
  className,
  ...rest
}: ComponentPropsWithoutRef<"p">) => {
  return (
    <p
      className={cn(
        "InsetListSectionDescription text-label-tertiary text-sm leading-snug tracking-[0.015em]",
        className
      )}
      {...rest}
    />
  )
}

const Section = ({
  children,
  className,
  asChild = false,
  ...rest
}: SlottableProps<"section">) => {
  if (asChild) {
    return (
      <Slot className={cn("InsetListSection", className)} {...rest}>
        {children}
      </Slot>
    )
  }

  return (
    <section className={cn("InsetListSection", className)} {...rest}>
      <ul className="InsetListSectionItems">{children}</ul>
    </section>
  )
}

const Item = ({
  className,
  asChild = false,
  align,
  showSeparator,
  ...rest
}: SlottableProps<"li"> & {
  align?: "center" | "end" | "start"
  showSeparator?: boolean
}) => {
  const Comp = asChild ? Slot : "li"
  const separatorState =
    showSeparator === undefined ? "auto" : `${showSeparator}`

  return (
    <Comp
      className={cn(itemVariants({ align }), className)}
      data-separator={separatorState}
      {...rest}
    />
  )
}

const ItemLeading = ({
  className,
  ...rest
}: ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      className={cn(
        "InsetListItemLeading inline-flex min-h-13 shrink-0 items-center justify-center",
        className
      )}
      {...rest}
    />
  )
}

const ItemContent = ({
  className,
  ...rest
}: ComponentPropsWithoutRef<"div">) => {
  return <div className={cn(itemContentVariants(), className)} {...rest} />
}

const ItemBody = ({ className, ...rest }: ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      className={cn(
        "InsetListItemBody flex w-full flex-1 flex-col justify-center gap-0.5 py-3",
        className
      )}
      {...rest}
    />
  )
}

const ItemTitle = ({ className, ...rest }: ComponentPropsWithoutRef<"p">) => {
  return (
    <p
      className={cn(
        "InsetListItemTitle font-semibold text-base text-label-primary tracking-[0.01em]",
        className
      )}
      {...rest}
    />
  )
}

const ItemSubtitle = ({
  className,
  ...rest
}: ComponentPropsWithoutRef<"p">) => {
  return (
    <p
      className={cn(
        "InsetListItemSubtitle font-medium text-label-secondary tracking-[0.01em]",
        className
      )}
      {...rest}
    />
  )
}

const ItemTrailing = ({
  className,
  ...rest
}: ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      className={cn(
        "InsetListItemTrailing inline-flex min-h-13 shrink-0 items-center justify-end gap-2 self-stretch",
        className
      )}
      {...rest}
    />
  )
}

const ItemMedia = ({
  className,
  size,
  variant,
  ...rest
}: ComponentPropsWithoutRef<"div"> & {
  size?: "regular" | "tall"
  variant?: "fill" | "rounded" | "symbol"
}) => {
  return (
    <div
      className={cn(itemMediaVariants({ className, size, variant }))}
      {...rest}
    />
  )
}

const InsetList = {
  Root,
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionFooter,
  Item,
  ItemLeading,
  ItemContent,
  ItemBody,
  ItemTitle,
  ItemSubtitle,
  ItemTrailing,
  ItemMedia,
}

export { InsetList }
