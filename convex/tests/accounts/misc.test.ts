/// <reference types="vite/client" />

import { ConvexError } from "convex/values"
import { convexTest } from "convex-test"
import { describe, expect, it } from "vitest"
import { ACCOUNTS_PER_USER_MAX } from "#lib/constants/constraints"
import { vendorAccounts } from "#lib/seed"
import { api, internal } from "../../_generated/api"
import schema from "../../schema"

const identity = {
  subject: "user_123",
  issuer: "https://clerk.dev",
  tokenIdentifier: "test_token",
} as const

describe("users.onboard", () => {
  const t = convexTest(schema)
  it("initializes a user with vendor accounts and categories", async () => {
    const result = await t.mutation(internal.users.onboard, {
      userId: identity.subject,
    })

    expect(result).toMatchObject({
      success: true,
      accountsCreated: 2,
      categoriesCreated: 21,
      totalRecords: 23,
    })

    const accounts = await t.run((ctx) =>
      ctx.db
        .query("accounts")
        .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
        .collect()
    )
    expect(accounts).toHaveLength(2)

    const categories = await t.run((ctx) =>
      ctx.db
        .query("categories")
        .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
        .collect()
    )
    expect(categories).toHaveLength(21)
  })
  it("counts the legnth of the category stored", async () => {
    const user = await t.run((ctx) =>
      ctx.db
        .query("user")
        .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
        .collect()
    )
    expect(user).toHaveLength(1)
  })
  it("counts the legnth of the accounts stored for a user", async () => {
    const accounts = await t.run((ctx) =>
      ctx.db
        .query("accounts")
        .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
        .collect()
    )
    expect(accounts).toHaveLength(2)
  })
  it("counts the legnth of the category stored for a user", async () => {
    const categories = await t.run((ctx) =>
      ctx.db
        .query("categories")
        .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
        .collect()
    )
    expect(categories).toHaveLength(21)
  })
  it("sets first vendor account as default", async () => {
    const user = await t.run((ctx) =>
      ctx.db.query("user").withIndex("by_owner").first()
    )
    expect(user).not.toBeNull()
    if (!user) throw new Error("user not found")

    expect(user.defaultAccount).not.toBeUndefined()
    expect(user.defaultAccount).not.toBeNull()

    const account = await t.run((ctx) => ctx.db.get(user.defaultAccount))
    expect(account).not.toBeNull()
    if (!account) throw new Error("account not found")

    expect(account.name).toBe(vendorAccounts[0].name)
  })
})

describe("accounts.get", () => {
  it("throws UNAUTHENTICATED error when user is not authenticated", async () => {
    const t = convexTest(schema)

    await expect(async () => t.query(api.accounts.getAll)).rejects.toThrowError(
      JSON.stringify({ code: "UNAUTHENTICATED" })
    )
  })

  it("throws USER_NOT_STORED error when user identity exists but user is not in database", async () => {
    const t = convexTest(schema)

    await expect(() =>
      t.withIdentity(identity).query(api.accounts.getAll)
    ).rejects.toThrowError(JSON.stringify({ code: "USER_NOT_STORED" }))
  })
})

describe("accounts.add", () => {
  it("throws error when creating account with duplicate name", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(identity)

    // onboard user make sure vendor accounts are created
    await asUser.mutation(internal.users.onboard, { userId: identity.subject })

    // Attempt to create a duplicate — this should now throw
    const mutation = asUser.mutation(api.accounts.add, { name: "Main" })
    await expect(mutation).rejects.toBeInstanceOf(ConvexError)
    await expect(mutation).rejects.toThrowError(
      "An account with this name already exists."
    )
  })

  it("throws error when name is empty", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(identity)

    // onboard user make sure vendor accounts are created
    await asUser.mutation(internal.users.onboard, { userId: identity.subject })

    // Attempt to create a account with empty name
    const mutation = asUser.mutation(api.accounts.add, { name: "" })
    await expect(mutation).rejects.toBeInstanceOf(ConvexError)
    await expect(mutation).rejects.toThrowError("Account name cannot be empty.")
  })

  it("throws error when balance is out of range", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(identity)

    // onboard user make sure vendor accounts are created
    await asUser.mutation(internal.users.onboard, { userId: identity.subject })

    const mutation1 = asUser.mutation(api.accounts.add, {
      name: "My Wallet",
      balance: -1 * 100,
    })
    await expect(mutation1).rejects.toBeInstanceOf(ConvexError)
    await expect(mutation1).rejects.toThrowError(
      "Starting balance is outside the allowed range."
    )

    const mutation2 = asUser.mutation(api.accounts.add, {
      name: "My Second Wallet",
      balance: 10 ** 10,
    })
    await expect(mutation2).rejects.toBeInstanceOf(ConvexError)
    await expect(mutation2).rejects.toThrowError(
      "Starting balance is outside the allowed range."
    )
  })

  // TODO: add this test and check in the mutation
  // it("throws error when emoji is empty", async () => {
  //   const t = convexTest(schema)
  //   const asUser = t.withIdentity(identity)

  //   // onboard user make sure vendor accounts are created
  //   await asUser.mutation(internal.users.onboard, { userId: identity.subject })

  //   await expect(
  //     asUser.mutation(api.accounts.add, { name: "My Wallet" })
  //   ).rejects.toThrowError("Account name cannot be empty.")
  // })

  it("throws when account creation limit is reached", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(identity)

    // onboard user make sure vendor accounts are created
    await asUser.mutation(internal.users.onboard, { userId: identity.subject })

    // Create accounts one by one up to the limit
    // end at 3 as 2 accounts are already created while onboarding
    for (let i = 0; i < 3; i++) {
      await asUser.mutation(api.accounts.add, { name: `ACC-${i}` })
    }
    const accounts = await t.run((ctx) =>
      ctx.db
        .query("accounts")
        .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
        .collect()
    )
    // makes sure account limit is reached
    expect(accounts).lengthOf(ACCOUNTS_PER_USER_MAX)

    // attempt to create a new account
    await expect(
      asUser.mutation(api.accounts.add, { name: "My Wallet" })
    ).rejects.toThrowError(
      "Account limit reached. Cannot create more accounts."
    )
  })

  it("creates a new account", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(identity)

    // onboard user make sure vendor accounts are created
    await asUser.mutation(internal.users.onboard, { userId: identity.subject })

    // using defaults
    const mutation1 = asUser.mutation(api.accounts.add, { name: "My Wallet" })
    await expect(mutation1).resolves.toBeDefined()
    // test existence
    expect(
      await t.run(async (ctx) => ctx.db.get(await mutation1))
    ).not.toBeNull()

    // overwriting the defaults
    const mutation2 = asUser.mutation(api.accounts.add, {
      name: "My Second Wallet",
      balance: 0,
      icon: "",
    })
    await expect(mutation2).resolves.toBeDefined()
    // test existence
    expect(
      await t.run(async (ctx) => ctx.db.get(await mutation2))
    ).not.toBeNull()
  })
})

describe("accounts.getAll", () => {
  it("throws UNAUTHENTICATED error when user is not authenticated", async () => {
    const t = convexTest(schema)
    await expect(t.query(api.accounts.getAll)).rejects.toThrowError(
      "UNAUTHENTICATED"
    )
  })

  it("throws USER_NOT_STORED error when user identity exists but user is not in database", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(identity)
    await expect(asUser.query(api.accounts.getAll)).rejects.toThrowError(
      "USER_NOT_STORED"
    )
  })

  it("returns only accounts owned by the authenticated user", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(identity)
    await asUser.mutation(internal.users.onboard, { userId: identity.subject })

    const allAccounts = await asUser.query(api.accounts.getAll)
    const userAccounts = allAccounts.filter(
      (a) => a.ownerId === identity.subject
    )
    expect(allAccounts).toEqual(userAccounts)
  })

  it("returns all user accounts after each creation", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(identity)
    await asUser.mutation(internal.users.onboard, { userId: identity.subject })

    const newAccountNames = Array.from(
      { length: ACCOUNTS_PER_USER_MAX - vendorAccounts.length },
      (_, idx) => `ACC-${idx}`
    )

    // Create accounts up to max limit
    // After each add, verify getAll matches raw DB query
    for (const name of newAccountNames) {
      await asUser.mutation(api.accounts.add, { name })
      const accounts = await asUser.query(api.accounts.getAll)
      expect(
        await t.run((ctx) =>
          ctx.db.query("accounts").withIndex("by_owner").collect()
        ) // full-scan
      ).toEqual(accounts)
    }
  })
})

describe("accounts.settings", () => {
  it("throws when deactivating the default account", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(identity)
    await asUser.mutation(internal.users.onboard, { userId: identity.subject })

    // get the default account
    const userAccount = await t.run((ctx) =>
      ctx.db
        .query("user")
        .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
        .unique()
    )
    expect(userAccount).not.toBeNull()
    if (!userAccount) throw new Error("user account not found")

    // attempt to set inactive
    await expect(
      asUser.mutation(api.accounts.toggleActive, {
        id: userAccount.defaultAccount,
      })
    ).rejects.toThrowError("Default account must remain active")
  })

  it("throws when setting an inactive account as default")

  it("deactivating accounts", async () => {
    const t = convexTest(schema)
    const asUser = t.withIdentity(identity)
    await asUser.mutation(internal.users.onboard, { userId: identity.subject })

    // get the default account
    const userAccount = await t.run((ctx) =>
      ctx.db
        .query("user")
        .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
        .unique()
    )
    expect(userAccount).not.toBeNull()
    if (!userAccount) throw new Error("user account not found")

    // get non-default accounts
    const nonDefaultAccounts = await t.run((ctx) =>
      ctx.db
        .query("accounts")
        .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
        .filter((q) => q.not(q.eq(q.field("_id"), userAccount.defaultAccount)))
        .collect()
    )

    for (const account of nonDefaultAccounts) {
      expect(
        await asUser.mutation(api.accounts.toggleActive, {
          id: account._id,
        })
      ).not.toBeNull()
    }
  })
})
