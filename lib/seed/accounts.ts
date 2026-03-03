export interface VendorAccount {
  name: string
  startingBalance: number
  icon: string
  is_default: boolean
}

const accounts: VendorAccount[] = [
  { name: "Main", startingBalance: 0, icon: "🏦", is_default: true },
  { name: "Cash", startingBalance: 0, icon: "💷", is_default: false },
]

export { accounts as vendorAccounts }
