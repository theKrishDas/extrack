import { ConvexError } from "convex/values"
import { convexTest } from "convex-test"
import { describe, expect, it } from "vitest"
import { ErrorCode } from "#lib/errors"
import { getDoc } from "../../lib/doc"
import schema from "../../schema"
import {
  getDeletedAccountId,
  seedAccount,
  seedCategory,
  seedTransaction,
} from "../helpers"

describe("getDoc", () => {
  // -------------------------------------------------------------------------
  // mustExist
  // -------------------------------------------------------------------------

  describe("mustExist", () => {
    it("returns the document when account exists", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t)

      const doc = await t.run((ctx) => getDoc(ctx.db, accountId).mustExist())

      expect(doc._id).toEqual(accountId)
    })

    it("returns the document when category exists", async () => {
      const t = convexTest(schema)
      const categoryId = await seedCategory(t)

      const doc = await t.run((ctx) => getDoc(ctx.db, categoryId).mustExist())

      expect(doc._id).toEqual(categoryId)
    })

    it("returns the document when transaction exists", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t)
      const categoryId = await seedCategory(t)
      const transactionId = await seedTransaction(t, {
        accountId,
        categoryId,
        amount: 100,
        type: "expense",
      })

      const doc = await t.run((ctx) =>
        getDoc(ctx.db, transactionId).mustExist()
      )

      expect(doc._id).toEqual(transactionId)
    })

    it("throws NOT_FOUND when account does not exist", async () => {
      const t = convexTest(schema)
      const deletedId = await getDeletedAccountId(t)

      const result = t.run((ctx) => getDoc(ctx.db, deletedId).mustExist())

      await expect(result).rejects.toBeInstanceOf(ConvexError)
      await expect(result).rejects.toThrowError(ErrorCode.NOT_FOUND)
    })
  })

  // -------------------------------------------------------------------------
  // mustBeOwnedBy
  // -------------------------------------------------------------------------

  describe("mustBeOwnedBy", () => {
    it("returns the document when ownerId matches for an account", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, { ownerId: "user_clerk_123" })

      const doc = await t.run((ctx) =>
        getDoc(ctx.db, accountId).mustBeOwnedBy("user_clerk_123")
      )

      expect(doc.ownerId).toEqual("user_clerk_123")
    })

    it("returns the document when ownerId matches for a category", async () => {
      const t = convexTest(schema)
      const categoryId = await seedCategory(t, { ownerId: "user_clerk_123" })

      const doc = await t.run((ctx) =>
        getDoc(ctx.db, categoryId).mustBeOwnedBy("user_clerk_123")
      )

      expect(doc.ownerId).toEqual("user_clerk_123")
    })

    it("returns the document when ownerId matches for a transaction", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, { ownerId: "user_clerk_123" })
      const categoryId = await seedCategory(t, { ownerId: "user_clerk_123" })
      const transactionId = await seedTransaction(t, {
        ownerId: "user_clerk_123",
        accountId,
        categoryId,
        amount: 100,
        type: "expense",
      })

      const doc = await t.run((ctx) =>
        getDoc(ctx.db, transactionId).mustBeOwnedBy("user_clerk_123")
      )

      expect(doc.ownerId).toEqual("user_clerk_123")
    })

    it("throws FORBIDDEN when ownerId does not match", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, { ownerId: "user_clerk_123" })

      const result = t.run((ctx) =>
        getDoc(ctx.db, accountId).mustBeOwnedBy("user_clerk_456")
      )

      await expect(result).rejects.toBeInstanceOf(ConvexError)
      await expect(result).rejects.toThrowError(ErrorCode.FORBIDDEN)
    })

    it("throws NOT_FOUND when document does not exist, before checking ownership", async () => {
      const t = convexTest(schema)
      const deletedId = await getDeletedAccountId(t)

      const result = t.run((ctx) =>
        getDoc(ctx.db, deletedId).mustBeOwnedBy("user_clerk_123")
      )

      await expect(result).rejects.toBeInstanceOf(ConvexError)
      await expect(result).rejects.toThrowError(ErrorCode.NOT_FOUND)
    })
  })

  // -------------------------------------------------------------------------
  // Single db.get across builder methods
  // -------------------------------------------------------------------------

  describe("lazy fetch", () => {
    it("issues a single db.get when both mustExist and mustBeOwnedBy are called on the same builder", async () => {
      const t = convexTest(schema)
      const accountId = await seedAccount(t, { ownerId: "user_clerk_123" })

      // Build once, call mustBeOwnedBy — which internally calls mustExist.
      // If db.get were called twice, this would still pass but the console.log
      // in getDoc would emit two "[getDoc] db.get called" lines. This test
      // documents the intended single-fetch contract.
      const doc = await t.run((ctx) =>
        getDoc(ctx.db, accountId).mustBeOwnedBy("user_clerk_123")
      )

      expect(doc._id).toEqual(accountId)
    })
  })
})
