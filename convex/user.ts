import { v } from "convex/values"

import { mutation, query } from "./_generated/server"
import { getAuthenticatedUserId } from "./utils"

/**
 * Get user settings for the authenticated user.
 * Returns null if no settings record exists.
 */
export const get = query({
  handler: async (ctx) => {
    const ownerId = await getAuthenticatedUserId(ctx)
    return await ctx.db
      .query("user")
      .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
      .unique()
  },
})

/**
 * Get the default account for the authenticated user.
 * Returns the full account object, or null if no settings exist.
 */
export const getDefaultAccount = query({
  handler: async (ctx) => {
    const ownerId = await getAuthenticatedUserId(ctx)
    const userSettings = await ctx.db
      .query("user")
      .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
      .unique()

    if (!userSettings) return null

    return await ctx.db.get(userSettings.defaultAccount)
  },
})

/**
 * Initialize user settings with a default account.
 * This should only be called during onboarding.
 */
export const initialize = mutation({
  args: { accountId: v.id("accounts") },
  handler: async (ctx, { accountId }) => {
    const ownerId = await getAuthenticatedUserId(ctx)

    // Validate that the account exists and belongs to the user
    const account = await ctx.db.get(accountId)
    if (!account) {
      throw new Error("Account does not exist")
    }
    if (account.ownerId !== ownerId) {
      throw new Error("Account does not belong to this user")
    }

    // Check if user settings already exist
    const existing = await ctx.db
      .query("user")
      .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
      .unique()

    if (existing) {
      throw new Error("User settings already exist")
    }

    return await ctx.db.insert("user", {
      ownerId,
      defaultAccount: accountId,
    })
  },
})

/**
 * Update the default account for the authenticated user.
 */
export const setDefaultAccount = mutation({
  args: { accountId: v.id("accounts") },
  handler: async (ctx, { accountId }) => {
    const ownerId = await getAuthenticatedUserId(ctx)

    // Validate that the account exists and belongs to the user
    const account = await ctx.db.get(accountId)
    if (!account) {
      throw new Error("Account does not exist")
    }
    if (account.ownerId !== ownerId) {
      throw new Error("Account does not belong to this user")
    }

    // Get user settings
    const userSettings = await ctx.db
      .query("user")
      .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
      .unique()

    if (!userSettings) {
      throw new Error("User settings not found. Please contact support.")
    }

    await ctx.db.patch(userSettings._id, { defaultAccount: accountId })
    return userSettings._id
  },
})
