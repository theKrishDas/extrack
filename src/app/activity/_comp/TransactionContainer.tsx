"use client"

import { usePaginatedQuery } from "convex-helpers/react/cache"
import { useSearchParams } from "next/navigation"
import { api } from "#/convex/_generated/api"
import { limit } from "#lib/constants/constraints"
import { Spinner } from "@/components/loading/spinner"
import {
  parseTransactionTypeParam,
  TRANSACTION_TYPE_PARAM,
} from "../transaction-type-filter"
import { TransactionList } from "./TransactionList"

export function TransactionContainer() {
  const searchParams = useSearchParams()

  const typeParam = parseTransactionTypeParam(
    searchParams.get(TRANSACTION_TYPE_PARAM)
  )
  const queryArgs = typeParam === "*" ? {} : { type: typeParam }

  const result = usePaginatedQuery(
    api.transaction.listPaginatedDetailed,
    queryArgs,
    { initialNumItems: limit.pagination.transactions.perPage }
  )

  if (result.status === "LoadingFirstPage") return <Spinner />

  return <TransactionList transactions={result} />
}
