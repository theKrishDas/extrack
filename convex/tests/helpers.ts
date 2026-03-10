import type { TestConvex } from "convex-test"
import { AppError } from "#lib/errors"
import type { Id } from "../_generated/dataModel"
import type schema from "../schema"

const userIdentity = {
  subject: "user_clerk_123",
  issuer: "https://clerk.dev",
  tokenIdentifier: "test_token_123",
} as const

/**
 * Seeds an account directly into the DB for the given ownerId.
 * Use only when you need an account that bypasses business logic
 * (e.g. to test ownership checks or non-existent IDs).
 */
export function seedAccount(
  t: TestConvex<typeof schema>,
  opts: {
    ownerId?: string
    startingBalance?: number
    netFlow?: number
    is_active?: boolean
    name?: string
  } = {}
) {
  return t.run((ctx) => {
    const startingBalance = opts.startingBalance ?? 0
    return ctx.db.insert("accounts", {
      ownerId: opts.ownerId ?? userIdentity.subject,
      is_active: opts.is_active ?? true,
      is_archived: false,
      name: opts.name ?? "My Wallet",
      startingBalance,
      netFlow: opts.netFlow ?? 0,
      icon: "X",
    })
  })
}

/**
 * Seeds an transaction directly into the DB for the given ownerId.
 * Use only when you need a transaction that bypasses business logic
 * (e.g. to test ownership checks or non-existent IDs).
 */
export function seedTransaction(
  t: TestConvex<typeof schema>,
  opts: {
    ownerId?: string
    accountId: Id<"accounts">
    categoryId: Id<"categories">
    amount: number
    type: "income" | "expense"
  }
) {
  return t.run((ctx) =>
    ctx.db.insert("transactions", {
      ownerId: opts.ownerId ?? userIdentity.subject,
      account: opts.accountId,
      amount: opts.amount,
      type: opts.type,
      category: opts.categoryId,
      date: Date.now(),
    })
  )
}

/**
 * Reads the defaultAccount from the user row for the given ownerId.
 */
export function getDefaultAccountId(
  t: TestConvex<typeof schema>,
  ownerId: string
) {
  return t.run(async (ctx) => {
    const user = await ctx.db
      .query("user")
      .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
      .unique()

    if (!user)
      throw AppError.notFound("User not found", {
        context: { ownerId },
      })
    return user.defaultAccount
  })
}

/**
 * Seeds an category directly into the DB for the given ownerId.
 * Use only when you need a category that bypasses business logic
 * (e.g. to test ownership checks or non-existent IDs).
 */
export function seedCategory(
  t: TestConvex<typeof schema>,
  opts: {
    ownerId?: string
    type?: "income" | "expense"
    name?: string
  } = {}
) {
  return t.run((ctx) =>
    ctx.db.insert("categories", {
      ownerId: opts.ownerId ?? userIdentity.subject,
      type: opts.type ?? "expense",
      name: opts.name ?? "New Category",
      color: "red",
      is_vendor: false,
      icon: "X",
    })
  )
}

export function getDeletedAccountId(t: TestConvex<typeof schema>) {
  return t.run(async (ctx) => {
    const id = await ctx.db.insert("accounts", {
      ownerId: userIdentity.subject,
      is_active: true,
      is_archived: false,
      name: "Temp",
      startingBalance: 0,
      netFlow: 0,
      icon: "X",
    })
    await ctx.db.delete(id)
    return id
  })
}
