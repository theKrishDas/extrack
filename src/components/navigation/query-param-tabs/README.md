# Query param tabs

Tabs that sync with the URL: each tab is a **link** whose `href` sets (or clears) a single query parameter. Selection is derived from the current search string so the address bar and the highlighted tab stay aligned.

Built with [React Aria Components](https://react-aria.adobe.com/) (`Tabs`, `TabList`, `Tab`) and the Next.js App Router (`usePathname`, `useSearchParams`). The root layout should wrap the app with React Aria’s [`RouterProvider`](https://react-aria.adobe.com/routing.html) (this project does that in the root provider) so in-app navigation uses the Next.js router.

---

## Module layout

| Path                         | Purpose                                                                                                                          |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [`index.tsx`](./index.tsx)   | **`QueryParamTabs`** — client UI; uses `next/link` in the Tab `render` prop.                                                     |
| [`helpers.ts`](./helpers.ts) | Pure **`buildQueryParamHref`**, **`resolveQueryParamTabId`**, and shared types. Safe on the server, in tests, or in client code. |
| [`hooks.ts`](./hooks.ts)     | **`useQueryParamTabSelection`** — client hook wrapping `useSearchParams` + `resolveQueryParamTabId`.                             |

Domain-specific rules (which query values mean “all”, how they map to Convex args, etc.) stay **outside** this folder — compose a small feature component that calls the hook and passes `selectedKey` into `QueryParamTabs`.

---

## When to use what

| Piece                                                     | Role                                                                                    |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [`buildQueryParamHref`](#buildqueryparamhref)             | Pure helper: build a URL for “set or remove this query key” while keeping other params. |
| [`resolveQueryParamTabId`](#resolvequeryparamtabid)       | Pure helper: map `URLSearchParams` + tab config → which tab `id` is active.             |
| [`useQueryParamTabSelection`](#usequeryparamtabselection) | Client hook: `useSearchParams()` + `resolveQueryParamTabId` (memoized).                 |
| [`QueryParamTabs`](#queryparamtabs)                       | Client UI: renders a URL-synced tab bar (links) and **does not** render tab-panel content. |

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
- **`children`** — Not rendered by `QueryParamTabs`. This component is intended to be the tab-bar only; render your route-specific content next to it based on the current URL param.
- **`aria-label`** — Passed to `TabList` for accessibility.

Tabs use **`next/link`** in the Tab `render` prop so prefetch and client navigation match the rest of the app.

### Minimal example (client parent)

```tsx
"use client";

import {
  QueryParamTabs,
  type QueryParamTabItem,
} from "@/components/navigation/query-param-tabs";
import { useQueryParamTabSelection } from "@/components/navigation/query-param-tabs/hooks";

const ITEMS: QueryParamTabItem[] = [
  { id: "all", label: "All", value: null },
  { id: "a", label: "Option A", value: "a" },
  { id: "b", label: "Option B", value: "b" },
];

export function MyFilterTabs({ children }: { children: React.ReactNode }) {
  const selectedKey = useQueryParamTabSelection("filter", ITEMS);

  return (
    <>
      <QueryParamTabs
        aria-label="Filter"
        items={ITEMS}
        param="filter"
        selectedKey={selectedKey}
      />
      {children}
    </>
  );
}
```

Wrap the subtree that uses `useSearchParams()` in **`<Suspense>`** when the parent is a Server Component (see [Next.js: `useSearchParams`](https://nextjs.org/docs/app/api-reference/functions/use-search-params)).

---

## Utility functions (`helpers.ts`)

Import from `@/components/navigation/query-param-tabs/helpers`. These are **pure** — safe in Server Components, Route Handlers, tests, or client code.

### `buildQueryParamHref`

```ts
function buildQueryParamHref(
  pathname: string,
  searchParams: URLSearchParams,
  param: string,
  value: string | null,
): string;
```

Clones the current query string, then either **`delete(param)`** when `value === null` or **`set(param, value)`** otherwise. Returns `pathname` + optional `?…` (no trailing `?` when empty).

Use this when building links that should preserve unrelated query keys (e.g. `?foo=1&filter=a` → change only `filter`).

### `resolveQueryParamTabId`

```ts
function resolveQueryParamTabId(
  searchParams: URLSearchParams,
  param: string,
  items: QueryParamTabValueItem[],
  options?: { defaultAliases?: readonly string[] },
): string;
```

Maps the **current** value of `param` to a tab **`id`**:

1. Read `raw = searchParams.get(param)?.trim() ?? ""`.
2. If `raw` is empty **or** equals any **`defaultAliases`** entry → pick the first item with `value: null`, else the first item.
3. Else if some item has `value === raw` → that item’s `id`.
4. Else → same fallback as (2).

`defaultAliases` is for raw URL values that should behave like “no filter” (for example `["*"]` when the logical model allows `*` but you still omit `type` in links for “all”).

---

## `useQueryParamTabSelection`

**Client-only** — `@/components/navigation/query-param-tabs/hooks`.

```ts
function useQueryParamTabSelection(
  param: string,
  items: QueryParamTabValueItem[],
  options?: ResolveQueryParamTabIdOptions,
): string;
```

Calls `useSearchParams()` from `next/navigation` and returns `resolveQueryParamTabId(…)` inside `useMemo`. Pass the same `param` / `items` / `options` you use for data fetching so the list and the tabs stay in sync.

**Stable `options`:** define objects like `{ defaultAliases: ["*"] }` in module scope or `as const` so `useMemo` does not churn every render.

---

## Activity page (`/activity`)

See [`src/app/activity/README.md`](../../../app/activity/README.md) for how **`ActivityTransactionTypeTabs`** composes this module with transaction-type URLs and Convex.

---

## Sandbox

`src/app/sandbox/SandboxQueryParamTabs.tsx` is a small demo with `param="number"` and no `defaultAliases`.
