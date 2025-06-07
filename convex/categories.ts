import {v} from "convex/values"

import {colors} from "../src/lib/constants/colors"
import {transactionTypes} from "../src/lib/constants/transaction-types"
import {mutation, query} from "./_generated/server"

export const getAll = query({
  args: {},
  handler: async ctx => {
    return await ctx.db.query("categories").collect()
  },
})

export const getById = query({
  args: {id: v.id("categories")},
  handler: async (ctx, {id}) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_id", q => q.eq("_id", id))
      .first()
  },
})

export const getByType = query({
  args: {type: v.union(...transactionTypes.map(t => v.literal(t)))},
  handler: async (ctx, {type}) => {
    return await ctx.db
      .query("categories")
      .filter(q => q.eq(q.field("type"), type))
      .collect()
  },
})

export const add = mutation({
  args: {
    name: v.string(),
    color: v.union(...colors.map(c => v.literal(c))),
    type: v.union(...transactionTypes.map(t => v.literal(t))),
  },
  handler: async (ctx, args) => await ctx.db.insert("categories", args),
})

export const remove = mutation({
  args: {id: v.id("categories")},
  handler: async (ctx, {id}) => await ctx.db.delete(id),
})
