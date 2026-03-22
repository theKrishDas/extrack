"use client"

import type { ReactNode } from "react"
import {
  type QueryParamTabItem,
  QueryParamTabs,
} from "@/components/navigation/query-param-tabs"
import { useQueryParamTabSelection } from "@/hooks/use-query-param-tab-selection"

const ITEMS: QueryParamTabItem[] = [
  { id: "all", label: "All", value: null },
  { id: "expense", label: "Expense", value: "expense" },
  { id: "income", label: "Income", value: "income" },
]

const TYPE_TAB_RESOLVE: { defaultAliases: readonly string[] } = {
  defaultAliases: ["*"],
}

export function ActivityTransactionTypeTabs({
  children,
}: {
  children: ReactNode
}) {
  const selectedKey = useQueryParamTabSelection("type", ITEMS, TYPE_TAB_RESOLVE)

  return (
    <QueryParamTabs
      aria-label="Transaction type"
      className="mt-4 mb-4.5"
      items={ITEMS}
      param="type"
      selectedKey={selectedKey}
    >
      {children}
    </QueryParamTabs>
  )
}
