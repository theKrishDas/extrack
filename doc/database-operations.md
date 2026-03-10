# Database Operations in Convex Functions

This document explains the rules and best practices for database operations in Convex functions.

## Typed Database Operations

All `ctx.db.patch()` and `ctx.db.delete()` calls **must** include the table name as the first argument. This ensures type safety and prevents accidental operations on the wrong table.

### Required Pattern

**Always use:**

```typescript
// ✅ Correct - includes table name
await ctx.db.patch("accounts", accountId, { name: "New Name" })
await ctx.db.delete("accounts", accountId)
```

**Never use:**

```typescript
// ❌ Incorrect - missing table name
await ctx.db.patch(accountId, { name: "New Name" })
await ctx.db.delete(accountId)
```

### Why This Rule Exists

1. **Type Safety**: Including the table name enables TypeScript to validate that the ID matches the table type
2. **Code Clarity**: Makes it immediately clear which table is being modified
3. **Error Prevention**: Reduces the risk of accidentally operating on the wrong table
4. **Consistency**: Ensures all database operations follow the same pattern

### Examples

#### Updating an Account

```typescript
export const update = mutation({
  args: {
    id: v.id("accounts"),
    name: v.string(),
  },
  handler: async (ctx, { id, name }) => {
    // ✅ Correct
    await ctx.db.patch("accounts", id, { name })
    
    // ❌ Incorrect
    // await ctx.db.patch(id, { name })
  },
})
```

#### Deleting a Transaction

```typescript
export const deleteTransaction = mutation({
  args: { id: v.id("transactions") },
  handler: async (ctx, { id }) => {
    // ✅ Correct
    await ctx.db.delete("transactions", id)
    
    // ❌ Incorrect
    // await ctx.db.delete(id)
  },
})
```

#### Batch Operations

```typescript
// ✅ Correct - all operations include table names
await Promise.all([
  ...transactions.map((txn) => ctx.db.delete("transactions", txn._id)),
  ctx.db.delete("accounts", accountId),
])

// ❌ Incorrect - missing table names
// await Promise.all([
//   ...transactions.map((txn) => ctx.db.delete(txn._id)),
//   ctx.db.delete(accountId),
// ])
```

#### Updating User Document

```typescript
// ✅ Correct
await ctx.db.patch("user", user._id, { defaultAccount: accountId })

// ❌ Incorrect
// await ctx.db.patch(user._id, { defaultAccount: accountId })
```

### Table Names Reference

Common table names used in this codebase:

- `"accounts"` - Account documents
- `"categories"` - Category documents
- `"transactions"` - Transaction documents
- `"user"` - User documents

Refer to `convex/schema.ts` for the complete list of tables and their definitions.

### Migration Notes

When migrating existing code:

1. Find all `ctx.db.patch(id, ...)` calls and add the table name as the first argument
2. Find all `ctx.db.delete(id)` calls and add the table name as the first argument
3. Ensure the table name matches the type of the ID being used
4. Update test files to match the new pattern

### See Also

- `convex/schema.ts` - Table definitions and schema
- [Convex Database Documentation](https://docs.convex.dev/database) - Official Convex database API reference
