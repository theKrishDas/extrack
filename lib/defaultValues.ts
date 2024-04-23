//
// New transaction form
//
export const MINIMUM_SARTING_BALANCE = 3_000 as const;
// Default tab when adding new transaction
export const DEFAULT_ACTIVE_TAB = "expense" as const; // expense | income

export const MAX_AMOUNT_LIMIT = 1_00_00_000 as const;
export const DEFAULT_TRANSACTION_IS_EXPENSE =
  DEFAULT_ACTIVE_TAB === ("expense" as const);
