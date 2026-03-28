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
    "gap-3", // px-4 + -ml-1 (leading-content)
    "rounded-none",
    "bg-fill-tertiary",
    "px-4",
    "supports-[corner-shape:squircle]:corner-squircle",
    "[&:not(.InsetListItem~.InsetListItem)]:rounded-t-[1rem] supports-[corner-shape:squircle]:[&:not(.InsetListItem~.InsetListItem)]:rounded-t-[1.625rem]",
    "[&:not(:has(+.InsetListItem))]:rounded-b-[1rem] supports-[corner-shape:squircle]:[&:not(:has(+.InsetListItem))]:rounded-b-[1.625rem]",
    "[&_.InsetListItemContent]:after:border-b-separator-list-color",
    "[&[data-separator='auto']:not(:has(+.InsetListItem))_.InsetListItemContent]:after:border-b-transparent",
    "[&[data-separator='false']_.InsetListItemContent]:after:border-b-transparent",
    "[&[data-separator='true']_.InsetListItemContent]:after:border-b-separator-list-color",
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
  "self-stretch",
  "w-full",
  "min-w-0",
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
  "after:mix-blend-plus-lighter",
  // TODO: Make the cards/items lighter that background
  // TODO: use this blending mode: `"after:mix-blend-plus-darker dark:after:mix-blend-plus-lighter"`
])

const itemMediaVariants = cva(
  [
    "InsetListItemMedia",
    "inline-flex",
    "shrink-0",
    "-ml-1",
    "items-center",
    "justify-center",
    "overflow-hidden",
    "leading-none",
  ],
  {
    variants: {
      size: {
        regular: "",
        tall: "",
      },
      variant: {
        fill: "bg-[image:repeating-conic-gradient(var(--fill-secondary)_0%_25%,transparent_0%_50%)] bg-[length:8px_8px] text-label-primary",
        rounded:
          "supports-[corner-shape:squircle]:corner-squircle rounded-lg bg-fill-secondary text-label-primary",
        symbol: "h-5 w-7",
      },
    },
    compoundVariants: [
      {
        size: "tall",
        variant: "rounded",
        className:
          "size-11 rounded-xl supports-[corner-shape:squircle]:rounded-2xl",
      },
      {
        size: "regular",
        variant: "rounded",
        className:
          "size-7.5 rounded-lg supports-[corner-shape:squircle]:rounded-xl",
      },
      {
        size: "regular",
        variant: "fill",
        className: "size-13",
      },
      {
        size: "tall",
        variant: "fill",
        className: "size-17",
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
}: SlottableProps<"header"> & { visuallyHidden?: boolean }) => {
  const Comp = asChild ? Slot : "header"

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
}: ComponentPropsWithoutRef<"span">) => {
  return (
    <span
      className={cn(
        "InsetListSectionTitle font-semibold text-base text-label-secondary",
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
        "InsetListSectionDescription text-label-secondary text-sm leading-snug tracking-[0.015em]",
        className
      )}
      {...rest}
    />
  )
}

const Section = ({
  className,
  asChild = false,
  ...rest
}: SlottableProps<"section">) => {
  const Comp = asChild ? Slot : "section"
  return <Comp className={cn("InsetListSection", className)} {...rest} />
}

const Item = ({
  className,
  asChild = false,
  align,
  showSeparator,
  ...rest
}: SlottableProps<"div"> & {
  align?: "center" | "end" | "start"
  showSeparator?: boolean
}) => {
  const Comp = asChild ? Slot : "div"
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
        "InsetListItemBody flex w-full min-w-0 flex-1 flex-col justify-center gap-0.5 py-3",
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
        "InsetListItemTitle font-medium text-base text-label-primary leading-tight tracking-[0.01em]",
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
        "InsetListItemSubtitle text-[0.9rem] text-label-secondary/80 leading-tight tracking-[0.01em]",
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
