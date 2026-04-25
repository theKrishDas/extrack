import { ConvexError, v } from "convex/values"
import { vendorAccounts, vendorCategories } from "#lib/seed"
import { internalMutation } from "./_generated/server"
import { log } from "./lib/utils"

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
    // Check if user already exists to prevent duplicate onboarding
    const existingUser = await ctx.db
      .query("user")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .first()

    if (existingUser) {
      log(`User ${userId} already onboarded, skipping onboarding`)
      return { success: false, reason: "already_onboarded" }
    }

    log(`Starting onboarding for user: ${userId}`)

    // Create accounts from vendor data
    const accountPromises = vendorAccounts.map((account) =>
      ctx.db.insert("accounts", {
        ownerId: userId,
        name: account.name,
        startingBalance: account.startingBalance,
        netFlow: 0,
        is_active: true,
        is_archived: false,
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

    // Set the first seeded account as default.
    const defaultAccountId = accountIds.at(0)
    if (!defaultAccountId) {
      const expectedDefaultAccountName =
        vendorAccounts.at(0)?.name ?? "the first vendor account"

      throw new ConvexError(
        `User onboarding failed for "${userId}": no default account was created. Check the vendor account seed data and ensure "${expectedDefaultAccountName}" is present.`
      )
    }

    // Create user settings with the default account
    await ctx.db.insert("user", {
      ownerId: userId,
      defaultAccount: defaultAccountId,
    })

    const results = [...accountIds, ...categoryIds]

    log(
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
