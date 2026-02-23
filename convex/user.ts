import { v } from "convex/values"

import { mutation, query } from "./_generated/server"
import { getCurrentUserOrThrow } from "./utils"

/**
 * Get user settings for the authenticated user.
 * Returns null if no settings record exists.
 */
export const get = query({
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx)
    return user
  },
})

/**
 * Get the default account for the authenticated user.
 * Returns the full account object, or null if no settings exist.
 */
export const getDefaultAccount = query({
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx)

    return await ctx.db.get(user.defaultAccount)
  },
})

/**
 * Initialize user settings with a default account.
 * This should only be called during onboarding.
 */
export const initialize = mutation({
  args: { accountId: v.id("accounts") },
  handler: async (ctx, { accountId }) => {
    const user = await getCurrentUserOrThrow(ctx)

    // Validate that the account exists and belongs to the user
    const account = await ctx.db.get(accountId)
    if (!account) {
      throw new Error("Account does not exist")
    }
    if (account.ownerId !== user.ownerId) {
      throw new Error("Account does not belong to this user")
    }

    // User settings already exist (getCurrentUserOrThrow ensures this)
    throw new Error("User settings already exist")
  },
})

/**
 * Update the default account for the authenticated user.
 */
export const setDefaultAccount = mutation({
  args: { accountId: v.id("accounts") },
  handler: async (ctx, { accountId }) => {
    const user = await getCurrentUserOrThrow(ctx)

    // Validate that the account exists and belongs to the user
    const account = await ctx.db.get(accountId)
    if (!account) {
      throw new Error("Account does not exist")
    }
    if (account.ownerId !== user.ownerId) {
      throw new Error("Account does not belong to this user")
    }

    await ctx.db.patch(user._id, { defaultAccount: accountId })
    return user._id
  },
})
