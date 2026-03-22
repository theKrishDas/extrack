"use client"

import { useSearchParams } from "next/navigation"
import { useMemo } from "react"
import {
  type QueryParamTabValueItem,
  type ResolveQueryParamTabIdOptions,
  resolveQueryParamTabId,
} from "./helpers"

export function useQueryParamTabSelection(
  param: string,
  items: QueryParamTabValueItem[],
  options?: ResolveQueryParamTabIdOptions
): string {
  const searchParams = useSearchParams()
  return useMemo(
    () => resolveQueryParamTabId(searchParams, param, items, options),
    [searchParams, param, items, options]
  )
}
