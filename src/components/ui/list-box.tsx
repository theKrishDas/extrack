"use client"

import {ComponentProps} from "react"
import {
  ListBoxItem as ListBoxItemPrimitive,
  ListBox as ListBoxPrimitive,
  type ListBoxItemProps,
  type ListBoxProps,
} from "react-aria-components"

import {cn} from "@/lib/utils"

import {List} from "./list"

type RootProps<T> = ListBoxProps<T> &
  Omit<ComponentProps<typeof ListBoxPrimitive>, keyof ListBoxProps<T>>
function ListBoxRoot<T extends object>({
  className,
  children,
  ...rest
}: RootProps<T>) {
  return (
    <List.Root className={cn("group/itemroot", className)} noSpacing asChild>
      <ListBoxPrimitive {...rest}>{children}</ListBoxPrimitive>
    </List.Root>
  )
}

type ItemProps = ListBoxItemProps &
  Omit<ComponentProps<typeof ListBoxItemPrimitive>, keyof ListBoxItemProps>
function ListBoxItem({className, ...rest}: ItemProps) {
  return (
    <List.Item
      className={cn(
        "group/item data-focus-visible:bg-fill-primary data-focus-visible:[&_.ListContent]:border-fill-opaque [&:has(+_.ListItem[data-focus-visible])_.ListContent]:border-fill-opaque tansition-colors relative duration-130 outline-none",
        "data-disabled:text-label-tertiary data-disabled:opacity-40 data-disabled:[&_.ListContent]:border-none [&:has(+_.ListItem[data-disabled])_.ListContent]:border-none",
        "after:text-ios-blue after:absolute after:top-1/2 after:right-4 after:-translate-y-1/2 after:scale-80 after:text-xl after:opacity-0 after:transition-all after:duration-250 after:content-['􀆅'] data-selected:after:block data-selected:after:scale-100 data-selected:after:opacity-100",
        className
      )}
      asChild
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
export {ListBox}
