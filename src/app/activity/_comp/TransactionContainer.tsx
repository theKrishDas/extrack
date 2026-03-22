"use client"

import { usePaginatedQuery } from "convex-helpers/react/cache"
import { useSearchParams } from "next/navigation"
import { api } from "#/convex/_generated/api"
import { limit } from "#lib/constants/constraints"
import { Spinner } from "@/components/loading/spinner"
import { parseTransactionTypeParam } from "../transaction-type-param"
import { TransactionList } from "./TransactionList"

export function TransactionContainer() {
  const searchParams = useSearchParams()
  console.clear()
  console.info(
    "%cRAW-param",
    "color: white; background: gray; border-radius: 3px; padding: 2px 3px;",
    searchParams.get("type")
  )
  console.info(
    "%cINFO",
    "color: black; background: #34c759; border-radius: 3px; padding: 2px 3px;",
    parseTransactionTypeParam(searchParams.get("type"))
  )

  const typeParam = parseTransactionTypeParam(searchParams.get("type"))
  const queryArgs = typeParam === "*" ? {} : { type: typeParam }

  const result = usePaginatedQuery(
    api.transaction.listPaginatedDetailed,
    queryArgs,
    { initialNumItems: limit.pagination.transactions.perPage }
  )

  if (result.status === "LoadingFirstPage") return <Spinner />

  return <TransactionList transactions={result} />
}
