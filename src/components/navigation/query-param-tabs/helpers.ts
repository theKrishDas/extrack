/**
 * URL + selection helpers for query-driven tab bars. Pure functions — safe to use anywhere.
 */

export type QueryParamTabValueItem<
  TId extends string = string,
  TValue extends string | null = string | null,
> = {
  id: TId
  /** `null` means this tab clears the param from the URL. */
  value: TValue
}

export type ResolveQueryParamTabIdOptions = {
  /** Raw param values treated like “unset” (same fallback as empty), e.g. `["*"]` for activity filters. */
  defaultAliases?: readonly string[]
}

export type ResolveQueryParamValueOptions<TFallback extends string> = {
  /** Returned when raw is empty, alias, or unknown. */
  fallback: TFallback
  /** Raw param values treated like “unset” (same fallback), e.g. `["*"]`. */
  defaultAliases?: readonly string[]
}

type NonNullItemValue<TItems extends readonly QueryParamTabValueItem[]> =
  Exclude<TItems[number]["value"], null>

/**
 * Maps `searchParams.get(param)` to a tab `id`.
 * - Empty / missing (after trim), or any `defaultAliases` value → first item with `value: null`, else first item.
 * - Exact match to some `value` → that item’s `id`.
 * - Unknown value → same fallback as empty.
 */
export function resolveQueryParamTabId(
  searchParams: URLSearchParams,
  param: string,
  items: readonly QueryParamTabValueItem[],
  options?: ResolveQueryParamTabIdOptions
): string {
  const aliases = new Set(options?.defaultAliases ?? [])
  const raw = searchParams.get(param)?.trim() ?? ""
  if (raw === "" || aliases.has(raw)) {
    return items.find((i) => i.value === null)?.id ?? items[0].id
  }
  const match = items.find((i) => i.value === raw)
  if (match) {
    return match.id
  }
  return items.find((i) => i.value === null)?.id ?? items[0].id
}

/**
 * Parses a raw query-param value into a typed union inferred from `items`,
 * with a typed fallback for empty/alias/unknown values.
 */
export function resolveQueryParamValue<
  TItems extends readonly QueryParamTabValueItem[],
  TFallback extends string,
>(
  raw: string | null | undefined,
  items: TItems,
  options: ResolveQueryParamValueOptions<TFallback>
): NonNullItemValue<TItems> | TFallback {
  const parsed = raw?.trim() ?? ""
  const aliases = new Set(options.defaultAliases ?? [])
  if (parsed === "" || aliases.has(parsed)) return options.fallback

  for (const item of items) {
    if (item.value !== null && item.value === parsed) {
      return item.value as NonNullItemValue<TItems>
    }
  }

  return options.fallback
}

export function buildQueryParamHref(
  pathname: string,
  searchParams: URLSearchParams,
  param: string,
  value: string | null
): string {
  const next = new URLSearchParams(searchParams.toString())
  if (value === null) {
    next.delete(param)
  } else {
    next.set(param, value)
  }
  const qs = next.toString()
  return qs ? `${pathname}?${qs}` : pathname
}
