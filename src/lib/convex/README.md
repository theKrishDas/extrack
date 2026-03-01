# Convex Utilities for Next.js + Clerk

Shared helpers for authenticated server-side preloading and reactive client-side context with Convex.

## Files

```
src/lib/convex/
├── server.ts   # Server-side: getAuthToken, preloadAuthQuery
└── context.ts  # Client-side: createPreloadedQueryContext
```

## Usage

### 1. Create a context for your query

```ts
// app/accounts/context.ts
"use client";

import type { api } from "#/convex/_generated/api";
import { createPreloadedQueryContext } from "@/lib/convex/context";

export const { Provider: AccountsProvider, useData: useAccounts } =
  createPreloadedQueryContext<typeof api.accounts.getAll>();
```

### 2. Preload data in a Server Component

```tsx
// app/accounts/page.tsx
import { preloadAuthQuery } from "@/lib/convex/server";
import { api } from "#/convex/_generated/api";
import { AccountsProvider } from "./context";
import { AccountsList } from "./AccountsList";

export default async function Page() {
  const preloaded = await preloadAuthQuery(api.accounts.getAll);

  return (
    <AccountsProvider preloaded={preloaded}>
      <AccountsList />
    </AccountsProvider>
  );
}
```

### 3. Consume in a Client Component

```tsx
// app/accounts/AccountsList.tsx
"use client";

import { useAccounts } from "./context";

export function AccountsList() {
  const accounts = useAccounts();
  return (
    <ul>
      {accounts.map((a) => (
        <li key={a._id}>{a.name}</li>
      ))}
    </ul>
  );
}
```

## How it works

`preloadAuthQuery` runs on the server, fetches the Clerk auth token, and calls Convex's `preloadQuery` with it. The result is passed to a Provider, which hydrates the client with `usePreloadedQuery` — giving you an instant render with server data that stays live via Convex's WebSocket subscription.

## Known Limitations

These are current gaps in the Convex API, not bugs in these utilities.

**No `skip` for `usePreloadedQuery`** — Unlike `useQuery`, you can't pause the live subscription. The Convex team is aware but hasn't addressed it yet.

**Stale snapshot on mount** — Consumers briefly see the server-side snapshot before the live subscription syncs. Fine for most cases, but noticeable if data changes rapidly.

**Token refresh flashes** — When Clerk refreshes the auth token (typically every 5–60 min), the Convex WebSocket briefly re-authenticates. This can cause a transient unauthenticated state that isn't fully guarded against.

**`useEffect` workarounds aren't first-class** — If you need to hold preloaded results across navigation, the `isLoading + useState + useEffect` pattern works but is an acknowledged workaround. The Convex team has flagged it as a known API design gap.

> Security is not affected by any of the above — auth is always enforced inside Convex query functions via `ctx.auth.getUserIdentity()`.
