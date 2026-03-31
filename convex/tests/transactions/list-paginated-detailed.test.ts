import { convexTest } from "convex-test"
import { describe, expect, test } from "vitest"
import { api, internal } from "../../_generated/api"
import schema from "../../schema"
import { seedAccount, seedCategory, seedTransaction } from "../helpers"

const userIdentity = {
  subject: "user_clerk_123",
  issuer: "https://clerk.dev",
  tokenIdentifier: "test_token_123",
} as const

const otherUserIdentity = {
  subject: "user_clerk_456",
  issuer: "https://clerk.dev",
  tokenIdentifier: "test_token_456",
} as const

/** Minimal valid paginationOpts for a first page with no cursor. */
const firstPage = { numItems: 10, cursor: null }

const onboardUser = async (t: ReturnType<typeof convexTest>) => {
  const asUser = t.withIdentity(userIdentity)
  await asUser.mutation(internal.userOnboarding.onboardUser, {
    userId: userIdentity.subject,
  })
  return asUser
}

describe("transaction.listPaginatedDetailed", () => {
  // ---------------------------------------------------------------------------
  // auth
  // ---------------------------------------------------------------------------

  describe("auth", () => {
    test("throws UNAUTHENTICATED when called without a Clerk identity", async () => {
      const t = convexTest(schema)

      await expect(
        t.query(api.transaction.listPaginatedDetailed, {
          paginationOpts: firstPage,
        })
      ).rejects.toThrow("UNAUTHENTICATED")
    })

    test("throws USER_NOT_STORED when identity exists but user was never onboarded", async () => {
      const t = convexTest(schema)

      await expect(
        t
          .withIdentity(userIdentity)
          .query(api.transaction.listPaginatedDetailed, {
            paginationOpts: firstPage,
          })
      ).rejects.toThrow("USER_NOT_STORED")
    })
  })

  // ---------------------------------------------------------------------------
  // empty state
  // ---------------------------------------------------------------------------

  describe("empty state", () => {
    test("returns empty page when user has no transactions", async () => {
      const t = convexTest(schema)
      const asUser = await onboardUser(t)

      const result = await asUser.query(api.transaction.listPaginatedDetailed, {
        paginationOpts: firstPage,
      })

      expect(result.page).toHaveLength(0)
      expect(result.isDone).toBe(true)
    })

    test("returns empty page when type filter matches no transactions", async () => {
      const t = convexTest(schema)
      const asUser = await onboardUser(t)

      const accountId = await seedAccount(t)
      const categoryId = await seedCategory(t, { type: "expense" })
      await seedTransaction(t, {
        accountId,
        categoryId,
        amount: 500,
        type: "expense",
      })

      const result = await asUser.query(api.transaction.listPaginatedDetailed, {
        paginationOpts: firstPage,
        type: "income",
      })

      expect(result.page).toHaveLength(0)
      expect(result.isDone).toBe(true)
    })
  })

  // ---------------------------------------------------------------------------
  // result shape
  // ---------------------------------------------------------------------------

  describe("result shape", () => {
    test("each item includes the full category document", async () => {
      const t = convexTest(schema)
      const asUser = await onboardUser(t)

      const accountId = await seedAccount(t)
      const categoryId = await seedCategory(t, {
        type: "expense",
        name: "Food",
      })
      await seedTransaction(t, {
        accountId,
        categoryId,
        amount: 200,
        type: "expense",
      })

      const result = await asUser.query(api.transaction.listPaginatedDetailed, {
        paginationOpts: firstPage,
      })

      expect(result.page).toHaveLength(1)
      const item = result.page[0]
      expect(item.category).toBeDefined()
      expect(item.category._id).toEqual(categoryId)
      expect(item.category.name).toBe("Food")
    })

    test("each item includes the full account document", async () => {
      const t = convexTest(schema)
      const asUser = await onboardUser(t)

      const accountId = await seedAccount(t, { name: "Main Wallet" })
      const categoryId = await seedCategory(t, { type: "expense" })
      await seedTransaction(t, {
        accountId,
        categoryId,
        amount: 200,
        type: "expense",
      })

      const result = await asUser.query(api.transaction.listPaginatedDetailed, {
        paginationOpts: firstPage,
      })

      const item = result.page[0]
      expect(item.account).toBeDefined()
      expect(item.account._id).toEqual(accountId)
      expect(item.account.name).toBe("Main Wallet")
    })

    test("original transaction fields are preserved alongside enriched docs", async () => {
      const t = convexTest(schema)
      const asUser = await onboardUser(t)

      const accountId = await seedAccount(t)
      const categoryId = await seedCategory(t, { type: "income" })
      await seedTransaction(t, {
        accountId,
        categoryId,
        amount: 9999,
        type: "income",
      })

      const result = await asUser.query(api.transaction.listPaginatedDetailed, {
        paginationOpts: firstPage,
      })

      const item = result.page[0]
      expect(item.amount).toBe(9999)
      expect(item.type).toBe("income")
      expect(item.ownerId).toBe(userIdentity.subject)
    })
  })

  // ---------------------------------------------------------------------------
  // ordering
  // ---------------------------------------------------------------------------

  describe("ordering", () => {
    test("returns transactions in descending date order (no type filter)", async () => {
      const t = convexTest(schema)
      const asUser = await onboardUser(t)

      const accountId = await seedAccount(t)
      const categoryId = await seedCategory(t, { type: "expense" })

      const base = Date.now()
      await seedTransaction(t, {
        accountId,
        categoryId,
        amount: 100,
        type: "expense",
        date: base + 1000,
      })
      await seedTransaction(t, {
        accountId,
        categoryId,
        amount: 200,
        type: "expense",
        date: base + 3000,
      })
      await seedTransaction(t, {
        accountId,
        categoryId,
        amount: 300,
        type: "expense",
        date: base + 2000,
      })

      const result = await asUser.query(api.transaction.listPaginatedDetailed, {
        paginationOpts: firstPage,
      })

      const amounts = result.page.map((tx) => tx.amount)
      expect(amounts).toEqual([200, 300, 100])
    })

    test("returns transactions in descending date order (with type filter)", async () => {
      const t = convexTest(schema)
      const asUser = await onboardUser(t)

      const accountId = await seedAccount(t)
      const expenseCat = await seedCategory(t, { type: "expense" })

      const base = Date.now()
      await seedTransaction(t, {
        accountId,
        categoryId: expenseCat,
        amount: 100,
        type: "expense",
        date: base + 1000,
      })
      await seedTransaction(t, {
        accountId,
        categoryId: expenseCat,
        amount: 200,
        type: "expense",
        date: base + 3000,
      })
      await seedTransaction(t, {
        accountId,
        categoryId: expenseCat,
        amount: 300,
        type: "expense",
        date: base + 2000,
      })

      const result = await asUser.query(api.transaction.listPaginatedDetailed, {
        paginationOpts: firstPage,
        type: "expense",
      })

      const amounts = result.page.map((tx) => tx.amount)
      expect(amounts).toEqual([200, 300, 100])
    })
  })

  // ---------------------------------------------------------------------------
  // type filter
  // ---------------------------------------------------------------------------

  describe("type filter", () => {
    test("returns only expense transactions when type is 'expense'", async () => {
      const t = convexTest(schema)
      const asUser = await onboardUser(t)

      const accountId = await seedAccount(t)
      const expenseCat = await seedCategory(t, { type: "expense" })
      const incomeCat = await seedCategory(t, { type: "income" })

      await seedTransaction(t, {
        accountId,
        categoryId: expenseCat,
        amount: 100,
        type: "expense",
      })
      await seedTransaction(t, {
        accountId,
        categoryId: incomeCat,
        amount: 200,
        type: "income",
      })
      await seedTransaction(t, {
        accountId,
        categoryId: expenseCat,
        amount: 300,
        type: "expense",
      })

      const result = await asUser.query(api.transaction.listPaginatedDetailed, {
        paginationOpts: firstPage,
        type: "expense",
      })

      expect(result.page).toHaveLength(2)
      expect(result.page.every((tx) => tx.type === "expense")).toBe(true)
    })

    test("returns only income transactions when type is 'income'", async () => {
      const t = convexTest(schema)
      const asUser = await onboardUser(t)

      const accountId = await seedAccount(t)
      const expenseCat = await seedCategory(t, { type: "expense" })
      const incomeCat = await seedCategory(t, { type: "income" })

      await seedTransaction(t, {
        accountId,
        categoryId: expenseCat,
        amount: 100,
        type: "expense",
      })
      await seedTransaction(t, {
        accountId,
        categoryId: incomeCat,
        amount: 200,
        type: "income",
      })

      const result = await asUser.query(api.transaction.listPaginatedDetailed, {
        paginationOpts: firstPage,
        type: "income",
      })

      expect(result.page).toHaveLength(1)
      expect(result.page[0].type).toBe("income")
    })

    test("returns all transaction types when type is omitted", async () => {
      const t = convexTest(schema)
      const asUser = await onboardUser(t)

      const accountId = await seedAccount(t)
      const expenseCat = await seedCategory(t, { type: "expense" })
      const incomeCat = await seedCategory(t, { type: "income" })

      await seedTransaction(t, {
        accountId,
        categoryId: expenseCat,
        amount: 100,
        type: "expense",
      })
      await seedTransaction(t, {
        accountId,
        categoryId: incomeCat,
        amount: 200,
        type: "income",
      })

      const result = await asUser.query(api.transaction.listPaginatedDetailed, {
        paginationOpts: firstPage,
      })

      expect(result.page).toHaveLength(2)
      const types = new Set(result.page.map((tx) => tx.type))
      expect(types).toContain("expense")
      expect(types).toContain("income")
    })

    test.each([
      {
        label: "omitted",
        args: { paginationOpts: firstPage },
        expectedAmounts: [400, 300, 200, 100],
        expectedTypes: ["expense", "income", "income", "expense"],
      },
      {
        label: "income",
        args: { paginationOpts: firstPage, type: "income" as const },
        expectedAmounts: [300, 200],
        expectedTypes: ["income", "income"],
      },
      {
        label: "expense",
        args: { paginationOpts: firstPage, type: "expense" as const },
        expectedAmounts: [400, 100],
        expectedTypes: ["expense", "expense"],
      },
    ])("returns the exact expected transactions when type is $label", async ({
      args,
      expectedAmounts,
      expectedTypes,
    }) => {
      const t = convexTest(schema)
      const asUser = await onboardUser(t)

      const accountId = await seedAccount(t)
      const expenseCat = await seedCategory(t, {
        type: "expense",
        name: "Bills",
      })
      const incomeCat = await seedCategory(t, {
        type: "income",
        name: "Salary",
      })
      const base = Date.now()

      await seedTransaction(t, {
        accountId,
        categoryId: expenseCat,
        amount: 100,
        type: "expense",
        date: base + 1000,
      })
      await seedTransaction(t, {
        accountId,
        categoryId: incomeCat,
        amount: 200,
        type: "income",
        date: base + 2000,
      })
      await seedTransaction(t, {
        accountId,
        categoryId: incomeCat,
        amount: 300,
        type: "income",
        date: base + 3000,
      })
      await seedTransaction(t, {
        accountId,
        categoryId: expenseCat,
        amount: 400,
        type: "expense",
        date: base + 4000,
      })

      const result = await asUser.query(
        api.transaction.listPaginatedDetailed,
        args
      )

      expect(result.page.map((tx) => tx.amount)).toEqual(expectedAmounts)
      expect(result.page.map((tx) => tx.type)).toEqual(expectedTypes)
    })
  })

  // ---------------------------------------------------------------------------
  // pagination
  // ---------------------------------------------------------------------------

  describe("pagination", () => {
    test("cursor from first page retrieves the next page", async () => {
      const t = convexTest(schema)
      const asUser = await onboardUser(t)

      const accountId = await seedAccount(t)
      const categoryId = await seedCategory(t, { type: "expense" })
      const base = Date.now()

      for (let i = 0; i < 5; i++) {
        await seedTransaction(t, {
          accountId,
          categoryId,
          amount: (i + 1) * 100,
          type: "expense",
          date: base + i * 1000,
        })
      }

      const page1 = await asUser.query(api.transaction.listPaginatedDetailed, {
        paginationOpts: { numItems: 3, cursor: null },
      })

      expect(page1.page).toHaveLength(3)
      expect(page1.isDone).toBe(false)

      const page2 = await asUser.query(api.transaction.listPaginatedDetailed, {
        paginationOpts: { numItems: 3, cursor: page1.continueCursor },
      })

      expect(page2.page).toHaveLength(2)
      expect(page2.isDone).toBe(true)
    })

    test("all pages together contain every transaction exactly once", async () => {
      const t = convexTest(schema)
      const asUser = await onboardUser(t)

      const accountId = await seedAccount(t)
      const categoryId = await seedCategory(t, { type: "expense" })

      const amounts = [100, 200, 300, 400, 500]
      for (const amount of amounts) {
        await seedTransaction(t, {
          accountId,
          categoryId,
          amount,
          type: "expense",
        })
      }

      const page1 = await asUser.query(api.transaction.listPaginatedDetailed, {
        paginationOpts: { numItems: 3, cursor: null },
      })
      const page2 = await asUser.query(api.transaction.listPaginatedDetailed, {
        paginationOpts: { numItems: 3, cursor: page1.continueCursor },
      })

      const allAmounts = [...page1.page, ...page2.page].map((tx) => tx.amount)
      expect(allAmounts.sort((a, b) => a - b)).toEqual(
        amounts.sort((a, b) => a - b)
      )
    })

    test("cursor respects type filter across pages", async () => {
      const t = convexTest(schema)
      const asUser = await onboardUser(t)

      const accountId = await seedAccount(t)
      const expenseCat = await seedCategory(t, { type: "expense" })
      const incomeCat = await seedCategory(t, { type: "income" })

      for (let i = 0; i < 3; i++) {
        await seedTransaction(t, {
          accountId,
          categoryId: expenseCat,
          amount: (i + 1) * 10,
          type: "expense",
        })
        await seedTransaction(t, {
          accountId,
          categoryId: incomeCat,
          amount: (i + 1) * 100,
          type: "income",
        })
      }

      const page1 = await asUser.query(api.transaction.listPaginatedDetailed, {
        paginationOpts: { numItems: 2, cursor: null },
        type: "expense",
      })
      const page2 = await asUser.query(api.transaction.listPaginatedDetailed, {
        paginationOpts: { numItems: 2, cursor: page1.continueCursor },
        type: "expense",
      })

      const all = [...page1.page, ...page2.page]
      expect(all).toHaveLength(3)
      expect(all.every((tx) => tx.type === "expense")).toBe(true)
    })

    test.each([
      {
        label: "omitted",
        initialArgs: { paginationOpts: { numItems: 2, cursor: null } },
        expectedPage1: [500, 400],
        expectedPage2: [300, 200],
      },
      {
        label: "income",
        initialArgs: {
          paginationOpts: { numItems: 2, cursor: null },
          type: "income" as const,
        },
        expectedPage1: [400, 200],
        expectedPage2: [],
      },
      {
        label: "expense",
        initialArgs: {
          paginationOpts: { numItems: 2, cursor: null },
          type: "expense" as const,
        },
        expectedPage1: [500, 300],
        expectedPage2: [100],
      },
    ])("paginates consistently when type is $label", async ({
      initialArgs,
      expectedPage1,
      expectedPage2,
    }) => {
      const t = convexTest(schema)
      const asUser = await onboardUser(t)

      const accountId = await seedAccount(t)
      const expenseCat = await seedCategory(t, { type: "expense" })
      const incomeCat = await seedCategory(t, { type: "income" })
      const base = Date.now()

      const fixtures = [
        {
          amount: 100,
          type: "expense" as const,
          categoryId: expenseCat,
          date: base + 1000,
        },
        {
          amount: 200,
          type: "income" as const,
          categoryId: incomeCat,
          date: base + 2000,
        },
        {
          amount: 300,
          type: "expense" as const,
          categoryId: expenseCat,
          date: base + 3000,
        },
        {
          amount: 400,
          type: "income" as const,
          categoryId: incomeCat,
          date: base + 4000,
        },
        {
          amount: 500,
          type: "expense" as const,
          categoryId: expenseCat,
          date: base + 5000,
        },
      ]

      for (const fixture of fixtures) {
        await seedTransaction(t, {
          accountId,
          categoryId: fixture.categoryId,
          amount: fixture.amount,
          type: fixture.type,
          date: fixture.date,
        })
      }

      const page1 = await asUser.query(
        api.transaction.listPaginatedDetailed,
        initialArgs
      )
      const page2 = await asUser.query(api.transaction.listPaginatedDetailed, {
        ...initialArgs,
        paginationOpts: {
          numItems: 2,
          cursor: page1.continueCursor,
        },
      })

      expect(page1.page.map((tx) => tx.amount)).toEqual(expectedPage1)
      expect(page2.page.map((tx) => tx.amount)).toEqual(expectedPage2)
    })
  })

  // ---------------------------------------------------------------------------
  // isolation
  // ---------------------------------------------------------------------------

  describe("isolation", () => {
    test("does not return transactions belonging to another user", async () => {
      const t = convexTest(schema)
      await t
        .withIdentity(userIdentity)
        .mutation(internal.userOnboarding.onboardUser, {
          userId: userIdentity.subject,
        })
      await t
        .withIdentity(otherUserIdentity)
        .mutation(internal.userOnboarding.onboardUser, {
          userId: otherUserIdentity.subject,
        })

      const otherAccountId = await seedAccount(t, {
        ownerId: otherUserIdentity.subject,
      })
      const otherCategoryId = await seedCategory(t, {
        ownerId: otherUserIdentity.subject,
        type: "expense",
      })
      await seedTransaction(t, {
        ownerId: otherUserIdentity.subject,
        accountId: otherAccountId,
        categoryId: otherCategoryId,
        amount: 9999,
        type: "expense",
      })

      const result = await t
        .withIdentity(userIdentity)
        .query(api.transaction.listPaginatedDetailed, {
          paginationOpts: firstPage,
        })

      expect(result.page).toHaveLength(0)
    })

    test("type filter does not leak other users' transactions", async () => {
      const t = convexTest(schema)
      await t
        .withIdentity(userIdentity)
        .mutation(internal.userOnboarding.onboardUser, {
          userId: userIdentity.subject,
        })
      await t
        .withIdentity(otherUserIdentity)
        .mutation(internal.userOnboarding.onboardUser, {
          userId: otherUserIdentity.subject,
        })

      const otherAccountId = await seedAccount(t, {
        ownerId: otherUserIdentity.subject,
      })
      const otherCategoryId = await seedCategory(t, {
        ownerId: otherUserIdentity.subject,
        type: "income",
      })
      await seedTransaction(t, {
        ownerId: otherUserIdentity.subject,
        accountId: otherAccountId,
        categoryId: otherCategoryId,
        amount: 5000,
        type: "income",
      })

      const result = await t
        .withIdentity(userIdentity)
        .query(api.transaction.listPaginatedDetailed, {
          paginationOpts: firstPage,
          type: "income",
        })

      expect(result.page).toHaveLength(0)
    })

    test("two users' transactions are independently paginated", async () => {
      const t = convexTest(schema)
      await t
        .withIdentity(userIdentity)
        .mutation(internal.userOnboarding.onboardUser, {
          userId: userIdentity.subject,
        })
      await t
        .withIdentity(otherUserIdentity)
        .mutation(internal.userOnboarding.onboardUser, {
          userId: otherUserIdentity.subject,
        })

      const userAccountId = await seedAccount(t)
      const userCategoryId = await seedCategory(t, { type: "expense" })
      const otherAccountId = await seedAccount(t, {
        ownerId: otherUserIdentity.subject,
      })
      const otherCategoryId = await seedCategory(t, {
        ownerId: otherUserIdentity.subject,
        type: "expense",
      })

      await seedTransaction(t, {
        accountId: userAccountId,
        categoryId: userCategoryId,
        amount: 111,
        type: "expense",
      })
      await seedTransaction(t, {
        accountId: userAccountId,
        categoryId: userCategoryId,
        amount: 222,
        type: "expense",
      })
      await seedTransaction(t, {
        ownerId: otherUserIdentity.subject,
        accountId: otherAccountId,
        categoryId: otherCategoryId,
        amount: 999,
        type: "expense",
      })

      const userResult = await t
        .withIdentity(userIdentity)
        .query(api.transaction.listPaginatedDetailed, {
          paginationOpts: firstPage,
        })
      const otherResult = await t
        .withIdentity(otherUserIdentity)
        .query(api.transaction.listPaginatedDetailed, {
          paginationOpts: firstPage,
        })

      expect(userResult.page).toHaveLength(2)
      expect(otherResult.page).toHaveLength(1)
      expect(
        userResult.page.every((tx) => tx.ownerId === userIdentity.subject)
      ).toBe(true)
      expect(otherResult.page[0].ownerId).toBe(otherUserIdentity.subject)
    })
  })

  // ---------------------------------------------------------------------------
  // related document edge cases
  // ---------------------------------------------------------------------------

  describe("related document edge cases", () => {
    test("throws when an included transaction points to a deleted category", async () => {
      const t = convexTest(schema)
      const asUser = await onboardUser(t)

      const accountId = await seedAccount(t)
      const categoryId = await seedCategory(t, { type: "expense" })
      await seedTransaction(t, {
        accountId,
        categoryId,
        amount: 100,
        type: "expense",
      })

      await t.run(async (ctx) => {
        await ctx.db.delete("categories", categoryId)
      })

      await expect(
        asUser.query(api.transaction.listPaginatedDetailed, {
          paginationOpts: firstPage,
        })
      ).rejects.toThrow("Document not found.")
    })

    test("throws when an included transaction points to a deleted account", async () => {
      const t = convexTest(schema)
      const asUser = await onboardUser(t)

      const accountId = await seedAccount(t)
      const categoryId = await seedCategory(t, { type: "income" })
      await seedTransaction(t, {
        accountId,
        categoryId,
        amount: 100,
        type: "income",
      })

      await t.run(async (ctx) => {
        await ctx.db.delete("accounts", accountId)
      })

      await expect(
        asUser.query(api.transaction.listPaginatedDetailed, {
          paginationOpts: firstPage,
          type: "income",
        })
      ).rejects.toThrow("Document not found.")
    })
  })
})
