## Migration approach

### Pre-conditions

- `migration_*` tables already populated in Convex via `psql` import.
- Migrating users are guaranteed un-onboarded in v1 at migration time.
- Same Clerk app — no new webhook fires for existing users. Migration manually triggers onboarding.
- Migration is driven per user from `migration_preference`, which is the authoritative user list for iteration.
- The migration entrypoint is a single per-user Convex mutation.

---

### Per-user mutation order

Atomicity guarantee:

- All migration work for one user happens in one Convex mutation.
- Any throw rolls back the entire user migration — including onboarding writes. A failed user leaves no partial state and is safe to retry.
- Failure for one user does not affect other users.

Input contract:

- A user must have a `migration_preference` row to be migrated.
- A user with categories but no `migration_preference` row is invalid and must fail migration.
- A user with transactions but no `migration_preference` row is invalid and must fail migration.

Idempotency:

- If a `user` table entry already exists for the given `ownerId`, the migration returns early and does nothing.
- Re-running the migration for an already-migrated user is a no-op.

1. **Onboard** — creates `user` entry, vendor accounts, vendor categories, default account. Invariant: if onboarding fails, entire user migration fails. No partial state.
   - The seeded default account is used as the migration target account.
   - If a user has no categories and no transactions, onboarding still happens.

2. **Migrate categories** (`migration_category` → `categories`)
   - Throw error if owner is not onboarded.
   - Match on `type + trimmed name` using case-insensitive comparison against existing rows (vendor + any prior user categories).
   - Matching is only for lookup/deduplication. Stored category names remain case-sensitive and preserve the existing matched row's name, or the inserted row's original casing.
   - Category names must be unique per user and type under `trim() + caseInsensitive()` matching.
   - Duplicate legacy category IDs for the same user must fail migration.
   - Duplicate legacy category names for the same user and type must fail migration.
   - Hit → reuse existing `_id`, no insert. Write `pg_id = migration_category.id` onto the matched row regardless of `is_vendor`.
   - Miss → insert with fixed default `color` (hardcoded constant object) and `icon` (free string default) with `pg_id = migration_category.id`.
   - `is_vendor: false` for all newly inserted migrated categories.
   - If any `migration_transax` row for this user has no category, ensure an "Uncategorized" category exists per affected `type` — reuse if name+type match exists, else insert. A user may require two "Uncategorized" categories — one for `"income"` and one for `"expense"` — if null-category transactions of both types exist.
   - A legacy category row whose `name.trim()` is empty is treated as a missing category.
   - Missing category is defined as `null`, `undefined`, or `""` only.
   - Build a `pg_id → convex _id` map for transaction migration.

3. **Migrate transactions** (`migration_transax` → `transactions`)
   - `type` sourced from `isExpense`, not amount sign.
   - `amount = Math.abs(amount)`. Skip (silently drop) if `0`.
   - `date = new Date(dateString).getTime()` — invalid date throws, fails user migration.
   - `account` = default account id from step 1.
   - `category` = resolved category `_id` from step 2 map.
   - Duplicate legacy transaction IDs for the same user must fail migration.
   - If a transaction references a category id that does not exist for that user, fail migration.
   - If a transaction references a category row whose type conflicts with the transaction type, fail migration.
   - Uncategorized transactions must resolve to the ensured `"Uncategorized"` category for that transaction type.

4. **Patch default account balances**
   - `startingBalance = migration_preference.initial_balance`.
   - `startingBalance` may be negative.
   - `netFlow = sum(income amounts) - sum(expense amounts)` across migrated transactions.
   - Other seeded accounts remain untouched.

---

### Invariants / failure modes

- Any throw in the mutation = full rollback for that user. Safe to retry.
- Invalid date → explicit throw.
- Onboarding failure → explicit throw (invariant violation).
- Missing `migration_preference` for a user being migrated → explicit throw.
- Duplicate legacy transaction id for the same user → explicit throw.
- Duplicate legacy category id for the same user → explicit throw.
- Duplicate legacy category name for the same user and type under `trim() + caseInsensitive()` matching → explicit throw.
- Empty legacy category name after `trim()` → explicit throw.
- Category reference missing or type-mismatched for a transaction → explicit throw.
- Migration is idempotent — re-running a fully migrated user is a no-op (early return).

---

### Post-migration validation

Before dropping legacy tables, two signals must both pass:

**Completion signal** — via `@convex-dev/migrations` state:

- Total users in `migration_preference` = successfully migrated count.
- Zero failed users.

**Correctness signal** — a dedicated validation query checks per user:

- Every `migration_preference` userId has a corresponding `user` entry.
- Every `migration_transax` row with a non-zero amount has a corresponding `transactions` row matched by `legacyId`. Zero-amount rows are excluded from this count comparison.
- Every migrated transaction's `account` points to a valid, active account.
- Every migrated transaction's `category` has a matching `type`.
- `accounts.netFlow` for each user's default account matches the sum of their migrated transactions.

Only when both signals pass is it safe to drop `migration_*` tables and remove `legacyId` from the `transactions` schema. Both steps are performed manually outside of Convex.
