import type { Colors } from "./colors"
import type { TransactionTypes } from "./transaction-types"

export interface VendorAccount {
  name: string
  startingBalance: number
  icon: string
  is_default: boolean
}

export interface VendorCategory {
  name: string
  color: Colors
  icon: string
  type: TransactionTypes
}

export const vendorAccounts: VendorAccount[] = [
  {
    name: "Main",
    startingBalance: 0,
    icon: "🏦",
    is_default: true,
  },
  {
    name: "Cash",
    startingBalance: 0,
    icon: "💷",
    is_default: false,
  },
]

export const vendorCategories: VendorCategory[] = [
  // Expense categories
  { name: "Groceries", color: "brown", icon: "🍎", type: "expense" },
  { name: "Food", color: "gray", icon: "🍴", type: "expense" },
  { name: "Rent/Mortgage", color: "orange", icon: "🏠️", type: "expense" },
  { name: "Utilities", color: "yellow", icon: "💡", type: "expense" },
  { name: "Transportation", color: "yellow", icon: "🚕", type: "expense" },
  { name: "Dining Out", color: "gray", icon: "🍽️", type: "expense" },
  { name: "Entertainment", color: "brown", icon: "🍿", type: "expense" },
  { name: "Health", color: "red", icon: "♥️", type: "expense" },
  { name: "Education", color: "gray", icon: "🎓️", type: "expense" },
  { name: "Shopping", color: "mint", icon: "🛍️", type: "expense" },
  { name: "Travel", color: "teal", icon: "✈️", type: "expense" },
  { name: "Insurance", color: "cyan", icon: "🛡️", type: "expense" },

  // Income categories
  { name: "Salary", color: "brown", icon: "💼", type: "income" },
  { name: "Freelance", color: "blue", icon: "🌐", type: "income" },
  { name: "Investments", color: "green", icon: "💹", type: "income" },
  { name: "Interest", color: "yellow", icon: "💰️", type: "income" },
  { name: "Refunds", color: "cyan", icon: "↪️", type: "income" },
  { name: "Business", color: "gray", icon: "🏢", type: "income" },
  { name: "Rental", color: "cyan", icon: "🏡", type: "income" },
  { name: "Gifts", color: "pink", icon: "🎁", type: "income" },
  { name: "Other Income", color: "green", icon: "💵", type: "income" },
]
