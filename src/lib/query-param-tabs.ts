/**
 * URL + selection helpers for query-driven tab bars. Pure functions — safe to use anywhere.
 */

export type QueryParamTabValueItem = {
  id: string
  /** `null` means this tab clears the param from the URL. */
  value: string | null
}

export type ResolveQueryParamTabIdOptions = {
  /** Raw param values treated like “unset” (same fallback as empty), e.g. `["*"]` for activity filters. */
  defaultAliases?: readonly string[]
}

/**
 * Maps `searchParams.get(param)` to a tab `id`.
 * - Empty / missing (after trim), or any `defaultAliases` value → first item with `value: null`, else first item.
 * - Exact match to some `value` → that item’s `id`.
 * - Unknown value → same fallback as empty.
 */
export function resolveQueryParamTabId(
  searchParams: URLSearchParams,
  param: string,
  items: QueryParamTabValueItem[],
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
