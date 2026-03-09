import { v } from "convex/values"
import {
  vendorAccounts,
  vendorCategories,
} from "../src/lib/constants/vendor-data"
import { internalMutation } from "./_generated/server"

/**
 * Onboards a new user by creating default accounts and vendor categories.
 *
 * This function is called automatically when a new user is created via Clerk webhook.
 * It creates:
 * - 2 default accounts: "Main" (default) and "Cash"
 * - All vendor expense and income categories
 *
 * The function is idempotent - if the user already has accounts, it skips onboarding.
 */
export const onboardUser = internalMutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    // Check if user already has accounts to prevent duplicate onboarding
    const existingAccount = await ctx.db
      .query("accounts")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .first()

    if (existingAccount) {
      console.log(`User ${userId} already onboarded, skipping`)
      return { success: false, reason: "already_onboarded" }
    }

    console.log(`Starting onboarding for user: ${userId}`)

    // Create accounts from vendor data
    const accountPromises = vendorAccounts.map((account) =>
      ctx.db.insert("accounts", {
        ownerId: userId,
        name: account.name,
        startingBalance: account.startingBalance,
        netFlow: 0,
        is_active: true,
        is_default: account.is_default,
        icon: account.icon,
      })
    )

    // Create categories from vendor data
    const categoryPromises = vendorCategories.map((category) =>
      ctx.db.insert("categories", {
        ownerId: userId,
        name: category.name,
        color: category.color,
        icon: category.icon,
        type: category.type,
        is_vendor: true,
      })
    )

    // Execute all insertions in parallel for better performance
    const [accountIds, categoryIds] = await Promise.all([
      Promise.all(accountPromises),
      Promise.all(categoryPromises),
    ])

    // Find the default account (the "Main" account with is_default: true)
    const defaultAccountIndex = vendorAccounts.findIndex((a) => a.is_default)
    const defaultAccountId = accountIds[defaultAccountIndex]

    // Create user settings with the default account
    if (defaultAccountId) {
      await ctx.db.insert("user", {
        ownerId: userId,
        defaultAccount: defaultAccountId,
      })
    }

    const results = [...accountIds, ...categoryIds]

    console.log(
      `User ${userId} onboarded successfully: ${vendorAccounts.length} accounts, ${vendorCategories.length} categories created`
    )

    return {
      success: true,
      accountsCreated: vendorAccounts.length,
      categoriesCreated: vendorCategories.length,
      totalRecords: results.length,
    }
  },
})
