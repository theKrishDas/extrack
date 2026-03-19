"use client"

import { Tabs } from "@base-ui/react/tabs"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Material } from "@/components/material/material"
import { cn, wait } from "@/lib/utils"

function Root({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [tab, setTab] = useState<string>(pathname)

  return (
    <Tabs.Root
      onValueChange={async (v) => {
        setTab(v)
        await wait(200)
        router.push(v)
      }}
      render={<nav />}
      value={tab}
    >
      <Material
        asChild
        className="inline-flex gap-0.5 rounded-full p-1"
        thickness="thick"
        withBorder
      >
        <Tabs.List>
          {children}
          <Tabs.Indicator className="absolute top-1 left-0 z-[-1] h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) -translate-y-1/2-sm rounded-full bg-background-tertiary/90 transition-all duration-200 ease-in-out dark:bg-fill-secondary" />
        </Tabs.List>
      </Material>
    </Tabs.Root>
  )
}
function Item({
  children,
  href,
  icon,
}: {
  children: React.ReactNode
  href: string

  icon: React.ReactNode
}) {
  return (
    <Tabs.Tab
      className={cn(
        "navigation-button",
        "relative inline-flex h-12.5 w-21 flex-col items-center justify-center rounded-full text-label-primary",
        "outline-0 ring-ios-blue focus-visible:ring-3"
      )}
      value={href}
    >
      <span
        aria-hidden={true}
        className="font-rnx-rounded text-[1.375rem] leading-none"
      >
        {icon}
      </span>
      <span className="font-semibold text-[0.625rem]">{children}</span>
    </Tabs.Tab>
  )
}

/**
 * @deprecated Use `Navigation` from `@/components/navigation` instead.
 */
export const Navigation = { Root, Item }
