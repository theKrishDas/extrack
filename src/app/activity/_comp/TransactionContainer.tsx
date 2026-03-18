"use client"

import { usePaginatedQuery } from "convex-helpers/react/cache"
import { api } from "#/convex/_generated/api"
import { limit } from "#lib/constants/constraints"
import { Spinner } from "@/components/loading/spinner"
import { TransactionList } from "./TransactionList"

export function TransactionContainer() {
  const result = usePaginatedQuery(
    api.transaction.listPaginatedDetailed,
    {},
    { initialNumItems: limit.pagination.transactions.perPage }
  )

  if (result.status === "LoadingFirstPage") return <Spinner />

  return <TransactionList transactions={result} />
}
