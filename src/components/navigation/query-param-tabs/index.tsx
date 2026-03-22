"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import type { ReactNode } from "react"
import { Tab, TabList, TabPanel, Tabs } from "react-aria-components"
import { cn } from "@/lib/utils"
import { buildQueryParamHref, type QueryParamTabValueItem } from "./helpers"

export type QueryParamTabItem = QueryParamTabValueItem & {
  label: string
}

export type QueryParamTabsProps = {
  param: string
  items: QueryParamTabItem[]
  /** Controlled selection — compute with `resolveQueryParamTabId` / `useQueryParamTabSelection` in the caller. */
  selectedKey: string
  children?: ReactNode
  "aria-label"?: string
  className?: string
  tabListClassName?: string
  tabClassName?: string
  tabPanelClassName?: string
}

export function QueryParamTabs({
  param,
  items,
  selectedKey,
  children,
  "aria-label": ariaLabel = "Filter",
  className,
  tabListClassName,
  tabClassName,
  tabPanelClassName,
}: QueryParamTabsProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return (
    <Tabs className={cn("flex flex-col", className)} selectedKey={selectedKey}>
      <TabList
        aria-label={ariaLabel}
        className={cn(
          "flex gap-1 rounded-xl bg-fill-quaternary/80 p-1",
          tabListClassName
        )}
      >
        {items.map((item) => {
          const href = buildQueryParamHref(
            pathname,
            searchParams,
            param,
            item.value
          )
          return (
            <Tab
              className={cn(
                "rounded-lg px-3 py-1.5 font-medium text-sm outline-none transition-colors",
                "data-selected:bg-fill-tertiary data-selected:text-label-primary",
                "data-hovered:bg-fill-tertiary/60 data-hovered:text-label-primary",
                "data-pressed:bg-fill-secondary",
                "text-label-secondary",
                tabClassName
              )}
              href={href}
              id={item.id}
              key={item.id}
              render={(domProps) =>
                "href" in domProps ? (
                  <Link {...domProps} />
                ) : (
                  <div {...domProps} />
                )
              }
            >
              {item.label}
            </Tab>
          )
        })}
      </TabList>
      <TabPanel
        className={cn("flex min-h-0 flex-1 flex-col", tabPanelClassName)}
        id={selectedKey}
      >
        {children}
      </TabPanel>
    </Tabs>
  )
}
