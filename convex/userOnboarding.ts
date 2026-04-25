import { ConvexError, v } from "convex/values"
import { vendorAccounts, vendorCategories } from "#lib/seed"
import { internalMutation } from "./_generated/server"
import { log } from "./lib/utils"

/**
 * Creates the initial seeded data for a user.
 *
 * This mutation is typically called after a new user is created via the Clerk
 * webhook flow. It creates:
 * - 2 default accounts: "Main" (default) and "Cash"
 * - All vendor expense and income categories
 *
 * The mutation is idempotent at the user-settings level: if a `user` row already
 * exists for the owner, onboarding is skipped.
 */
export const onboardUser = internalMutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    // A persisted user settings row means onboarding already ran.
    const existingOnboardedUser = await ctx.db
      .query("user")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .first()

    if (existingOnboardedUser) {
      log(`User ${userId} already onboarded, skipping onboarding`)
      return { success: false, reason: "already_onboarded" }
    }

    log(`Starting onboarding for user: ${userId}`)

    // Seed default accounts from the shared vendor account list.
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

    // Seed built-in categories from the shared vendor category list.
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

    // Insert both seed sets concurrently to keep onboarding fast.
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

    // Persist the default account choice in the user settings row.
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
