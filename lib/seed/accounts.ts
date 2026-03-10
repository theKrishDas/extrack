export interface VendorAccount {
  name: string
  startingBalance: number
  icon: string
}

const accounts: VendorAccount[] = [
  { name: "Main", startingBalance: 0, icon: "🏦" },
  { name: "Cash", startingBalance: 0, icon: "💷" },
]

export { accounts as vendorAccounts }
