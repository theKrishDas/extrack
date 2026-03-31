import type { TransactionTypes } from "#lib/constants/transaction-types"

/** Logical filter after reading the `type` query param; `"*"` means both types. */
export type TransactionTypeParam = "*" | TransactionTypes

export function parseTransactionTypeParam(
  raw: string | null | undefined
): TransactionTypeParam {
  if (raw == null || raw.trim() === "") return "*"

  const v = raw.trim()
  if (v === "*") return "*"
  if (v === "income" || v === "expense") return v
  return "*"
}
