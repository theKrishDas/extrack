"use client"

import type { ComponentProps } from "react"
import {
  ListBoxItem as ListBoxItemPrimitive,
  type ListBoxItemProps,
  ListBox as ListBoxPrimitive,
  type ListBoxProps,
} from "react-aria-components"

import { cn } from "@/lib/utils"

import { List } from "./list"

type RootProps<T> = ListBoxProps<T> &
  Omit<ComponentProps<typeof ListBoxPrimitive>, keyof ListBoxProps<T>>
function ListBoxRoot<T extends object>({
  className,
  children,
  ...rest
}: RootProps<T>) {
  return (
    <List.Root asChild className={cn("group/itemroot", className)} noSpacing>
      <ListBoxPrimitive {...rest}>{children}</ListBoxPrimitive>
    </List.Root>
  )
}

type ItemProps = ListBoxItemProps &
  Omit<ComponentProps<typeof ListBoxItemPrimitive>, keyof ListBoxItemProps>
function ListBoxItem({ className, ...rest }: ItemProps) {
  return (
    <List.Item
      asChild
      className={cn(
        "group/item tansition-colors relative outline-none duration-130 data-focus-visible:bg-fill-primary [&:has(+_.ListItem[data-focus-visible])_.ListContent]:border-fill-opaque data-focus-visible:[&_.ListContent]:border-fill-opaque",
        "data-disabled:text-label-tertiary data-disabled:opacity-40 [&:has(+_.ListItem[data-disabled])_.ListContent]:border-none data-disabled:[&_.ListContent]:border-none",
        "after:absolute after:top-1/2 after:right-4 after:-translate-y-1/2 after:scale-80 after:text-ios-blue after:text-xl after:opacity-0 after:transition-all after:duration-250 after:content-['􀆅'] data-selected:after:block data-selected:after:scale-100 data-selected:after:opacity-100",
        className
      )}
    >
      <ListBoxItemPrimitive {...rest} />
    </List.Item>
  )
}

const ListBox = {
  Root: ListBoxRoot,
  Item: ListBoxItem,
  Content: List.Content,
  Icon: List.Icon,
  Text: List.Text,
}
export { ListBox }
