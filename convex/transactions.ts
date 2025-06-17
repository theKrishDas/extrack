import {v} from "convex/values"

import {transactionTypes} from "../src/lib/constants/transaction-types"
import {internal} from "./_generated/api"
import {mutation, query} from "./_generated/server"

export const getAll = query({
  args: {},
  handler: async ctx => {
    return await ctx.db
      .query("transactions")
      .withIndex("by_creation_time")
      .order("desc")
      .collect()
  },
})

export const getLimited = query({
  args: {limit: v.number()},
  handler: async (ctx, {limit}) => {
    return await ctx.db
      .query("transactions")
      .withIndex("by_creation_time")
      .order("desc")
      .take(limit)
  },
})

export const getById = query({
  args: {id: v.id("transactions")},
  handler: async (ctx, {id}) => {
    return await ctx.db
      .query("transactions")
      .withIndex("by_id", q => q.eq("_id", id))
      .unique()
  },
})

export const getByType = query({
  args: {type: v.union(...transactionTypes.map(t => v.literal(t)))},
  handler: async (ctx, {type}) => {
    return await ctx.db
      .query("transactions")
      .filter(q => q.eq(q.field("type"), type))
      .collect()
  },
})

export const add = mutation({
  args: {
    amount: v.number(),
    note: v.optional(v.string()),
    type: v.union(...transactionTypes.map(t => v.literal(t))),
    category: v.id("categories"),
    account: v.id("accounts"),
  },
  handler: async (ctx, args) => {
    const category = await ctx.db.get(args.category)

    if (!category) {
      throw new Error("Category not found for the given ID.")
    }

    if (args.type !== category.type) {
      throw new Error("Type of the transaction and category doesn't match!")
    }

    await Promise.all([
      ctx.db.insert("transactions", args),
      ctx.runMutation(internal.accounts.updateCurrentBalance, {
        id: args.account,
        amount: args.amount,
        type: args.type,
      }),
    ])
  },
})

export const remove = mutation({
  args: {id: v.id("transactions")},
  handler: async (ctx, {id}) => {
    const transaction = await ctx.db.get(id)
    if (!transaction) {
      throw new Error("Transaction not found for the given ID")
    }

    const account = await ctx.db.get(transaction.account)
    if (!account) {
      throw new Error("Account not found for the given ID")
    }

    const {amount, type} = transaction

    await Promise.all([
      ctx.db.delete(id),
      ctx.runMutation(internal.accounts.updateCurrentBalance, {
        id: account._id,
        amount,
        type,
      }),
    ])

    return id
  },
})

export const transactionsBetween = query({
  args: {start: v.number(), end: v.number()},
  handler: async (ctx, {start, end}) => {
    return await ctx.db
      .query("transactions")
      .withIndex("by_creation_time", q =>
        q.gte("_creationTime", start).lte("_creationTime", end)
      )
      .collect()
  },
})
