import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import {
  Children,
  type ComponentPropsWithoutRef,
  isValidElement,
  type JSX,
  type ReactNode,
} from "react"

import { cn } from "@/lib/utils"

type SlottableProps<T extends keyof JSX.IntrinsicElements> =
  ComponentPropsWithoutRef<T> & {
    asChild?: boolean
  }

const itemVariants = cva(
  [
    "InsetListItem",
    "group/item",
    "relative",
    "flex",
    "w-full",
    "gap-3",
    "bg-fill-opaque",
    "px-4",
    "first:rounded-t-[1.625rem]",
    "last:rounded-b-[1.625rem]",
    "after:pointer-events-none after:absolute after:right-4 after:bottom-0 after:left-[calc(theme(spacing.4)+theme(spacing.7)+theme(spacing.3))] after:border-separator-non-opaque after:border-b after:content-['']",
    "[&[data-separator='auto']:last-child]:after:border-b-transparent",
    "[&[data-separator='false']]:after:border-b-transparent",
    "[&[data-separator='true']]:after:border-b-separator-non-opaque",
    "[&[data-separator='true']:last-child]:after:border-b-separator-non-opaque",
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

const partitionSectionChildren = (children: ReactNode) => {
  const headerChildren: ReactNode[] = []
  const footerChildren: ReactNode[] = []
  const itemChildren: ReactNode[] = []

  for (const child of Children.toArray(children)) {
    if (
      isValidElement(child) &&
      (child.type === SectionHeader || child.type === SectionFooter)
    ) {
      if (child.type === SectionHeader) {
        headerChildren.push(child)
        continue
      }

      footerChildren.push(child)
      continue
    }

    itemChildren.push(child)
  }

  return { footerChildren, headerChildren, itemChildren }
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

  const { footerChildren, headerChildren, itemChildren } =
    partitionSectionChildren(children)

  return (
    <section className={cn("InsetListSection", className)} {...rest}>
      {headerChildren}
      <ul className="InsetListSectionItems rounded-[1.625rem] bg-fill-tertiary">
        {itemChildren}
      </ul>
      {footerChildren}
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

const ItemBody = ({ className, ...rest }: ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      className={cn(
        "InsetListItemBody flex min-h-13 w-full flex-1 flex-col justify-center gap-0.5 py-3",
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
  ItemBody,
  ItemTitle,
  ItemSubtitle,
  ItemTrailing,
  ItemMedia,
}

export { InsetList }
