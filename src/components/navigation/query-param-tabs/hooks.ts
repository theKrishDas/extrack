"use client"

import { useSearchParams } from "next/navigation"
import { useMemo } from "react"
import {
  type QueryParamTabValueItem,
  type ResolveQueryParamTabIdOptions,
  type ResolveQueryParamValueOptions,
  resolveQueryParamTabId,
  resolveQueryParamValue,
} from "./helpers"

export function useQueryParamTabSelection(
  param: string,
  items: readonly QueryParamTabValueItem[],
  options?: ResolveQueryParamTabIdOptions
): string {
  const searchParams = useSearchParams()
  return useMemo(
    () => resolveQueryParamTabId(searchParams, param, items, options),
    [searchParams, param, items, options]
  )
}

export function useQueryParamValue<
  TItems extends readonly QueryParamTabValueItem[],
  TFallback extends string,
>(
  param: string,
  items: TItems,
  options: ResolveQueryParamValueOptions<TFallback>
): Exclude<TItems[number]["value"], null> | TFallback {
  const searchParams = useSearchParams()
  return useMemo(
    () => resolveQueryParamValue(searchParams.get(param), items, options),
    [searchParams, param, items, options]
  )
}
