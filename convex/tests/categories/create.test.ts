import { ConvexError } from "convex/values"
import { convexTest } from "convex-test"
import { describe, expect, it } from "vitest"
import { CATEGORIES_PER_USER_MAX } from "#lib/constants/constraints"
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

  it("ignores seeded vendor categories and caps only non-vendor categories", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(identity)

    await asUser.mutation(internal.userOnboarding.onboardUser, {
      userId: identity.subject,
    })

    for (let i = 0; i < CATEGORIES_PER_USER_MAX; i++) {
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

    const userOwnedCategories = categories.filter(
      (category) => category.is_vendor === false
    )
    expect(userOwnedCategories).toHaveLength(CATEGORIES_PER_USER_MAX)
    expect(categories).toHaveLength(
      vendorCategories.length + CATEGORIES_PER_USER_MAX
    )
  })

  it("throws CATEGORY_LIMIT_REACHED with stable payload once non-vendor limit is reached", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(identity)

    await asUser.mutation(internal.userOnboarding.onboardUser, {
      userId: identity.subject,
    })

    for (let i = 0; i < CATEGORIES_PER_USER_MAX; i++) {
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
        limit: CATEGORIES_PER_USER_MAX,
      })
    }
  })
})
