"use client"

import { usePathname, useSearchParams } from "next/navigation"
import type { ReactNode } from "react"
import { Link, Tab, TabList, TabPanel, Tabs } from "react-aria-components"
import { cn } from "@/lib/utils"

export type QueryParamTabItem = {
  id: string
  label: string
  /** `null` removes the query param from the URL. */
  value: string | null
}

export type QueryParamTabsProps = {
  param: string
  items: QueryParamTabItem[]
  children: ReactNode
  "aria-label"?: string
  className?: string
  tabListClassName?: string
  tabClassName?: string
  tabPanelClassName?: string
}

/**
 * Maps the current URL to a tab `id` using only `param` + `items` (no function props — safe across RSC boundaries).
 * - Missing, empty, `*`, or unknown values → first item with `value: null` (fallback: first item).
 * - Otherwise → item whose `value` equals the raw query string.
 */
export function resolveQueryParamSelectedKey(
  searchParams: URLSearchParams,
  param: string,
  items: QueryParamTabItem[]
): string {
  const raw = searchParams.get(param)?.trim() ?? ""
  if (raw === "" || raw === "*") {
    return items.find((i) => i.value === null)?.id ?? items[0].id
  }
  const match = items.find((i) => i.value === raw)
  if (match) {
    return match.id
  }
  return items.find((i) => i.value === null)?.id ?? items[0].id
}

export function buildQueryParamHref(
  pathname: string,
  searchParams: URLSearchParams,
  param: string,
  value: string | null
): string {
  const next = new URLSearchParams(searchParams.toString())
  if (value === null) {
    next.delete(param)
  } else {
    next.set(param, value)
  }
  const qs = next.toString()
  return qs ? `${pathname}?${qs}` : pathname
}

export function QueryParamTabs({
  param,
  items,
  children,
  "aria-label": ariaLabel = "Filter",
  className,
  tabListClassName,
  tabClassName,
  tabPanelClassName,
}: QueryParamTabsProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectedKey = resolveQueryParamSelectedKey(searchParams, param, items)

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
