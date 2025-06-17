import {v} from "convex/values"

import {transactionTypes} from "../src/lib/constants/transaction-types"
import {internalMutation, mutation, query} from "./_generated/server"

export const getAll = query({
  args: {},
  handler: async ctx => {
    return await ctx.db.query("accounts").collect()
  },
})

export const getById = query({
  args: {id: v.id("accounts")},
  handler: async (ctx, {id}) => {
    return await ctx.db
      .query("accounts")
      .withIndex("by_id", q => q.eq("_id", id))
      .unique()
  },
})

export const add = mutation({
  args: {
    name: v.string(),
    balance: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const name = args.name
    const balance = args.balance || 0
    const is_active = true

    const existing = await ctx.db
      .query("accounts")
      .withIndex("by_name", q => q.eq("name", name))
      .unique()

    if (existing) {
      throw new Error(`Account with name "${args.name}" already exists`)
    }

    return await ctx.db.insert("accounts", {
      name,
      startingBalance: balance,
      currentBalance: balance,
      is_active,
    })
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

export const updateCurrentBalance = internalMutation({
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
  handler: async (ctx, {id}) => await ctx.db.delete(id),
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
