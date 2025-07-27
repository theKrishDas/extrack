import {v} from "convex/values"

import {colors} from "../src/lib/constants/colors"
import {FAKE_USER_NAME_DO_NOT_PUSH_TO_PRODUCTION} from "../src/lib/constants/fake-username"
import {transactionTypes} from "../src/lib/constants/transaction-types"
import {mutation, query} from "./_generated/server"

export const getAll = query({
  args: {},
  handler: async ctx => {
    return await ctx.db
      .query("categories")
      .withIndex("by_owner", q =>
        q.eq("ownerId", FAKE_USER_NAME_DO_NOT_PUSH_TO_PRODUCTION)
      )
      .collect()
  },
})

export const getById = query({
  args: {id: v.id("categories")},
  handler: async (ctx, {id}) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_id", q => q.eq("_id", id))
      .unique()
  },
})

export const getByType = query({
  args: {type: v.union(...transactionTypes.map(t => v.literal(t)))},
  handler: async (ctx, {type}) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_type", q =>
        q
          .eq("ownerId", FAKE_USER_NAME_DO_NOT_PUSH_TO_PRODUCTION)
          .eq("type", type)
      )
      .collect()
  },
})

export const add = mutation({
  args: {
    name: v.string(),
    color: v.union(...colors.map(c => v.literal(c))),
    type: v.union(...transactionTypes.map(t => v.literal(t))),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, {name, type, color, icon: argIcon}) => {
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_type_name", q =>
        q
          .eq("ownerId", FAKE_USER_NAME_DO_NOT_PUSH_TO_PRODUCTION)
          .eq("type", type)
          .eq("name", name)
      )
      .unique()

    if (existing) {
      throw new Error(`Category with name "${name}" already exists`)
    }

    const ownerId = FAKE_USER_NAME_DO_NOT_PUSH_TO_PRODUCTION
    const is_vendor = false
    const icon =
      argIcon || type === "expense" ? "ion:arrow-down" : "ion:arrow-up"

    return await ctx.db.insert("categories", {
      ownerId,
      color,
      icon,
      is_vendor,
      name,
      type,
    })
  },
})

export const update = mutation({
  args: {
    id: v.id("categories"),
    name: v.string(),
    color: v.union(...colors.map(c => v.literal(c))),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, {id, ...rest}) => {
    await ctx.db.patch(id, {...rest})
  },
})

export const remove = mutation({
  args: {id: v.id("categories")},
  handler: async (ctx, {id: categoryId}) => {
    const category = await ctx.db.get(categoryId)
    if (category?.is_vendor === true) return

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_category", q =>
        q
          .eq("ownerId", FAKE_USER_NAME_DO_NOT_PUSH_TO_PRODUCTION)
          .eq("category", categoryId)
      )
      .collect()

    await Promise.all([
      transactions.forEach(txn => {
        ctx.db.delete(txn._id)
      }),
      ctx.db.delete(categoryId),
    ])
  },
})
