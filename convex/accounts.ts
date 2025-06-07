import {v} from "convex/values"

import {transactionTypes} from "../src/lib/constants/transaction-types"
import {internalMutation, mutation} from "./_generated/server"

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
      .first()

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
