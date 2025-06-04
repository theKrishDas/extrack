import {v} from "convex/values"

import {mutation, query} from "./_generated/server"

export const get = query({
  args: {},
  handler: async ctx => {
    return await ctx.db.query("transactions").collect()
  },
})

export const addTransaction = mutation({
  args: {
    amount: v.number(),
    note: v.optional(v.string()),
    type: v.union(v.literal("expense"), v.literal("income")),
  },
  handler: async (ctx, args) => {
    const newTransactionId = await ctx.db.insert("transactions", args)
    return newTransactionId
  },
})

export const remove = mutation({
  args: {id: v.id("transactions")},
  handler: async (ctx, {id}) => {
    return await ctx.db.delete(id)
  },
})
