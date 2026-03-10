import { ConvexError, v } from "convex/values"
import {
  ACCOUNT_STARTING_BALANCE_MAX,
  ACCOUNT_STARTING_BALANCE_MIN,
  ACCOUNTS_PER_USER_MAX,
  TRANSACTION_AMOUNT_MAX,
  TRANSACTION_AMOUNT_MIN,
} from "#lib/constants/constraints"
import { transactionTypes } from "#lib/constants/transaction-types"
import { internalMutation, mutation, query } from "./_generated/server"
import { getDoc } from "./lib/doc"
import { getCurrentUserOrThrow } from "./lib/utils"

// Uses take() with the known per-user account cap instead of collect()
// to limit the number of rows read.
export const list = query({
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx)
    return await ctx.db
      .query("accounts")
      .withIndex("by_owner", (q) => q.eq("ownerId", user.ownerId))
      .take(ACCOUNTS_PER_USER_MAX)
  },
})

export const get = query({
  args: { id: v.id("accounts") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id)
  },
})

/**
 * Fetches an account by a raw string ID, without requiring a typed `Id<"accounts">`.
 *
 * Useful when the ID comes from a URL search param or query param, where the value
 * is an untyped string and casting is not desirable.
 *
 * @example
 * ```ts
 * export default function AccountInfo({ id }: { id: string }) {
 *   const account = useQuery(api.account.getByStringId, { id })
 * }
 * ```
 *
 * @param id - The raw string account ID to look up.
 * @returns The account document, or `null` if not found.
 * @throws If the provided string is not a valid `Id<"accounts">`.
 */
export const getByStringId = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const normalizedId = ctx.db.normalizeId("accounts", id)

    if (!normalizedId)
      throw new ConvexError({
        code: "INVALID_ACCOUNT_ID",
        message:
          "Invalid account ID — could not normalize to a valid accounts ID.",
      })

    return await ctx.db.get(normalizedId)
  },
})

/**
 * Creates a new account for the authenticated user.
 *
 * Only name, balance, and icon can be set on creation.
 * Other fields (e.g. default status) are managed separately after creation.
 *
 * @param name - Display name for the account. Must be non-empty after trimming.
 * @param balance - Starting balance. Defaults to `0` if not provided.
 * @param icon - Icon identifier. Defaults to `"material-symbols:wallet"` if not provided.
 * @returns The newly created account ID.
 * @throws If the user has reached the account limit, the name is invalid or duplicate,
 * or the balance is out of the allowed range.
 */
export const create = mutation({
  args: {
    name: v.string(),
    balance: v.optional(v.number()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx)

    const accounts = await ctx.db
      .query("accounts")
      .withIndex("by_owner", (q) => q.eq("ownerId", user.ownerId))
      .take(ACCOUNTS_PER_USER_MAX)

    if (accounts.length >= ACCOUNTS_PER_USER_MAX)
      throw new ConvexError({
        code: "ACCOUNT_LIMIT_REACHED",
        message: `You've reached the maximum number of accounts (${ACCOUNTS_PER_USER_MAX}). Delete one before adding another.`,
        limit: ACCOUNTS_PER_USER_MAX,
      })

    // TODO: validate name using zod (length, characters, etc.)
    const accountName = args.name.trim()

    if (!accountName)
      throw new ConvexError({
        code: "ACCOUNT_NAME_EMPTY",
        message: "Account name cannot be empty.",
      })

    const balance = args.balance ?? 0

    if (
      balance < ACCOUNT_STARTING_BALANCE_MIN ||
      balance > ACCOUNT_STARTING_BALANCE_MAX
    )
      throw new ConvexError({
        code: "INVALID_BALANCE_RANGE",
        message: "Balance is outside the allowed range.",
        min: ACCOUNT_STARTING_BALANCE_MIN,
        max: ACCOUNT_STARTING_BALANCE_MAX,
      })

    // TODO: use better defaults here
    // perhaps use the seed-values
    const icon = args.icon || "material-symbols:wallet"

    const existing = accounts.find((a) => a.name === accountName)

    if (existing)
      throw new ConvexError({
        code: "ACCOUNT_NAME_TAKEN",
        message:
          "An account with this name already exists. Please choose a different name.",
      })

    return await ctx.db.insert("accounts", {
      ownerId: user.ownerId,
      name: accountName,
      startingBalance: balance,
      netFlow: 0,
      is_active: true,
      is_archived: false,
      icon,
    })
  },
})

/**
 * Updates an account's name and icon.
 *
 * Ensures the account exists, belongs to the authenticated user,
 * and that the new name is unique within the same owner scope.
 * Idempotent — returns early if no changes are required.
 *
 * @param id - The account ID to update.
 * @param name - The new account name. Must be non-empty and unique per owner.
 * @param icon - The new icon identifier.
 * @returns The updated account ID.
 * @throws If the account does not exist, does not belong to the authenticated user,
 * the name is empty, or another account with the same name already exists.
 */
export const update = mutation({
  args: {
    id: v.id("accounts"),
    name: v.string(),
    icon: v.string(),
  },
  handler: async (ctx, { id: accountId, name, icon }) => {
    const user = await getCurrentUserOrThrow(ctx)

    const account = await getDoc(ctx.db, accountId).mustBeOwnedBy(user.ownerId)

    // TODO: validate name using zod (length, characters, etc.)
    const accountName = name.trim()

    if (!accountName)
      throw new ConvexError({
        code: "ACCOUNT_NAME_EMPTY",
        message: "Account name cannot be empty.",
      })

    // Already in desired state — no write needed.
    if (account.name === accountName && account.icon === icon) return accountId

    // Only check duplicates if the name actually changes.
    if (account.name !== accountName) {
      const duplicate = await ctx.db
        .query("accounts")
        .withIndex("by_name", (q) =>
          q.eq("ownerId", user.ownerId).eq("name", accountName)
        )
        .unique()

      if (duplicate && duplicate._id !== accountId)
        throw new ConvexError({
          code: "ACCOUNT_NAME_TAKEN",
          message:
            "An account with this name already exists. Please choose a different name.",
        })
    }

    await ctx.db.patch("accounts", accountId, { name: accountName, icon })

    return accountId
  },
})

/**
 * Toggles the active state of an account.
 *
 * Ensures the account exists, belongs to the authenticated user,
 * and prevents deactivation of the default account.
 * Idempotent — returns early if the account is default and already active.
 *
 * @param id - The account ID to toggle.
 * @returns The account ID after the update.
 * @throws If the account does not exist, does not belong to the authenticated user,
 * or an attempt is made to deactivate the default account.
 */
export const toggleActive = mutation({
  args: { id: v.id("accounts") },
  handler: async (ctx, { id: accountId }) => {
    const user = await getCurrentUserOrThrow(ctx)

    const account = await getDoc(ctx.db, accountId).mustBeOwnedBy(user.ownerId)

    const nextState = !account.is_active

    if (user.defaultAccount === account._id && !nextState)
      throw new ConvexError({
        code: "DEFAULT_ACCOUNT_MUST_BE_ACTIVE",
        message: "Default account must remain active.",
      })

    await ctx.db.patch("accounts", accountId, { is_active: nextState })

    return accountId
  },
})

/**
 * Sets the given account as the authenticated user's default account.
 *
 * Idempotent — if the account is already the default, returns early without a write.
 *
 * @param id - The account to set as default.
 * @returns The account ID.
 * @throws If the account is not found or does not belong to the authenticated user.
 */
export const setDefault = mutation({
  args: { id: v.id("accounts") },
  handler: async (ctx, { id: accountId }) => {
    const user = await getCurrentUserOrThrow(ctx)

    if (user.defaultAccount === accountId)
      // Already the default — no write needed.
      return accountId

    const account = await getDoc(ctx.db, accountId).mustBeOwnedBy(user.ownerId)

    if (!account.is_active)
      throw new ConvexError({
        code: "INACTIVE_ACCOUNT_CANNOT_BE_DEFAULT",
        message: "Cannot set an inactive account as default.",
      })

    await ctx.db.patch("user", user._id, { defaultAccount: account._id })

    return accountId
  },
})

/**
 * Internal mutation that adjusts an account's current balance by a transaction amount.
 *
 * Adds the amount for income, subtracts for expenses.
 * Intended to be called by mutations that add, update, or remove a transaction —
 * never called directly by the client.
 *
 * ⚠️ Does not verify account ownership. The calling mutation is responsible
 * for ensuring the authenticated user owns the account before invoking this.
 *
 * @param id - The account whose balance will be adjusted.
 * @param type - The transaction type, determines the direction of the adjustment.
 * @param amount - The absolute transaction amount (always positive).
 * @returns The account ID, previous balance, and updated balance.
 * @throws If the account is not found.
 */
export const applyTransactionFlow = internalMutation({
  args: {
    id: v.id("accounts"),
    type: v.union(...transactionTypes.map((t) => v.literal(t))),
    amount: v.number(),
  },
  handler: async (ctx, { id: accountId, type, amount }) => {
    if (amount < TRANSACTION_AMOUNT_MIN || amount > TRANSACTION_AMOUNT_MAX)
      throw new ConvexError({
        code: "INVALID_TRANSACTION_AMOUNT",
        message: "Amount is outside the allowed range.",
        min: TRANSACTION_AMOUNT_MIN,
        max: TRANSACTION_AMOUNT_MAX,
      })

    const account = await getDoc(ctx.db, accountId).mustExist()

    const previousBalance = account.startingBalance + account.netFlow

    // Apply the amount as positive (income) or negative (expense).
    const direction = type === "expense" ? -1 : 1
    const newNetFlow = account.netFlow + amount * direction
    const newBalance = account.startingBalance + newNetFlow

    await ctx.db.patch("accounts", accountId, { netFlow: newNetFlow })

    return { id: accountId, balance: newBalance, previousBalance }
  },
})

/**
 * Deletes an account and all transactions associated with it.
 *
 * ⚠️ This is a destructive operation — all transactions linked to this account
 * are permanently deleted. In the future, allow users migrating them to another account.
 *
 * The account cannot be deleted if it is set as the user's default account,
 * since the app requires at least one active default account at all times.
 *
 * @param id - The account to delete.
 * @throws If the account is the user's current default account.
 */
const deleteAccount = mutation({
  args: { id: v.id("accounts") },
  handler: async (ctx, { id: accountId }) => {
    const user = await getCurrentUserOrThrow(ctx)

    if (user.defaultAccount === accountId) {
      // The app requires a default account to operate.
      // Blocking deletion here ensures there is always one account
      // and that the default is never left pointing to a deleted account.
      throw new ConvexError({
        code: "DEFAULT_ACCOUNT_DELETE_FORBIDDEN",
        message:
          "Cannot delete the default account. Set another account as default before deleting this one.",
      })
    }

    // Permanently deletes all transactions linked to this account.
    // Future improvement: allow migrating transactions to another account.
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_account", (q) =>
        q.eq("ownerId", user.ownerId).eq("account", accountId)
      )
      .collect()

    await Promise.all([
      ...transactions.map((txn) => ctx.db.delete("transactions", txn._id)),
      ctx.db.delete("accounts", accountId),
    ])
  },
})

/**
 * Updates the starting balance for an account and reconciles the current balance.
 *
 * @param id - The account to update.
 * @param balance - The new starting balance.
 * @returns The updated account ID.
 * @throws If the account is not found or does not belong to the authenticated user.
 */
export const setStartingBalance = mutation({
  args: { id: v.id("accounts"), balance: v.number() },
  handler: async (ctx, { id: accountId, balance: newBalance }) => {
    const user = await getCurrentUserOrThrow(ctx)

    if (
      newBalance < ACCOUNT_STARTING_BALANCE_MIN ||
      newBalance > ACCOUNT_STARTING_BALANCE_MAX
    )
      throw new ConvexError({
        code: "INVALID_BALANCE_RANGE",
        message: "Balance is outside the allowed range.",
        min: ACCOUNT_STARTING_BALANCE_MIN,
        max: ACCOUNT_STARTING_BALANCE_MAX,
      })

    await getDoc(ctx.db, accountId).mustBeOwnedBy(user.ownerId)

    await ctx.db.patch("accounts", accountId, { startingBalance: newBalance })

    return accountId
  },
})

/**
 * Recomputes and syncs the current balance for a given account.
 *
 * Performs a full table scan on transactions — only call this when
 * a full reconciliation is needed (e.g. after a bulk import or data correction).
 *
 * @param ownerId - The owner of the account.
 * @param account - The account ID to reconcile.
 * @returns The starting and newly reconciled current balance.
 * @throws If the account is not found.
 */
export const recomputeNetFlow = internalMutation({
  args: { account: v.id("accounts") },
  handler: async (ctx, { account: accountId }) => {
    const account = await getDoc(ctx.db, accountId).mustExist()

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_account", (q) =>
        q.eq("ownerId", account.ownerId).eq("account", account._id)
      )
      .collect()

    if (!transactions.length) {
      // reset netFlow to 0 if no transaction has been recorded
      const netFlow = 0
      // only patch if netFlow is not already 0
      if (netFlow !== account.netFlow)
        await ctx.db.patch("accounts", account._id, { netFlow })
      return { startingBalance: account.startingBalance, netFlow }
    }

    // Convert each transaction to a signed amount (income positive, expense negative),
    // then sum to get the net change since the starting balance.
    const net = transactions.reduce((sum, t) => {
      const direction = t.type === "expense" ? -1 : 1
      return sum + t.amount * direction
    }, 0)

    await ctx.db.patch("accounts", account._id, { netFlow: net })

    return {
      startingBalance: account.startingBalance,
      netFlow: net,
    }
  },
})

/**
 * Returns the balance for a given account or the combined balance across all accounts of a user.
 *
 * @param account - `"*"` to sum all accounts, or an account ID for a specific one.
 * @returns The balance as a number.
 * @throws If the account is not found or does not belong to the authenticated user.
 */
export const getBalance = query({
  args: { account: v.union(v.literal("*"), v.id("accounts")) },
  handler: async (ctx, { account: accountId }) => {
    const user = await getCurrentUserOrThrow(ctx)

    if (accountId === "*") {
      // Sum balances across all accounts for this user.
      // Uses take() with the known per-user account cap instead of collect()
      // to limit the number of rows read.
      const accounts = await ctx.db
        .query("accounts")
        .withIndex("by_owner", (q) => q.eq("ownerId", user.ownerId))
        .take(ACCOUNTS_PER_USER_MAX)

      if (!accounts.length) {
        console.error(
          JSON.stringify({
            severity: "CRITICAL",
            invariant: "USER_HAS_NO_ACCOUNTS",
            userId: user._id,
            ownerId: user.ownerId,
            message:
              "Invariant violated: user has zero accounts, expected at least 1",
          })
        )
        throw new Error("Internal invariant violated: user has no accounts")
      }

      return accounts.reduce((sum, a) => sum + a.startingBalance + a.netFlow, 0)
    }

    const account = await getDoc(ctx.db, accountId).mustBeOwnedBy(user.ownerId)

    return account.startingBalance + account.netFlow
  },
})

// DX alias so clients can call `api.account.delete(...)`
export { deleteAccount as delete }
