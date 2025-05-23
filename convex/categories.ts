import { v } from "convex/values"

import { mutation, query } from "./_generated/server"

export const get = query({
  args: {},
  handler: async ctx => {
    const user = await ctx.auth.getUserIdentity()

    if (user === null) return

    const ownerId = user.subject

    const categories = await ctx.db
      .query("categories")
      .filter(q => q.eq(q.field("ownerId"), ownerId))
      .order("desc")
      .take(10)

    return categories
  },
})

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const user = await ctx.auth.getUserIdentity()

    if (user === null) return

    const ownerId = user.subject

    const newTaskId = await ctx.db.insert("categories", {
      ownerId,
      name,
    })
    return newTaskId
  },
})
