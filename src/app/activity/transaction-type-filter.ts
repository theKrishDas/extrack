import type { QueryParamTabItem } from "@/components/navigation/query-param-tabs"
import { resolveQueryParamValue } from "@/components/navigation/query-param-tabs/helpers"

export const TRANSACTION_TYPE_PARAM = "type" as const

export const TRANSACTION_TYPE_ITEMS = [
  { id: "all", label: "All", value: null },
  { id: "expense", label: "Expense", value: "expense" },
  { id: "income", label: "Income", value: "income" },
] as const satisfies readonly QueryParamTabItem[]

export type TransactionTypeParam =
  | "*"
  | Exclude<(typeof TRANSACTION_TYPE_ITEMS)[number]["value"], null>

export const TRANSACTION_TYPE_TAB_OPTIONS = {
  defaultAliases: ["*"],
} as const

const TRANSACTION_TYPE_PARSE_OPTIONS = {
  defaultAliases: TRANSACTION_TYPE_TAB_OPTIONS.defaultAliases,
  fallback: "*" as const,
}

export const parseTransactionTypeParam = (
  raw: string | null | undefined
): TransactionTypeParam =>
  resolveQueryParamValue(
    raw,
    TRANSACTION_TYPE_ITEMS,
    TRANSACTION_TYPE_PARSE_OPTIONS
  )
