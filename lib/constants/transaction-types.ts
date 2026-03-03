export const transactionTypes = ["income", "expense"] as const
export type TransactionTypes = (typeof transactionTypes)[number]
