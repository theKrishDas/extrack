import { ConvexError } from "convex/values"
import { convexTest } from "convex-test"
import { describe, expect, it } from "vitest"
import { limit } from "#lib/constants/constraints"
import { vendorCategories } from "#lib/seed"
import { api, internal } from "../../_generated/api"
import schema from "../../schema"

const identity = {
  subject: "user_categories_123",
  issuer: "https://clerk.dev",
  tokenIdentifier: "test_token_categories",
} as const

describe("category.create limits", () => {
  it("allows creating categories while non-vendor count is below max", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(identity)

    await asUser.mutation(internal.userOnboarding.onboardUser, {
      userId: identity.subject,
    })

    await expect(
      asUser.mutation(api.category.create, {
        name: "Untagged",
        type: "expense",
        color: "blue",
      })
    ).resolves.toBeDefined()
  })

  it("ignores seeded vendor categories and caps only non-vendor categories per type", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(identity)

    await asUser.mutation(internal.userOnboarding.onboardUser, {
      userId: identity.subject,
    })

    for (let i = 0; i < limit.count.categories.perUserMax; i++) {
      await asUser.mutation(api.category.create, {
        name: `UCat${i}`,
        type: "expense",
        color: "green",
      })
    }

    const categories = await t.run((ctx) =>
      ctx.db
        .query("categories")
        .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
        .collect()
    )

    const userOwnedExpenseCategories = categories.filter(
      (category) => category.is_vendor === false && category.type === "expense"
    )
    expect(userOwnedExpenseCategories).toHaveLength(
      limit.count.categories.perUserMax
    )

    await expect(
      asUser.mutation(api.category.create, {
        name: "IncOnly",
        type: "income",
        color: "green",
      })
    ).resolves.toBeDefined()

    expect(categories.length + 1).toBe(
      vendorCategories.length + limit.count.categories.perUserMax + 1
    )
  })

  it("throws CATEGORY_LIMIT_REACHED with stable payload once non-vendor limit is reached", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(identity)

    await asUser.mutation(internal.userOnboarding.onboardUser, {
      userId: identity.subject,
    })

    for (let i = 0; i < limit.count.categories.perUserMax; i++) {
      await asUser.mutation(api.category.create, {
        name: `Cap${i}`,
        type: "income",
        color: "purple",
      })
    }

    try {
      await asUser.mutation(api.category.create, {
        name: "One Too Many",
        type: "income",
        color: "orange",
      })
      throw new Error("Expected category.create to throw at cap")
    } catch (error) {
      expect(error).toBeInstanceOf(ConvexError)

      if (!(error instanceof ConvexError)) {
        throw new Error("Expected ConvexError for category limit breach")
      }

      const payload =
        typeof error.data === "string"
          ? (JSON.parse(error.data) as {
              code: string
              limit: number
              message: string
            })
          : (error.data as { code: string; limit: number; message: string })

      expect(payload).toMatchObject({
        code: "CATEGORY_LIMIT_REACHED",
        limit: limit.count.categories.perUserMax,
      })
    }
  })

  it("rejects duplicate category names within the same type (case-insensitive)", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(identity)

    await asUser.mutation(internal.userOnboarding.onboardUser, {
      userId: identity.subject,
    })

    await expect(
      asUser.mutation(api.category.create, {
        name: "Tea",
        type: "expense",
        color: "orange",
      })
    ).resolves.toBeDefined()

    await expect(
      asUser.mutation(api.category.create, {
        name: "tEa",
        type: "expense",
        color: "purple",
      })
    ).rejects.toThrow("CATEGORY_NAME_TAKEN")
  })

  it("allows same category name across different types", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(identity)

    await asUser.mutation(internal.userOnboarding.onboardUser, {
      userId: identity.subject,
    })

    await expect(
      asUser.mutation(api.category.create, {
        name: "Transfer",
        type: "expense",
        color: "orange",
      })
    ).resolves.toBeDefined()

    await expect(
      asUser.mutation(api.category.create, {
        name: "Transfer",
        type: "income",
        color: "purple",
      })
    ).resolves.toBeDefined()
  })
})
