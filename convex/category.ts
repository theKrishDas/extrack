import { ConvexError, v } from "convex/values"
import { colors } from "#lib/constants/colors"
import { transactionTypes } from "#lib/constants/transaction-types"
import { mutation, query } from "./_generated/server"
import { getDoc } from "./lib/doc"
import { getCurrentUserOrThrow } from "./lib/utils"

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx)
    return await ctx.db
      .query("categories")
      .withIndex("by_owner", (q) => q.eq("ownerId", user.ownerId))
      .collect()
  },
})

export const get = query({
  args: { id: v.id("categories") },
  handler: async (ctx, { id }) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_id", (q) => q.eq("_id", id))
      .unique()
  },
})

export const listByType = query({
  args: { type: v.union(...transactionTypes.map((t) => v.literal(t))) },
  handler: async (ctx, { type }) => {
    const user = await getCurrentUserOrThrow(ctx)
    return await ctx.db
      .query("categories")
      .withIndex("by_type_name", (q) =>
        q.eq("ownerId", user.ownerId).eq("type", type)
      )
      .collect()
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    color: v.union(...colors.map((c) => v.literal(c))),
    type: v.union(...transactionTypes.map((t) => v.literal(t))),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, { name, type, color, icon: argIcon }) => {
    const user = await getCurrentUserOrThrow(ctx)
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_type_name", (q) =>
        q.eq("ownerId", user.ownerId).eq("type", type).eq("name", name)
      )
      .unique()

    if (existing) {
      throw new ConvexError({
        code: "CATEGORY_NAME_TAKEN",
        message: `A category with the name "${name}" already exists. Please choose a different name.`,
      })
    }

    const is_vendor = false
    const icon =
      argIcon || type === "expense" ? "ion:arrow-down" : "ion:arrow-up"

    return await ctx.db.insert("categories", {
      ownerId: user.ownerId,
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
    color: v.union(...colors.map((c) => v.literal(c))),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...rest }) => {
    await ctx.db.patch(id, { ...rest })
  },
})

const deleteCategory = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, { id: categoryId }) => {
    const user = await getCurrentUserOrThrow(ctx)
    const category = await getDoc(ctx.db, categoryId).mustBeOwnedBy(
      user.ownerId
    )
    if (category.is_vendor === true) return

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_category", (q) =>
        q.eq("ownerId", user.ownerId).eq("category", categoryId)
      )
      .collect()

    await Promise.all([
      ...transactions.map((txn) => ctx.db.delete(txn._id)),
      ctx.db.delete(categoryId),
    ])
  },
})

// DX alias so clients can call `api.category.delete(...)`
export { deleteCategory as delete }
