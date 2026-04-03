"use client"

import { QueryParamTabs } from "@/components/navigation/query-param-tabs"
import { useQueryParamTabSelection } from "@/components/navigation/query-param-tabs/hooks"
import {
  TRANSACTION_TYPE_ITEMS,
  TRANSACTION_TYPE_PARAM,
  TRANSACTION_TYPE_TAB_OPTIONS,
} from "../transaction-type-filter"

export function ActivityTransactionTypeTabs() {
  const selectedKey = useQueryParamTabSelection(
    TRANSACTION_TYPE_PARAM,
    TRANSACTION_TYPE_ITEMS,
    TRANSACTION_TYPE_TAB_OPTIONS
  )

  return (
    <QueryParamTabs
      aria-label="Transaction type"
      className="my-4 mb-12"
      items={TRANSACTION_TYPE_ITEMS}
      param={TRANSACTION_TYPE_PARAM}
      selectedKey={selectedKey}
    />
  )
}
