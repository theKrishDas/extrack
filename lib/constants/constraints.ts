/**
 * All monetary values are in cents
 */

export const limit = {
  amount: {
    transaction: {
      min: 10,
      max: 10_000_000,
    },
    account: {
      startingBalance: {
        // Minimum/maximum initial balance set at account creation/edit.
        min: 0,
        max: 100_000_000,
      },
    },
  },
  pagination: {
    transactions: {
      perPage: 10,
    },
  },
  note: {
    transaction: {
      maxLength: 50,
    },
  },
  name: {
    category: {
      min: 1,
      max: 15,
    },
    account: {
      min: 1,
      max: 25,
    },
  },
  count: {
    categories: {
      perUserMax: 20,
    },
    accounts: {
      perUserMax: 5,
    },
  },
} as const

// Legacy exports for a smoother migration.
/** @deprecated Use limit.amount.transaction.min */
export const TRANSACTION_AMOUNT_MIN = limit.amount.transaction.min
/** @deprecated Use limit.amount.transaction.max */
export const TRANSACTION_AMOUNT_MAX = limit.amount.transaction.max
/** @deprecated Use limit.amount.account.startingBalance.min */
export const ACCOUNT_STARTING_BALANCE_MIN =
  limit.amount.account.startingBalance.min
/** @deprecated Use limit.amount.account.startingBalance.max */
export const ACCOUNT_STARTING_BALANCE_MAX =
  limit.amount.account.startingBalance.max

/** @deprecated Use limit.pagination.transactions.perPage */
export const TRANSACTIONS_PER_PAGE = limit.pagination.transactions.perPage

/** @deprecated Use limit.note.transaction.maxLength */
export const TRANSACTION_NOTE_MAX_LENGTH = limit.note.transaction.maxLength

/** @deprecated Use limit.name.category.min */
export const CATEGORY_NAME_MIN_LENGTH = limit.name.category.min
/** @deprecated Use limit.name.category.max */
export const CATEGORY_NAME_MAX_LENGTH = limit.name.category.max
/** @deprecated Use limit.count.categories.perUserMax */
export const CATEGORIES_PER_USER_MAX = limit.count.categories.perUserMax

/** @deprecated Use limit.name.account.min */
export const ACCOUNT_NAME_MIN_LENGTH = limit.name.account.min
/** @deprecated Use limit.name.account.max */
export const ACCOUNT_NAME_MAX_LENGTH = limit.name.account.max
/** @deprecated Use limit.count.accounts.perUserMax */
export const ACCOUNTS_PER_USER_MAX = limit.count.accounts.perUserMax
