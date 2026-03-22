# Query param tabs

Tabs that sync with the URL: each tab is a **link** whose `href` sets (or clears) a single query parameter. Selection is derived from the current search string so the address bar and the highlighted tab always match.

Built with [React Aria Components](https://react-aria.adobe.com/) (`Tabs`, `TabList`, `Tab`, `TabPanel`) and Next.js App Router (`usePathname`, `useSearchParams`). Root layout should wrap the app with React Aria’s [`RouterProvider`](https://react-aria.adobe.com/routing.html) (this project does that in the root provider) so in-app navigation uses the Next.js router.

---

## When to use what

| Piece | Role |
|--------|------|
| [`buildQueryParamHref`](#buildqueryparamhref) | Pure helper: build a URL for “set or remove this query key” while keeping other params. |
| [`resolveQueryParamTabId`](#resolvequeryparamtabid) | Pure helper: map `URLSearchParams` + tab config → which tab `id` is active. |
| [`useQueryParamTabSelection`](#usequeryparamtabselection) | Client hook: `useSearchParams()` + `resolveQueryParamTabId` (memoized). |
| [`QueryParamTabs`](#queryparamtabs) | Client UI: renders tabs + panel; **controlled** via `selectedKey` (see below). |

Selection logic stays **outside** `QueryParamTabs` so the same UI stays reusable and you never pass **functions** from a Server Component into a Client Component (not serializable in the App Router).

---

## `QueryParamTabs`

**Client component** — import from `@/components/navigation/query-param-tabs`.

### Props

- **`param`** — Query key to read/write (e.g. `"type"`).
- **`items`** — Array of `{ id, label, value }`.  
  - `value: string` — tab sets `?param=value`.  
  - `value: null` — tab **removes** that key from the URL (common “All / default” tab).
- **`selectedKey`** — Must equal one of the `id` values; usually from `useQueryParamTabSelection` or `resolveQueryParamTabId`.
- **`children`** — Rendered inside `TabPanel` (your page content for that route state).
- **`aria-label`** — Passed to `TabList` for accessibility.

Tabs use **`next/link`** in the Tab `render` prop so prefetch and client navigation behave like the rest of the app.

### Minimal example (client parent)

```tsx
"use client"

import {
  QueryParamTabs,
  type QueryParamTabItem,
} from "@/components/navigation/query-param-tabs"
import { useQueryParamTabSelection } from "@/hooks/use-query-param-tab-selection"

const ITEMS: QueryParamTabItem[] = [
  { id: "all", label: "All", value: null },
  { id: "a", label: "Option A", value: "a" },
  { id: "b", label: "Option B", value: "b" },
]

export function MyFilterTabs({ children }: { children: React.ReactNode }) {
  const selectedKey = useQueryParamTabSelection("filter", ITEMS)

  return (
    <QueryParamTabs
      aria-label="Filter"
      items={ITEMS}
      param="filter"
      selectedKey={selectedKey}
    >
      {children}
    </QueryParamTabs>
  )
}
```

Wrap the subtree that uses `useSearchParams()` in **`<Suspense>`** when the parent is a Server Component (see [Next.js: `useSearchParams`](https://nextjs.org/docs/app/api-reference/functions/use-search-params)).

---

## Utility functions (`@/lib/query-param-tabs`)

These are **pure** — safe in servers, tests, or client code.

### `buildQueryParamHref`

```ts
function buildQueryParamHref(
  pathname: string,
  searchParams: URLSearchParams,
  param: string,
  value: string | null
): string
```

Clones the current query string, then either **`delete(param)`** when `value === null`** or **`set(param, value)`** otherwise. Returns `pathname` + optional `?…` (no trailing `?` when empty).

Use this when building links that should preserve unrelated query keys (e.g. `?foo=1&filter=a` → change only `filter`).

### `resolveQueryParamTabId`

```ts
function resolveQueryParamTabId(
  searchParams: URLSearchParams,
  param: string,
  items: QueryParamTabValueItem[],
  options?: { defaultAliases?: readonly string[] }
): string
```

Maps the **current** value of `param` to a tab **`id`**:

1. Read `raw = searchParams.get(param)?.trim() ?? ""`.
2. If `raw` is empty **or** equals any **`defaultAliases`** entry → pick the first item with `value: null`, else the first item.
3. Else if some item has `value === raw` → that item’s `id`.
4. Else → same fallback as (2).

`defaultAliases` is for values that should behave like “no filter” (e.g. `["*"]` on the Activity page).

---

## `useQueryParamTabSelection`

**Client-only** — `@/hooks/use-query-param-tab-selection`.

```ts
function useQueryParamTabSelection(
  param: string,
  items: QueryParamTabValueItem[],
  options?: ResolveQueryParamTabIdOptions
): string
```

Calls `useSearchParams()` from `next/navigation` and returns `resolveQueryParamTabId(…)` inside `useMemo`. Pass the same `param` / `items` / `options` you use for data fetching so the list and the tabs stay in sync.

**Stable `options`:** define objects like `{ defaultAliases: ["*"] }` in module scope or `as const` so `useMemo` does not churn every render.

---

## Activity page (`/activity`)

Flow:

1. **`page.tsx` (Server Component)** — Renders layout, `sr-only` title, and a **`<Suspense>`** boundary around the client subtree that reads search params.
2. **`ActivityTransactionTypeTabs`** — Client component that:
   - Defines `ITEMS` (All → `value: null`, Expense / Income → `type=expense|income`).
   - Defines `TYPE_TAB_RESOLVE` with `defaultAliases: ["*"]` so `?type=*` or missing `type` maps to the “All” tab `id`.
   - Calls `selectedKey = useQueryParamTabSelection("type", ITEMS, TYPE_TAB_RESOLVE)`.
   - Renders `<QueryParamTabs param="type" items={ITEMS} selectedKey={selectedKey}>` and passes **`TransactionContainer`** as `children`.
3. **`TransactionContainer`** — Uses `useSearchParams()` + `parseTransactionTypeParam` (see `@/lib/transaction-type-param`) to pass Convex the same filter as the URL.

So: **URL → `useQueryParamTabSelection` → tab highlight**; **URL → `parseTransactionTypeParam` → query args**. Keep those two mappings aligned when you change tab behavior.

---

## Sandbox

`src/app/sandbox/SandboxQueryParamTabs.tsx` is a small demo with `param="number"` and no `defaultAliases`.
