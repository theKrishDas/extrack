"use client"

import {createListCollection, Listbox} from "@ark-ui/react/listbox"
import {api} from "#/convex/_generated/api"
import {Doc} from "#/convex/_generated/dataModel"
import {useQuery} from "convex/react"

import {getRelativeDate} from "@/lib/date-utils"
import {List} from "@/components/ui/list"

function createCollection(transactions: Doc<"transactions">[]) {
  const mappedTransactions = transactions.map(transaction => ({
    ...transaction,
    value: transaction._id,
  }))
  return createListCollection({
    items: mappedTransactions,
    groupBy: item => getRelativeDate(item._creationTime),
  })
}

const TransactionDisplay = () => {
  const transactions = useQuery(api.transactions.getLimited, {limit: 10})

  // Loading state
  if (!transactions)
    return (
      <div className="inline-grid w-full place-content-center py-4">
        Loading...
      </div>
    )

  // No transactions state
  if (transactions.length === 0)
    return (
      <div className="bg-fill-tertiary text-label-tertiary inline-grid w-full place-content-center py-4">
        No transactions found!
      </div>
    )

  const collection = createCollection(transactions)

  return (
    <Listbox.Root collection={collection}>
      <Listbox.Label className="sr-only">Transactions</Listbox.Label>
      <Listbox.Content className="outline-none">
        {collection.group().map(([type, group]) => {
          const totalTransaction = group
            .map(transaction => {
              const dir = transaction.type === "expense" ? -1 : 1
              return transaction.amount * dir
            })
            .reduce((acc, v) => acc + v, 0)

          return (
            <Listbox.ItemGroup key={type} asChild>
              <List.Root>
                <Listbox.ItemGroupLabel asChild>
                  <List.Heading>
                    {type}: {totalTransaction}
                  </List.Heading>
                </Listbox.ItemGroupLabel>
                {group.map(item => (
                  <Listbox.Item key={item.value} item={item} asChild>
                    <List.Item>
                      <List.Content>
                        <Listbox.ItemText>{item.amount}</Listbox.ItemText>
                        <Listbox.ItemIndicator />
                      </List.Content>
                    </List.Item>
                  </Listbox.Item>
                ))}
              </List.Root>
            </Listbox.ItemGroup>
          )
        })}
      </Listbox.Content>
    </Listbox.Root>
  )
}

export default TransactionDisplay
