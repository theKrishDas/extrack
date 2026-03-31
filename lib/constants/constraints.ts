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
