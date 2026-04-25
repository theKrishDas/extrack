import { convexTest, type TestConvex } from "convex-test"
import { describe, expect, test } from "vitest"
import { vendorAccounts, vendorCategories } from "#lib/seed"
import { internal } from "../../_generated/api"
import type { Doc } from "../../_generated/dataModel"
import schema from "../../schema"

const userIdentity = {
  subject: "user_clerk_onboard_123",
  issuer: "https://clerk.dev",
  tokenIdentifier: "test_token_onboard_123",
} as const

const otherUserIdentity = {
  subject: "user_clerk_onboard_456",
  issuer: "https://clerk.dev",
  tokenIdentifier: "test_token_onboard_456",
} as const

function listOwnedAccounts(t: TestConvex<typeof schema>, ownerId: string) {
  return t.run((ctx) =>
    ctx.db
      .query("accounts")
      .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
      .collect()
  )
}

function listOwnedCategories(t: TestConvex<typeof schema>, ownerId: string) {
  return t.run((ctx) =>
    ctx.db
      .query("categories")
      .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
      .collect()
  )
}

function getStoredUser(t: TestConvex<typeof schema>, ownerId: string) {
  return t.run((ctx) =>
    ctx.db
      .query("user")
      .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
      .unique()
  )
}

function countStoredUsers(t: TestConvex<typeof schema>, ownerId: string) {
  return t.run((ctx) =>
    ctx.db
      .query("user")
      .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
      .collect()
  )
}

async function onboardUser(t: TestConvex<typeof schema>, ownerId: string) {
  return await t
    .withIdentity(
      ownerId === userIdentity.subject ? userIdentity : otherUserIdentity
    )
    .mutation(internal.userOnboarding.onboardUser, { userId: ownerId })
}

function snapshotCounts(t: TestConvex<typeof schema>, ownerId: string) {
  return t.run(async (ctx) => {
    const [accounts, categories, user] = await Promise.all([
      ctx.db
        .query("accounts")
        .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
        .collect(),
      ctx.db
        .query("categories")
        .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
        .collect(),
      ctx.db
        .query("user")
        .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
        .collect(),
    ])

    return {
      accounts: accounts.length,
      categories: categories.length,
      users: user.length,
    }
  })
}

function findVendorAccountByName(
  accounts: Doc<"accounts">[],
  accountName: string
) {
  return accounts.find((account) => account.name === accountName)
}

function findVendorCategory(
  categories: Doc<"categories">[],
  categoryName: string,
  categoryType: "income" | "expense"
) {
  return categories.find(
    (category) =>
      category.name === categoryName && category.type === categoryType
  )
}

function replaceSeedEntries<T>(target: T[], next: T[]) {
  const original = [...target]
  target.splice(0, target.length, ...next)

  return () => {
    target.splice(0, target.length, ...original)
  }
}

describe("users.onboardUser", () => {
  describe("onboard logic", () => {
    test("supports manual invocation without a Clerk identity", async () => {
      const t = convexTest(schema)

      const result = await t.mutation(internal.userOnboarding.onboardUser, {
        userId: userIdentity.subject,
      })

      const storedUsers = await countStoredUsers(t, userIdentity.subject)

      expect(result).toMatchObject({
        success: true,
        accountsCreated: vendorAccounts.length,
        categoriesCreated: vendorCategories.length,
      })
      expect(storedUsers).toHaveLength(1)
    })

    test("creates the seeded user state and sets the first vendor account as default", async () => {
      const t = convexTest(schema)

      const result = await onboardUser(t, userIdentity.subject)

      expect(result).toMatchObject({
        success: true,
        accountsCreated: vendorAccounts.length,
        categoriesCreated: vendorCategories.length,
        totalRecords: vendorAccounts.length + vendorCategories.length,
      })

      const [accounts, categories, storedUser] = await Promise.all([
        listOwnedAccounts(t, userIdentity.subject),
        listOwnedCategories(t, userIdentity.subject),
        getStoredUser(t, userIdentity.subject),
      ])

      const storedUsers = await countStoredUsers(t, userIdentity.subject)

      expect(accounts).toHaveLength(vendorAccounts.length)
      expect(categories).toHaveLength(vendorCategories.length)
      expect(storedUsers).toHaveLength(1)
      expect(storedUser).not.toBeNull()
      if (!storedUser) {
        throw new Error(`User not found for subject: ${userIdentity.subject}`)
      }

      for (const vendorAccount of vendorAccounts) {
        const storedAccount = findVendorAccountByName(
          accounts,
          vendorAccount.name
        )
        expect(storedAccount).toBeDefined()
        if (!storedAccount) {
          throw new Error(`Vendor account not found: ${vendorAccount.name}`)
        }

        expect(storedAccount).toMatchObject({
          ownerId: userIdentity.subject,
          name: vendorAccount.name,
          startingBalance: vendorAccount.startingBalance,
          icon: vendorAccount.icon,
          netFlow: 0,
          is_active: true,
          is_archived: false,
        })
      }

      for (const vendorCategory of vendorCategories) {
        const storedCategory = findVendorCategory(
          categories,
          vendorCategory.name,
          vendorCategory.type
        )
        expect(storedCategory).toBeDefined()
        if (!storedCategory) {
          throw new Error(
            `Vendor category not found: ${vendorCategory.type}:${vendorCategory.name}`
          )
        }

        expect(storedCategory).toMatchObject({
          ownerId: userIdentity.subject,
          name: vendorCategory.name,
          color: vendorCategory.color,
          icon: vendorCategory.icon,
          type: vendorCategory.type,
          is_vendor: true,
        })
      }

      const defaultAccount = await t.run((ctx) =>
        ctx.db.get(storedUser.defaultAccount)
      )
      expect(defaultAccount).not.toBeNull()
      if (!defaultAccount) {
        throw new Error("Default account not found")
      }

      expect(defaultAccount.ownerId).toBe(userIdentity.subject)
      expect(defaultAccount.name).toBe(vendorAccounts[0]?.name)
    })

    test("onboards different users independently without cross-user leakage", async () => {
      const t = convexTest(schema)

      const [firstResult, secondResult] = await Promise.all([
        onboardUser(t, userIdentity.subject),
        onboardUser(t, otherUserIdentity.subject),
      ])

      const [
        firstUserAccounts,
        firstUserCategories,
        firstUsers,
        secondUserAccounts,
        secondUserCategories,
        secondUsers,
      ] = await Promise.all([
        listOwnedAccounts(t, userIdentity.subject),
        listOwnedCategories(t, userIdentity.subject),
        countStoredUsers(t, userIdentity.subject),
        listOwnedAccounts(t, otherUserIdentity.subject),
        listOwnedCategories(t, otherUserIdentity.subject),
        countStoredUsers(t, otherUserIdentity.subject),
      ])

      expect(firstResult.success).toBe(true)
      expect(secondResult.success).toBe(true)
      expect(firstUserAccounts).toHaveLength(vendorAccounts.length)
      expect(firstUserCategories).toHaveLength(vendorCategories.length)
      expect(firstUsers).toHaveLength(1)
      expect(secondUserAccounts).toHaveLength(vendorAccounts.length)
      expect(secondUserCategories).toHaveLength(vendorCategories.length)
      expect(secondUsers).toHaveLength(1)
      expect(
        firstUserAccounts.every(
          (account) => account.ownerId === userIdentity.subject
        )
      ).toBe(true)
      expect(
        secondUserAccounts.every(
          (account) => account.ownerId === otherUserIdentity.subject
        )
      ).toBe(true)
      expect(
        firstUserCategories.every(
          (category) => category.ownerId === userIdentity.subject
        )
      ).toBe(true)
      expect(
        secondUserCategories.every(
          (category) => category.ownerId === otherUserIdentity.subject
        )
      ).toBe(true)
    })

    test("returns already_onboarded and performs no writes when the seeded state is healthy", async () => {
      const t = convexTest(schema)

      await onboardUser(t, userIdentity.subject)

      const before = await snapshotCounts(t, userIdentity.subject)
      const storedUserBefore = await getStoredUser(t, userIdentity.subject)

      const result = await onboardUser(t, userIdentity.subject)

      const after = await snapshotCounts(t, userIdentity.subject)
      const storedUserAfter = await getStoredUser(t, userIdentity.subject)

      expect(result).toEqual({
        success: false,
        reason: "already_onboarded",
      })
      expect(before).toEqual({
        accounts: vendorAccounts.length,
        categories: vendorCategories.length,
        users: 1,
      })
      expect(after).toEqual(before)
      expect(storedUserAfter?._id).toBe(storedUserBefore?._id)
      expect(storedUserAfter?.defaultAccount).toBe(
        storedUserBefore?.defaultAccount
      )
    })

    test("does not create duplicate rows when invoked concurrently for the same user", async () => {
      const t = convexTest(schema)

      const [firstResult, secondResult] = await Promise.all([
        onboardUser(t, userIdentity.subject),
        onboardUser(t, userIdentity.subject),
      ])

      const [accounts, categories, storedUsers] = await Promise.all([
        listOwnedAccounts(t, userIdentity.subject),
        listOwnedCategories(t, userIdentity.subject),
        countStoredUsers(t, userIdentity.subject),
      ])

      const resultReasons = [firstResult, secondResult].map((result) =>
        result.success ? "created" : result.reason
      )

      expect(resultReasons.sort()).toEqual(["already_onboarded", "created"])
      expect(accounts).toHaveLength(vendorAccounts.length)
      expect(categories).toHaveLength(vendorCategories.length)
      expect(storedUsers).toHaveLength(1)
    })

    test("fails atomically when vendor accounts seed is empty", async () => {
      const t = convexTest(schema)
      const restoreAccounts = replaceSeedEntries(vendorAccounts, [])

      try {
        await expect(onboardUser(t, userIdentity.subject)).rejects.toThrow()

        const after = await snapshotCounts(t, userIdentity.subject)
        expect(after).toEqual({
          accounts: 0,
          categories: 0,
          users: 0,
        })
      } finally {
        restoreAccounts()
      }
    })

    test("succeeds when vendor categories seed is empty", async () => {
      const t = convexTest(schema)
      const restoreCategories = replaceSeedEntries(vendorCategories, [])

      try {
        const result = await onboardUser(t, userIdentity.subject)

        const [accounts, categories, storedUsers, storedUser] =
          await Promise.all([
            listOwnedAccounts(t, userIdentity.subject),
            listOwnedCategories(t, userIdentity.subject),
            countStoredUsers(t, userIdentity.subject),
            getStoredUser(t, userIdentity.subject),
          ])

        expect(result).toMatchObject({
          success: true,
          accountsCreated: vendorAccounts.length,
          categoriesCreated: 0,
          totalRecords: vendorAccounts.length,
        })
        expect(accounts).toHaveLength(vendorAccounts.length)
        expect(categories).toHaveLength(0)
        expect(storedUsers).toHaveLength(1)
        expect(storedUser).not.toBeNull()
      } finally {
        restoreCategories()
      }
    })
  })
})
