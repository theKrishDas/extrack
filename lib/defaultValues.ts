//
// Limits
//
export const TRANSACTION_PER_PAGE_FETCH_LIMIT = 10 as const;

//
// New transaction form
//
export const MINIMUM_SARTING_BALANCE = 500 as const;
// Default tab when adding new transaction
export const DEFAULT_ACTIVE_TAB = "expense" as const; // expense | income

export const MAX_AMOUNT_LIMIT = 1_00_00_000 as const;
export const MINIMUM_TRANSACTION_AMOUNT = 0.01 as const;

export const DEFAULT_TRANSACTION_IS_EXPENSE =
  DEFAULT_ACTIVE_TAB === ("expense" as const);
