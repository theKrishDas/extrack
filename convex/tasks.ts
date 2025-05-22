import { query } from "./_generated/server"

export const get = query({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity()
    if (identity === null) {
      return "NO USER"
    }
    return identity

    return await ctx.db.query("tasks").collect()
  },
})
