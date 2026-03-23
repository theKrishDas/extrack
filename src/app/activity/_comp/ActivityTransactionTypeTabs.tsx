"use client"

import {
  type QueryParamTabItem,
  QueryParamTabs,
} from "@/components/navigation/query-param-tabs"
import { useQueryParamTabSelection } from "@/components/navigation/query-param-tabs/hooks"

const ITEMS: QueryParamTabItem[] = [
  { id: "all", label: "All", value: null },
  { id: "expense", label: "Expense", value: "expense" },
  { id: "income", label: "Income", value: "income" },
]

const TYPE_TAB_RESOLVE: { defaultAliases: readonly string[] } = {
  defaultAliases: ["*"],
}

export function ActivityTransactionTypeTabs() {
  const selectedKey = useQueryParamTabSelection("type", ITEMS, TYPE_TAB_RESOLVE)

  return (
    <QueryParamTabs
      aria-label="Transaction type"
      className="my-4 mb-12"
      items={ITEMS}
      param="type"
      selectedKey={selectedKey}
    />
  )
}
