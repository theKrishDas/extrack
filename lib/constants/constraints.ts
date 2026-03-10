/**
 * All monetary values are in cents
 */

// Monetary
export const TRANSACTION_AMOUNT_MIN = 10 as const // cents
export const TRANSACTION_AMOUNT_MAX = 10_000_000 as const // cents
export const ACCOUNT_STARTING_BALANCE_MIN = 0 as const // cents — minimum initial balance set at account creation/edit
export const ACCOUNT_STARTING_BALANCE_MAX = 100_000_000 as const // cents — maximum initial balance set at account creation/edit

// Pagination
export const TRANSACTIONS_PER_PAGE = 10 as const

// Transactions
export const TRANSACTION_NOTE_MAX_LENGTH = 50 as const

// Categories
export const CATEGORY_NAME_MIN_LENGTH = 1 as const
export const CATEGORY_NAME_MAX_LENGTH = 15 as const
export const CATEGORIES_PER_USER_MAX = 20 as const

// Accounts
export const ACCOUNT_NAME_MIN_LENGTH = 1 as const
export const ACCOUNT_NAME_MAX_LENGTH = 25 as const
export const ACCOUNTS_PER_USER_MAX = 5 as const
