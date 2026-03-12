import { convexTest } from "convex-test"
import { describe, expect, test } from "vitest"
import { api, internal } from "../../_generated/api"
import schema from "../../schema"
import { getDeletedAccountId, seedAccount } from "../helpers"

// ---------------------------------------------------------------------------
// Identities
// ---------------------------------------------------------------------------

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

// -------------------------------------------------------------------------
// Auth guards
// -------------------------------------------------------------------------

describe("auth", () => {
  test("throws UNAUTHENTICATED when called without a Clerk identity", async () => {
    const t = convexTest(schema)
    const accountId = await seedAccount(t)

    await expect(
      t.mutation(api.account.update, {
        id: accountId,
        name: "New Name",
        icon: "X",
      })
    ).rejects.toThrowError("UNAUTHENTICATED")
  })

  test("throws USER_NOT_STORED when identity exists but user was never onboarded", async () => {
    const t = convexTest(schema)
    const accountId = await seedAccount(t)

    await expect(
      t.withIdentity(userIdentity).mutation(api.account.update, {
        id: accountId,
        name: "New Name",
        icon: "X",
      })
    ).rejects.toThrowError("USER_NOT_STORED")
  })
})

// -------------------------------------------------------------------------
// Input validation
// -------------------------------------------------------------------------

describe("input validation", () => {
  test("throws when name is empty", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(userIdentity)
    await asUser.mutation(internal.userOnboarding.onboardUser, {
      userId: userIdentity.subject,
    })
    const accountId = await seedAccount(t)

    await expect(
      asUser.mutation(api.account.update, {
        id: accountId,
        name: "",
        icon: "X",
      })
    ).rejects.toThrow()
  })

  test("throws when name exceeds ACCOUNT_NAME_MAX_LENGTH (25)", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(userIdentity)
    await asUser.mutation(internal.userOnboarding.onboardUser, {
      userId: userIdentity.subject,
    })
    const accountId = await seedAccount(t)

    await expect(
      asUser.mutation(api.account.update, {
        id: accountId,
        name: "A".repeat(26),
        icon: "X",
      })
    ).rejects.toThrow()
  })

  test("throws when name starts with a space", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(userIdentity)
    await asUser.mutation(internal.userOnboarding.onboardUser, {
      userId: userIdentity.subject,
    })
    const accountId = await seedAccount(t)

    await expect(
      asUser.mutation(api.account.update, {
        id: accountId,
        name: " Cash",
        icon: "X",
      })
    ).rejects.toThrow()
  })

  test("throws when name has consecutive spaces", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(userIdentity)
    await asUser.mutation(internal.userOnboarding.onboardUser, {
      userId: userIdentity.subject,
    })
    const accountId = await seedAccount(t)

    await expect(
      asUser.mutation(api.account.update, {
        id: accountId,
        name: "My  Wallet",
        icon: "X",
      })
    ).rejects.toThrow()
  })

  test("throws when icon is empty", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(userIdentity)
    await asUser.mutation(internal.userOnboarding.onboardUser, {
      userId: userIdentity.subject,
    })
    const accountId = await seedAccount(t)

    await expect(
      asUser.mutation(api.account.update, {
        id: accountId,
        name: "Cash",
        icon: "",
      })
    ).rejects.toThrow()
  })

  test("throws when icon exceeds 10 characters", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(userIdentity)
    await asUser.mutation(internal.userOnboarding.onboardUser, {
      userId: userIdentity.subject,
    })
    const accountId = await seedAccount(t)

    await expect(
      asUser.mutation(api.account.update, {
        id: accountId,
        name: "Cash",
        icon: "X".repeat(11),
      })
    ).rejects.toThrow()
  })
})

// -------------------------------------------------------------------------
// Account existence
// -------------------------------------------------------------------------

describe("account existence", () => {
  test("throws when account id does not exist", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(userIdentity)
    await asUser.mutation(internal.userOnboarding.onboardUser, {
      userId: userIdentity.subject,
    })
    const deletedId = await getDeletedAccountId(t)

    await expect(
      asUser.mutation(api.account.update, {
        id: deletedId,
        name: "Cash",
        icon: "X",
      })
    ).rejects.toThrowError("NOT_FOUND")
  })
})

// -------------------------------------------------------------------------
// Ownership
// -------------------------------------------------------------------------

describe("ownership", () => {
  test("throws when account belongs to a different user", async () => {
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

    await expect(
      t.withIdentity(userIdentity).mutation(api.account.update, {
        id: otherAccountId,
        name: "Cash",
        icon: "X",
      })
    ).rejects.toThrowError("DOCUMENT_NOT_OWNED")
  })
})

// -------------------------------------------------------------------------
// Duplicate name guard
// -------------------------------------------------------------------------

describe("duplicate name guard", () => {
  test("throws ACCOUNT_NAME_TAKEN when another account with the same name exists", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(userIdentity)
    await asUser.mutation(internal.userOnboarding.onboardUser, {
      userId: userIdentity.subject,
    })

    await seedAccount(t, { name: "Savings" })
    const accountId = await seedAccount(t, { name: "Cash" })

    await expect(
      asUser.mutation(api.account.update, {
        id: accountId,
        name: "Savings",
        icon: "X",
      })
    ).rejects.toThrowError("ACCOUNT_NAME_TAKEN")
  })

  test("does not throw when name is unchanged (same account)", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(userIdentity)
    await asUser.mutation(internal.userOnboarding.onboardUser, {
      userId: userIdentity.subject,
    })

    const accountId = await seedAccount(t, { name: "Cash" })

    await expect(
      asUser.mutation(api.account.update, {
        id: accountId,
        name: "Cash",
        icon: "Y",
      })
    ).resolves.toBe(accountId)
    const account = await t.run((ctx) => ctx.db.get(accountId))
    expect(account?.name).toBe("Cash")
    expect(account?.icon).toBe("Y")
  })

  test("does not throw when a different user has an account with the same name", async () => {
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

    await seedAccount(t, {
      ownerId: otherUserIdentity.subject,
      name: "Savings",
    })
    const accountId = await seedAccount(t, {
      ownerId: userIdentity.subject,
      name: "Cash",
    })

    await expect(
      t.withIdentity(userIdentity).mutation(api.account.update, {
        id: accountId,
        name: "Savings",
        icon: "X",
      })
    ).resolves.toBe(accountId)
  })
})

// -------------------------------------------------------------------------
// Idempotency
// -------------------------------------------------------------------------

describe("idempotency", () => {
  test("returns accountId without a write when name and icon are unchanged", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(userIdentity)
    await asUser.mutation(internal.userOnboarding.onboardUser, {
      userId: userIdentity.subject,
    })

    const accountId = await seedAccount(t, { name: "Cash" })

    const result = await asUser.mutation(api.account.update, {
      id: accountId,
      name: "Cash",
      icon: "X",
    })

    expect(result).toBe(accountId)
    const account = await t.run((ctx) => ctx.db.get(accountId))
    expect(account?.name).toBe("Cash")
    expect(account?.icon).toBe("X")
  })

  test("trailing spaces are trimmed — 'Cash ' is treated as 'Cash'", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(userIdentity)
    await asUser.mutation(internal.userOnboarding.onboardUser, {
      userId: userIdentity.subject,
    })

    const accountId = await seedAccount(t, { name: "Cash" })

    // "Cash " trims to "Cash" — already the stored name, so no write occurs
    const result = await asUser.mutation(api.account.update, {
      id: accountId,
      name: "Cash ",
      icon: "X",
    })

    expect(result).toBe(accountId)
    const account = await t.run((ctx) => ctx.db.get(accountId))
    expect(account?.name).toBe("Cash")
  })
})

// -------------------------------------------------------------------------
// Update logic
// -------------------------------------------------------------------------

describe("update logic", () => {
  test("updates name and icon and returns accountId", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(userIdentity)
    await asUser.mutation(internal.userOnboarding.onboardUser, {
      userId: userIdentity.subject,
    })

    const accountId = await seedAccount(t, { name: "Cash" })

    const result = await asUser.mutation(api.account.update, {
      id: accountId,
      name: "Savings",
      icon: "Y",
    })

    expect(result).toBe(accountId)
    const account = await t.run((ctx) => ctx.db.get(accountId))
    expect(account?.name).toBe("Savings")
    expect(account?.icon).toBe("Y")
  })

  test("updates icon only, name unchanged", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(userIdentity)
    await asUser.mutation(internal.userOnboarding.onboardUser, {
      userId: userIdentity.subject,
    })

    const accountId = await seedAccount(t, { name: "Cash" })

    await asUser.mutation(api.account.update, {
      id: accountId,
      name: "Cash",
      icon: "Y",
    })

    const account = await t.run((ctx) => ctx.db.get(accountId))
    expect(account?.icon).toBe("Y")
    expect(account?.name).toBe("Cash")
  })

  test("stores the trimmed name when trailing spaces are passed", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(userIdentity)
    await asUser.mutation(internal.userOnboarding.onboardUser, {
      userId: userIdentity.subject,
    })

    const accountId = await seedAccount(t, { name: "Cash" })

    await asUser.mutation(api.account.update, {
      id: accountId,
      name: "Savings ",
      icon: "X",
    })

    const account = await t.run((ctx) => ctx.db.get(accountId))
    expect(account?.name).toBe("Savings")
  })

  test("updating one account does not affect another account", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(userIdentity)
    await asUser.mutation(internal.userOnboarding.onboardUser, {
      userId: userIdentity.subject,
    })

    const accountA = await seedAccount(t, { name: "Cash" })
    const accountB = await seedAccount(t, { name: "Savings" })

    await asUser.mutation(api.account.update, {
      id: accountA,
      name: "Wallet",
      icon: "Y",
    })

    const b = await t.run((ctx) => ctx.db.get(accountB))
    expect(b?.name).toBe("Savings")
    expect(b?.icon).toBe("X")
  })
})
