import { ConvexError } from "convex/values"
import { AppError } from "#lib/errors"
import type { Id, TableNames } from "../_generated/dataModel"
import type { DatabaseReader } from "../_generated/server"

/**
 * Returns a builder for existence and ownership checks on a Convex document.
 * A single `db.get` is issued lazily and shared across all builder methods.
 *
 * @param db - Convex `DatabaseReader` from the query/mutation context
 * @param id - Typed document ID from any table
 * @returns Builder with `mustExist` and `mustBeOwnedBy` methods
 *
 * @example
 * // Existence only
 * const doc = await getDoc(ctx.db, id).mustExist()
 *
 * @example
 * // Ownership (implicitly checks existence)
 * const doc = await getDoc(ctx.db, id).mustBeOwnedBy(userId)
 */
export const getDoc = <TableName extends TableNames>(
  db: DatabaseReader,
  id: Id<TableName>
) => {
  // Single db.get shared across builder methods — no duplicate fetches
  const docPromise = db.get(id).then((doc) => {
    console.log(`[getDoc] db.get called for id: ${id}`)
    return doc
  })

  /**
   * Resolves the document or throws if it doesn't exist.
   * @returns The document
   * @throws {ConvexError} If no document is found for the given id
   */
  async function mustExist() {
    const doc = await docPromise
    if (!doc)
      throw new ConvexError(
        AppError.notFound("Document not found", {
          domain: "db",
          context: { id },
        }).toData() as never
      )
    return doc
  }

  /**
   * Resolves the document, asserting existence and ownership.
   * @param userId - Clerk `user.subject` to match against `doc.ownerId`
   * @returns The document
   * @throws {ConvexError} If document doesn't exist or `ownerId` doesn't match
   */
  async function mustBeOwnedBy(userId: string) {
    const doc = await mustExist()

    // Ownership check runs only after existence is confirmed
    if (doc.ownerId !== userId)
      throw new ConvexError(
        AppError.forbidden(undefined, {
          domain: "db",
          context: { id, userId },
        }).toData() as never
      )
    return doc
  }

  return { mustExist, mustBeOwnedBy }
}
