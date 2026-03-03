import type { Colors } from "../constants/colors"
import type { TransactionTypes } from "../constants/transaction-types"

export interface VendorCategory {
  name: string
  color: Colors
  icon: string
  type: TransactionTypes
}

const expenseCategories: VendorCategory[] = [
  { name: "Groceries", color: "red", icon: "🍎", type: "expense" },
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
]

const incomeCategories: VendorCategory[] = [
  { name: "Salary", color: "brown", icon: "💼", type: "income" },
  { name: "Freelance", color: "blue", icon: "🌐", type: "income" },
  { name: "Investments", color: "green", icon: "💹", type: "income" },
  { name: "Interest", color: "yellow", icon: "💰️", type: "income" },
  { name: "Refunds", color: "gray", icon: "↪️", type: "income" },
  { name: "Business", color: "gray", icon: "🏢", type: "income" },
  { name: "Rental", color: "green", icon: "🏡", type: "income" },
  { name: "Gifts", color: "yellow", icon: "🎁", type: "income" },
  { name: "Other Income", color: "green", icon: "💵", type: "income" },
]

const allCategories = [...expenseCategories, ...incomeCategories]

export {
  allCategories as vendorCategories,
  incomeCategories as vendorIncomeCategories,
  expenseCategories as vendorExpenseCategories,
}
