import { v } from "convex/values"

import { mutation, query } from "./_generated/server"

export const get = query({
  args: {},
  handler: async ctx => {
    return await ctx.db.query("tasks").collect()
  },
})

export const create = mutation({
  args: { text: v.string(), isCompleted: v.boolean() },
  handler: async (ctx, { text, isCompleted }) => {
    const newTaskId = await ctx.db.insert("tasks", { text, isCompleted })
    return newTaskId
  },
})

export const updateTask = mutation({
  args: { id: v.id("tasks"), isCompleted: v.boolean() },
  handler: async (ctx, { id, isCompleted }) => {
    return await ctx.db.patch(id, { isCompleted })
  },
})
