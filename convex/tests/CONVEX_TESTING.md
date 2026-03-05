# Convex Testing Guide

A deterministic reference for writing unit tests for this Convex backend. Follow every rule here exactly — no deviations.

---

## Stack

- **Test runner:** Vitest
- **Convex test utility:** `convex-test`
- **Auth provider:** Clerk (`@clerk/nextjs`)

---

## Directory Structure

All test files live under `convex/tests/`, one subdirectory per feature/table, one file per function.

```
convex/tests/
├── helpers.ts
├── accounts/
│   ├── toggle-active.test.ts
│   ├── get.test.ts
│   ├── add.test.ts
│   └── remove.test.ts
├── categories/
│   ├── add.test.ts
│   └── remove.test.ts
├── transactions/
│   ├── add.test.ts
│   └── remove.test.ts
└── users/
    └── onboard.test.ts
```

**Rules:**

- One test file per Convex function, named after it in kebab-case (e.g. `toggleActive` → `toggle-active.test.ts`).
- Max one level of nesting inside `convex/tests/` (e.g. `convex/tests/accounts/add.test.ts` ✅, `convex/tests/accounts/nested/add.test.ts` ❌).
- Never place test files outside `convex/tests/`.

---

## Standard Imports

Every test file starts with this import block (adjust paths based on nesting depth):

```typescript
import { convexTest, type TestConvex } from "convex-test";
import { describe, expect, test } from "vitest";
import { ConvexError } from "convex/values";
import { api, internal } from "../../_generated/api";
import schema from "../../schema";
```

---

## Identities

Define typed identity constants at the top of each test file using the Clerk identity shape. Use `as const`.

```typescript
const userIdentity = {
  subject: "user_clerk_123",
  issuer: "https://clerk.dev",
  tokenIdentifier: "test_token_123",
} as const;

const otherUserIdentity = {
  subject: "user_clerk_456",
  issuer: "https://clerk.dev",
  tokenIdentifier: "test_token_456",
} as const;
```

Create an authenticated accessor with:

```typescript
const asUser = t.withIdentity(userIdentity);
```

---

## User Onboarding

**Every authenticated test must call `internal.users.onboard` before any mutation or query.**

`internal.users.onboard` sets up the `user` table entry, seed accounts, and categories. Without it, any function that calls `getCurrentUserOrThrow` will throw `USER_NOT_STORED`.

```typescript
const t = convexTest(schema);
const asUser = t.withIdentity(userIdentity);

// Required before any authenticated operation
await asUser.mutation(internal.users.onboard, { userId: userIdentity.subject });

// Now safe to call authenticated mutations/queries
await asUser.mutation(api.accounts.add, { name: "My Wallet" });
```

**Unauthenticated tests skip both `t.withIdentity()` and `internal.users.onboard`:**

```typescript
const t = convexTest(schema);
// No identity, no onboarding — intentionally testing the unauthenticated path
await expect(async () => {
  await t.mutation(api.accounts.toggleActive, { id: accountId });
}).rejects.toThrowError("UNAUTHENTICATED");
```

---

## Getting Valid Document IDs

**Never typecast fake strings as IDs.** Convex's schema validator rejects them before your handler runs.

```typescript
// ❌ Never do this
{
  id: "accounts:fakeid" as any;
}
```

### Option 1 — Reuse an ID returned by a prior mutation

```typescript
const accountId = await asUser.mutation(api.accounts.add, {
  name: "My Wallet",
});
```

### Option 2 — Insert via `t.run`

Use when you need to bypass business logic (e.g. for ownership or auth tests).

```typescript
const accountId = await t.run((ctx) =>
  ctx.db.insert("accounts", {
    ownerId: userIdentity.subject,
    is_active: true,
    is_default: false,
    name: "Test Account",
    // ...other required fields
  }),
);
```

### Option 3 — Insert-then-delete for a non-existent ID

Use when testing "document not found" error paths.

```typescript
const deletedId = await t.run(async (ctx) => {
  const id = await ctx.db.insert("accounts", {
    ownerId: userIdentity.subject,
    is_active: true,
    is_default: false,
    name: "Temp",
    // ...other required fields
  });
  await ctx.db.delete(id);
  return id;
});
```

---

## Asserting Thrown Errors

Always wrap the call in `async () => { ... }` before passing to `.rejects`.

```typescript
// ✅ Correct
await expect(async () => {
  await t.mutation(api.accounts.toggleActive, { id: accountId });
}).rejects.toThrowError("UNAUTHENTICATED");

// Also valid when asserting ConvexError instance
const mutation = asUser.mutation(api.accounts.add, { name: "My Wallet" });
await expect(mutation).rejects.toBeInstanceOf(ConvexError);
await expect(mutation).rejects.toThrowError(
  "An account with this name already exists.",
);
```

---

## No Non-Null Assertions

**Never use `!` to access values that could be `null` or `undefined`.** Guard with explicit `if` checks and throw descriptive errors.

```typescript
// ❌ Never do this
return user!.defaultAccount!;

// ✅ Always do this
const user = await ctx.db
  .query("user")
  .withIndex("by_owner", (q) => q.eq("ownerId", userIdentity.subject))
  .unique();

if (!user)
  throw new Error(`User not found for subject: ${userIdentity.subject}`);

if (!user.defaultAccount) throw new Error("User has no defaultAccountId");

return user.defaultAccount;
```

This applies everywhere: inside `t.run(...)`, seed helpers, and test setup.

---

## Test File Structure

Organize each test file with `describe` blocks in this order:

1. `auth` — unauthenticated and un-onboarded cases
2. `<entity> existence` — missing/deleted document cases
3. `ownership` — cross-user access cases
4. feature-specific constraint groups (e.g. `default account protection`)
5. `<function> logic` — happy path and behavioral cases
6. `isolation` — mutations don't affect other users' data

```typescript
describe("accounts.toggleActive", () => {
  describe("auth", () => { ... })
  describe("account existence", () => { ... })
  describe("ownership", () => { ... })
  describe("default account protection", () => { ... })
  describe("toggle logic", () => { ... })
  describe("isolation", () => { ... })
})
```

---

## Seed Helpers

Define seed helpers as plain functions (not `beforeEach`) at the top of the test file, below the identity constants. Use `TestConvex<typeof schema>` for the type.

```typescript
function seedAccount(
  t: TestConvex<typeof schema>,
  opts: {
    ownerId?: string;
    is_active?: boolean;
  } = {},
) {
  return t.run((ctx) =>
    ctx.db.insert("accounts", {
      ownerId: opts.ownerId ?? userIdentity.subject,
      is_active: opts.is_active ?? true,
      is_default: false,
      name: "Test Account",
      // ...other required schema fields
    }),
  );
}
```

**Rules for seed helpers:**

- Always default `ownerId` to `userIdentity.subject`.
- Only expose fields that vary between tests as options; hardcode everything else.
- Never set `is_default: true` in a generic seed helper — test default account behavior by reading `user.defaultAccount` after onboarding.

## Shared Helpers

Common seed helpers are available in `convex/tests/helpers.ts`. Import from there instead of redefining locally.

```typescript
import {
  seedAccount,
  seedCategory,
  seedTransaction,
  getDeletedAccountId,
} from "../helpers";
```

Available helpers:

- `seedAccount(t, opts?)` — inserts an account row, defaults `ownerId` to `userIdentity.subject`
- `seedCategory(t, opts?)` — inserts a category row, defaults `type` to `"expense"`
- `seedTransaction(t, opts)` — inserts a transaction row; requires `accountId` and `categoryId`
- `getDeletedAccountId(t)` — inserts then deletes an account, returns the now-invalid ID for "not found" tests

**Rules:**

- Never redefine a helper that already exists in `helpers.ts`.
- Only define a local seed helper if it has test-file-specific shape or logic not covered by the shared helpers.
- `getDeletedAccountId` in `helpers.ts` defaults `ownerId` to `userIdentity.subject` — if you need a deleted ID for a different owner, define it locally.

---

## Complete Example

```typescript
import { convexTest, type TestConvex } from "convex-test";
import { describe, expect, test } from "vitest";
import { api, internal } from "../../_generated/api";
import schema from "../../schema";

const userIdentity = {
  subject: "user_clerk_123",
  issuer: "https://clerk.dev",
  tokenIdentifier: "test_token_123",
} as const;

const otherUserIdentity = {
  subject: "user_clerk_456",
  issuer: "https://clerk.dev",
  tokenIdentifier: "test_token_456",
} as const;

function seedAccount(
  t: TestConvex<typeof schema>,
  opts: { ownerId?: string; is_active?: boolean } = {},
) {
  return t.run((ctx) =>
    ctx.db.insert("accounts", {
      ownerId: opts.ownerId ?? userIdentity.subject,
      is_active: opts.is_active ?? true,
      is_default: false,
      name: "Test Account",
      startingBalance: 0,
      currentBalance: 0,
      icon: "X",
    }),
  );
}

function getDeletedAccountId(t: TestConvex<typeof schema>, ownerId: string) {
  return t.run(async (ctx) => {
    const id = await ctx.db.insert("accounts", {
      ownerId,
      is_active: true,
      is_default: false,
      name: "Temp",
      startingBalance: 0,
      currentBalance: 0,
      icon: "X",
    });
    await ctx.db.delete(id);
    return id;
  });
}

describe("accounts.toggleActive", () => {
  describe("auth", () => {
    test("throws UNAUTHENTICATED when called without a Clerk identity", async () => {
      const t = convexTest(schema);
      const accountId = await seedAccount(t);

      await expect(
        t.mutation(api.accounts.toggleActive, { id: accountId }),
      ).rejects.toThrowError("UNAUTHENTICATED");
    });

    test("throws USER_NOT_STORED when identity exists but user was never onboarded", async () => {
      const t = convexTest(schema);
      const accountId = await seedAccount(t);

      await expect(
        t.withIdentity(userIdentity).mutation(api.accounts.toggleActive, {
          id: accountId,
        }),
      ).rejects.toThrowError("USER_NOT_STORED");
    });
  });

  describe("account existence", () => {
    test("throws when account id does not exist", async () => {
      const t = convexTest(schema);
      const asUser = t.withIdentity(userIdentity);
      await asUser.mutation(internal.users.onboard, {
        userId: userIdentity.subject,
      });

      const deletedId = await getDeletedAccountId(t, userIdentity.subject);

      await expect(
        asUser.mutation(api.accounts.toggleActive, { id: deletedId }),
      ).rejects.toThrowError("Account not found.");
    });
  });

  describe("ownership", () => {
    test("throws when account belongs to a different user", async () => {
      const t = convexTest(schema);
      await t.withIdentity(userIdentity).mutation(internal.users.onboard, {
        userId: userIdentity.subject,
      });
      await t.withIdentity(otherUserIdentity).mutation(internal.users.onboard, {
        userId: otherUserIdentity.subject,
      });

      const otherAccountId = await seedAccount(t, {
        ownerId: otherUserIdentity.subject,
      });

      await expect(
        t.withIdentity(userIdentity).mutation(api.accounts.toggleActive, {
          id: otherAccountId,
        }),
      ).rejects.toThrowError(
        "Account does not belong to the authenticated user.",
      );
    });
  });

  describe("toggle logic", () => {
    test("deactivates an active account", async () => {
      const t = convexTest(schema);
      const asUser = t.withIdentity(userIdentity);
      await asUser.mutation(internal.users.onboard, {
        userId: userIdentity.subject,
      });

      const accountId = await seedAccount(t, { is_active: true });
      const result = await asUser.mutation(api.accounts.toggleActive, {
        id: accountId,
      });

      expect(result).toBe(accountId);
      const updated = await t.run((ctx) => ctx.db.get(accountId));
      expect(updated?.is_active).toBe(false);
    });
  });
});
```
