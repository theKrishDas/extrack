import {v} from "convex/values"

import {FAKE_USER_NAME_DO_NOT_PUSH_TO_PRODUCTION} from "../src/lib/constants/fake-username"
import {transactionTypes} from "../src/lib/constants/transaction-types"
import {internalMutation, mutation, query} from "./_generated/server"

export const getAll = query({
  args: {},
  handler: async ctx => {
    return await ctx.db
      .query("accounts")
      .withIndex("by_owner", q =>
        q.eq("ownerId", FAKE_USER_NAME_DO_NOT_PUSH_TO_PRODUCTION)
      )
      .collect()
  },
})

export const getById = query({
  args: {id: v.id("accounts")},
  handler: async (ctx, {id}) => {
    return await ctx.db.get(id)
  },
})

export const getByStringId = query({
  args: {id: v.string()},
  handler: async (ctx, args) => {
    const normalizedId = ctx.db.normalizeId("accounts", args.id)
    if (!normalizedId) return null
    return await ctx.db.get(normalizedId)
  },
})

export const add = mutation({
  args: {
    name: v.string(),
    balance: v.optional(v.number()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    /**
     * Changed through user settings
     */
    const name = args.name
    const balance = args.balance || 0
    const is_active = true
    const is_default = false
    const icon = args.icon || "material-symbols:wallet"

    const existing = await ctx.db
      .query("accounts")
      .withIndex("by_name", q =>
        q
          .eq("ownerId", FAKE_USER_NAME_DO_NOT_PUSH_TO_PRODUCTION)
          .eq("name", name)
      )
      .unique()

    if (existing) {
      throw new Error(`Account with name "${args.name}" already exists`)
    }

    return await ctx.db.insert("accounts", {
      ownerId: FAKE_USER_NAME_DO_NOT_PUSH_TO_PRODUCTION,
      name,
      startingBalance: balance,
      currentBalance: balance,
      is_active,
      icon,
      is_default,
    })
  },
})

export const update = mutation({
  args: {id: v.id("accounts"), name: v.string(), icon: v.string()},
  handler: async (ctx, {id, ...rest}) => {
    await ctx.db.patch(id, {...rest})
  },
})

export const toggleActive = mutation({
  args: {id: v.id("accounts")},
  handler: async (ctx, {id}) => {
    const existing = await ctx.db.get(id)
    if (!existing) {
      throw new Error("Account doesn't exists")
    }

    await ctx.db.patch(id, {is_active: !existing.is_active})
    return id
  },
})

export const applyTransaction = internalMutation({
  args: {
    id: v.id("accounts"),
    type: v.union(...transactionTypes.map(t => v.literal(t))),
    amount: v.number(),
  },
  handler: async (ctx, {id, type, amount}) => {
    const existing = await ctx.db.get(id)
    if (!existing) {
      throw new Error("Account doesn't exists")
    }

    const {currentBalance: prevBalance} = existing
    const dir = type === "expense" ? -1 : 1
    const newBalance = prevBalance + amount * dir

    await ctx.db.patch(id, {currentBalance: newBalance})
    return {id, currrentBalance: newBalance}
  },
})

export const remove = mutation({
  args: {id: v.id("accounts")},
  handler: async (ctx, {id: accountId}) => {
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_account", q =>
        q
          .eq("ownerId", FAKE_USER_NAME_DO_NOT_PUSH_TO_PRODUCTION)
          .eq("account", accountId)
      )
      .collect()

    await Promise.all([
      transactions.forEach(txn => {
        ctx.db.delete(txn._id)
      }),
      ctx.db.delete(accountId),
    ])
  },
})

/*
 * Expensive querry don't run very often!
 */
export const syncBalance = internalMutation({
  args: {
    ownerId: v.string(),
    account: v.id("accounts"),
  },
  handler: async (ctx, {ownerId, account: accountId}) => {
    const account = await ctx.db.get(accountId)

    if (!account) throw new Error("Account with the given Id does not exist!")

    // Full table scan of transactions
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_account", q =>
        q.eq("ownerId", ownerId).eq("account", account._id)
      )
      .collect()

    const net = transactions
      .map(t => t.amount * (t.type === "expense" ? -1 : 1))
      .reduce((acc, v) => acc + v, 0)

    const newBalance = account.startingBalance + net

    await ctx.db.patch(account._id, {currentBalance: newBalance})

    return {
      startingBalance: account.startingBalance,
      currentBalance: newBalance,
    }
  },
})

/*
 * Balance Querries
 */
export const getBalance = query({
  args: {account: v.union(v.literal("all"), v.id("accounts"))},
  handler: async (ctx, {account}) => {
    if (account === "all") {
      const accounts = await ctx.db.query("accounts").collect()
      const balance = accounts.reduce((acc, v) => acc + v.currentBalance, 0)
      return balance
    }

    const relevantAccount = await ctx.db
      .query("accounts")
      .withIndex("by_id", q => q.eq("_id", account))
      .unique()

    if (!relevantAccount)
      throw new Error("Account with the given Id does not exist!")

    const balance = relevantAccount.currentBalance
    return balance
  },
})
