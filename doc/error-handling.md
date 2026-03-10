# Error Handling in Convex Functions

This document explains how to properly handle errors in Convex functions using two distinct patterns: `ConvexError` for user-actionable failures and plain `Error` for invariant violations.

## Overview

Errors in Convex functions fall into two categories:

1. **Application Errors (`ConvexError`)** — Expected, user-actionable failures that the user caused and can fix (e.g., validation errors, permission denied, resource not found)
2. **Invariant Violations (plain `Error`)** — Developer/bug signals indicating data is in an impossible state (e.g., user has zero accounts when they should have at least one)

Use the appropriate pattern based on whether the error is something the user can fix or a bug that needs developer attention.

## Application Errors (`ConvexError`)

Use `ConvexError` from `convex/values` for **expected, user-actionable failures** — things the user caused and can fix.

### Pattern

Pass a **simple, flat, user-friendly object**. No nesting, no internal IDs, no wrapper classes:

```typescript
throw new ConvexError({
  code: "ACCOUNT_LIMIT_REACHED",
  message: "You've reached the maximum number of accounts (5). Delete one before adding another.",
  limit: 5,
});
```

```typescript
throw new ConvexError({
  code: "ACCOUNT_NAME_TAKEN",
  message: "An account with this name already exists. Please choose a different name.",
});
```

### Error Codes

Use descriptive, domain-scoped codes in `SCREAMING_SNAKE_CASE` (e.g., `ACCOUNT_LIMIT_REACHED`, `ACCOUNT_NAME_TAKEN`, `CATEGORY_NOT_FOUND`). Be consistent — reuse existing codes for the same failure type rather than inventing variations.

Common codes include:

- `ACCOUNT_LIMIT_REACHED` — User has reached the maximum number of accounts
- `ACCOUNT_NAME_TAKEN` — Account name already exists
- `ACCOUNT_NOT_FOUND` — Account does not exist
- `ACCOUNT_NOT_OWNED` — Account belongs to a different user
- `CATEGORY_NOT_FOUND` — Category does not exist
- `INVALID_BALANCE_RANGE` — Balance is outside allowed range
- `DEFAULT_ACCOUNT_DELETE_FORBIDDEN` — Cannot delete the default account

### Payload Rules

- **Message must be user-friendly and actionable** — it may surface directly in the UI
- **Include only fields the client needs** to render a helpful message (e.g., `limit`, `min`, `max`)
- **Do NOT include** internal IDs, stack traces, `functionName`, `userId`, `ownerId`, or any implementation details
- **Do NOT use `AppError` or any wrapper** — throw `ConvexError` directly
- **Always throw** — never return an error object (throwing ensures transactional rollback)

### Examples

#### Account Limit Reached

```typescript
if (accounts.length >= ACCOUNTS_PER_USER_MAX)
  throw new ConvexError({
    code: "ACCOUNT_LIMIT_REACHED",
    message: "You've reached the maximum number of accounts (5). Delete one before adding another.",
    limit: ACCOUNTS_PER_USER_MAX,
  });
```

#### Account Name Already Exists

```typescript
if (existing)
  throw new ConvexError({
    code: "ACCOUNT_NAME_TAKEN",
    message: "An account with this name already exists. Please choose a different name.",
  });
```

#### Invalid Balance Range

```typescript
if (
  balance < ACCOUNT_STARTING_BALANCE_MIN ||
  balance > ACCOUNT_STARTING_BALANCE_MAX
)
  throw new ConvexError({
    code: "INVALID_BALANCE_RANGE",
    message: "Balance is outside the allowed range.",
    min: ACCOUNT_STARTING_BALANCE_MIN,
    max: ACCOUNT_STARTING_BALANCE_MAX,
  });
```

#### Account Not Found / Permission Denied

These are typically handled by the `getDoc()` helper (see below), but if you need to throw manually:

```typescript
throw new ConvexError({
  code: "ACCOUNT_NOT_FOUND",
  message: "Account not found.",
});
```

```typescript
throw new ConvexError({
  code: "ACCOUNT_NOT_OWNED",
  message: "You don't have permission to access this account.",
});
```

## Invariant Violations (plain `Error`)

Use a plain `Error` for **developer/bug signals** — data that should never be in this state given correct mutations. These are not user errors.

### Invariant Violation Pattern

**Always log a structured JSON payload with `console.error` before throwing:**

```typescript
console.error(
  JSON.stringify({
    severity: "CRITICAL",
    invariant: "USER_HAS_NO_ACCOUNTS",
    userId,
    message: "Invariant violated: user has zero accounts, expected at least 1",
  })
);
throw new Error("Internal invariant violated: user has no accounts");
```

### Logging Rules

- Use `console.error` with structured JSON — this emits at `ERROR` level in the Convex dashboard and log streams
- Log **before** throwing (throwing ends execution)
- Throw a plain `Error`, **not** `ConvexError` — Convex auto-redacts plain errors to `"Server Error"` in production, so no internals leak
- Include `severity`, `invariant` (a stable machine-readable key), relevant IDs, and a `message`
- Do **not** use `ConvexError` here — this is a bug, not a user-actionable error

### Invariant Violation Examples

#### User Has Zero Accounts

This violates the invariant that users should always have at least one account after onboarding:

```typescript
if (!accounts.length) {
  console.error(
    JSON.stringify({
      severity: "CRITICAL",
      invariant: "USER_HAS_NO_ACCOUNTS",
      userId: user._id,
      ownerId: user.ownerId,
      message: "Invariant violated: user has zero accounts, expected at least 1",
    })
  );
  throw new Error("Internal invariant violated: user has no accounts");
}
```

#### User Has No Categories for Transaction Type

This violates the invariant that users should have at least one category of each type:

```typescript
if (!categories.length) {
  console.error(
    JSON.stringify({
      severity: "CRITICAL",
      invariant: "USER_HAS_NO_CATEGORIES_FOR_TYPE",
      userId: user._id,
      ownerId: user.ownerId,
      type,
      message: "Invariant violated: user has zero categories for transaction type, expected at least 1",
    })
  );
  throw new Error("Internal invariant violated: user has no categories for this type");
}
```

#### Document Ownership Mismatch

If you discover a document's `ownerId` doesn't match what it should be (after all guards have passed):

```typescript
if (account.ownerId !== expectedOwnerId) {
  console.error(
    JSON.stringify({
      severity: "CRITICAL",
      invariant: "DOCUMENT_OWNERSHIP_MISMATCH",
      accountId: account._id,
      expectedOwnerId,
      actualOwnerId: account.ownerId,
      message: "Invariant violated: document ownership does not match expected value",
    })
  );
  throw new Error("Internal invariant violated: document ownership mismatch");
}
```

## Catching Errors

When catching errors in Convex functions, use this pattern:

```typescript
try {
  // ... your code ...
} catch (err) {
  if (err instanceof ConvexError) {
    const { code, message } = err.data as { code: string; message: string };
    // Access additional fields as needed (e.g., err.data.limit, err.data.min)
    console.log(code, message);
    // Handle the error appropriately
  }
  // Re-throw or handle other error types
  throw err;
}
```

### Error Data Structure

When catching a `ConvexError`, the data structure is a flat object:

```typescript
{
  code: string;           // e.g., "ACCOUNT_LIMIT_REACHED", "ACCOUNT_NAME_TAKEN"
  message: string;        // User-friendly error message
  // ... additional fields as needed (e.g., limit, min, max)
}
```

Access additional fields directly from `err.data` (e.g., `err.data.limit`, `err.data.min`).

## `getDoc()` Helper

The `getDoc()` helper automatically throws `ConvexError` correctly for document existence and ownership checks:

```typescript
// Check existence only
const account = await getDoc(ctx.db, accountId).mustExist();

// Check existence and ownership
const account = await getDoc(ctx.db, accountId).mustBeOwnedBy(user.ownerId);
```

The `getDoc()` helper throws `ConvexError` with the appropriate error codes (`ACCOUNT_NOT_FOUND`, `ACCOUNT_NOT_OWNED`, etc.), so you don't need to manually handle these cases.

## What Not To Do

### ❌ Don't Return Error Objects

```typescript
// ❌ Don't return errors
if (error) return { error: "Something went wrong" };

// ✅ Always throw
if (error) throw new ConvexError({ code: "ERROR_CODE", message: "Something went wrong" });
```

### ❌ Don't Wrap `ctx.db` Calls in `try/catch`

```typescript
// ❌ Don't do this - Convex handles system-level errors automatically
try {
  await ctx.db.insert("accounts", data);
} catch (err) {
  // Convex handles this
}

// ✅ Just call it directly
await ctx.db.insert("accounts", data);
```

### ❌ Don't Leak Internals in `ConvexError`

```typescript
// ❌ Don't include internal details
throw new ConvexError({
  code: "ACCOUNT_NOT_FOUND",
  message: "Account not found.",
  functionName: "account.update",  // ❌ Internal detail
  userId: user._id,                 // ❌ Internal detail
  ownerId: user.ownerId,            // ❌ Internal detail
  stack: err.stack,                 // ❌ Internal detail
});

// ✅ Only include what the client needs
throw new ConvexError({
  code: "ACCOUNT_NOT_FOUND",
  message: "Account not found.",
});
```

### ❌ Don't Use `ConvexError` for Invariant Violations

```typescript
// ❌ Don't use ConvexError for bugs
if (!accounts.length)
  throw new ConvexError({
    code: "INTERNAL_ERROR",
    message: "User has no accounts",
  });

// ✅ Use plain Error with console.error
if (!accounts.length) {
  console.error(
    JSON.stringify({
      severity: "CRITICAL",
      invariant: "USER_HAS_NO_ACCOUNTS",
      userId: user._id,
      message: "Invariant violated: user has zero accounts, expected at least 1",
    })
  );
  throw new Error("Internal invariant violated: user has no accounts");
}
```

## See Also

- `convex/lib/doc.ts` - `getDoc()` helper implementation
