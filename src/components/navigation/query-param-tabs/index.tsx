"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Tab, TabList, Tabs } from "react-aria-components"
import { cn } from "@/lib/utils"
import { buildQueryParamHref, type QueryParamTabValueItem } from "./helpers"

export type QueryParamTabItem = QueryParamTabValueItem & {
  label: string
}

export type QueryParamTabsProps = {
  param: string
  items: readonly QueryParamTabItem[]
  /** Controlled selection — compute with `resolveQueryParamTabId` / `useQueryParamTabSelection` in the caller. */
  selectedKey: string
  "aria-label"?: string
  className?: string
  tabListClassName?: string
  tabClassName?: string
}

export function QueryParamTabs({
  param,
  items,
  selectedKey,
  "aria-label": ariaLabel = "Filter",
  className,
  tabListClassName,
  tabClassName,
}: QueryParamTabsProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return (
    <Tabs className={cn("flex flex-col", className)} selectedKey={selectedKey}>
      <TabList
        aria-label={ariaLabel}
        className={cn(
          "mx-auto grid h-11 w-full rounded-full bg-fill-tertiary p-1 md:h-10",
          "max-w-62", // max-w-92.5
          tabListClassName
        )}
        style={{
          gridTemplateColumns: `repeat(${items.length}, 1fr)`,
        }}
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
                "react-aria-Tab relative inline-grid h-full w-full cursor-default touch-none select-none place-content-center rounded-full font-medium text-label-primary text-sm focus:outline-none focus-visible:outline-none",
                "outline-ios-blue data-focus-visible:z-1 data-focus-visible:outline-3",
                "data-selected:font-semibold",
                // --- separator ---
                // "first:after:opacity-0 data-selected:after:opacity-0 data-selected:[&+.react-aria-Tab]:after:opacity-0",
                // "after:absolute after:rounded-full after:top-1/2 after:w-0.5 after:h-[75%] after:-translate-y-1/2 after:bg-[#8E8E93]/30 after:content-[''] after:transition-opacity",
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
              style={
                {
                  WebkitUserDrag: "none",
                  userDrag: "none",
                  WebkitTouchCallout: "none",
                } as React.CSSProperties
              }
            >
              {({ isSelected }) => (
                <>
                  {isSelected && <Pill />}

                  <span className="tab-label relative z-2">{item.label}</span>
                </>
              )}
            </Tab>
          )
        })}
      </TabList>
    </Tabs>
  )
}

function Pill() {
  return (
    <motion.span
      aria-hidden="true"
      className={cn(
        "tab-pill absolute inset-0",
        // TODO: extract these color values to variables
        "bg-white dark:bg-[#6C6C71]" // misc-segmented-control
      )}
      layoutId="tab-pill"
      style={{ borderRadius: 9999 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 1,
      }}
    />
  )
}
