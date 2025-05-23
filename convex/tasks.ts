import { v } from "convex/values"

import { mutation, query } from "./_generated/server"

export const get = query({
  args: {},
  handler: async ctx => {
    const user = await ctx.auth.getUserIdentity()

    if (user === null) return

    const ownerId = user.subject

    const tasks = await ctx.db
      .query("tasks")
      .filter(q => q.eq(q.field("ownerId"), ownerId))
      .order("desc")
      .take(100)

    return tasks
  },
})

export const create = mutation({
  args: {
    text: v.string(),
    isCompleted: v.boolean(),
    category: v.optional(v.id("categories")),
  },
  handler: async (ctx, { text, isCompleted, category }) => {
    const user = await ctx.auth.getUserIdentity()

    if (user === null) return

    const ownerId = user.subject

    const newTaskId = await ctx.db.insert("tasks", {
      ownerId,
      text,
      isCompleted,
      category,
    })
    return newTaskId
  },
})

export const updateTask = mutation({
  args: { id: v.id("tasks"), isCompleted: v.boolean() },
  handler: async (ctx, { id, isCompleted }) => {
    return await ctx.db.patch(id, { isCompleted })
  },
})
