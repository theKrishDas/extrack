"use client"

import { ark } from "@ark-ui/react/factory"
import { useMutation, usePaginatedQuery } from "convex/react"
import { format, isToday, isYesterday } from "date-fns"
import { useState } from "react"
import { Button } from "react-aria-components"
import { GroupedVirtuoso } from "react-virtuoso"
import { Drawer } from "vaul"
import { api } from "#/convex/_generated/api"
import { DataTable, type DataType } from "@/app/(index)/local-comps/DataTable"
import { Button as AnimatedButton } from "@/components/ui/button/animated-button"
import { ConfirmButton } from "@/components/ui/confirm-button"
import { Emoji } from "@/components/ui/emoji"
import { useCurrencyFormatter } from "@/hooks/useCurrencyFormatter"
import { cn, createCollection } from "@/lib/utils"

/**
 * @deprecated Legacy component, will be removed in a future release.
 * @todo Remove this component.
 */
export default function TransactionsList() {
  /**
   * Convex query to get paginated transactions
   */
  const {
    results: transactions,
    loadMore,
    isLoading,
  } = usePaginatedQuery(
    api.transaction.listPaginatedDetailed,
    {},
    { initialNumItems: 12 }
  )

  /**
   * Group the transactions by date format
   */
  const collection = createCollection(transactions, "_id", (item) => {
    if (isToday(item.date)) return "Today"
    if (isYesterday(item.date)) return "Yesterday"
    return format(item.date, "EEEE, MMMM dd")
  })
  const groups = collection.group()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const groupCounts = groups.map(([_, items]) => items.length)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const groupNames = groups.map(([groupName, _]) => groupName)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const allItemsFlat = groups.flatMap(([_, items]) => items)
  const allItemsGrouped = groups.map(([, t]) => t)

  /**
   * To format the amounts by locale
   */
  const formatter = useCurrencyFormatter()

  /**
   * Render the Virtusuo list
   */
  return (
    <GroupedVirtuoso
      // overscan={{main: 500, reverse: 500}}
      components={{
        Item: (props) => {
          /**
           * Getting the index of the item from the data-attributes
           */
          const itemIndex = Number(props["data-item-index"])
          const {
            _id: id,
            amount,
            date,
            account: { name: accountName },
            category: { name: categorName },
            note,
          } = allItemsFlat[itemIndex]
          const data: DataType = {
            header: ["Key", "value"],
            body: [
              ["Amount", formatter.format(amount)],
              ["Date", format(date, "dd MMM 'at' hh:mm a")],
              ["Category", categorName],
              ["Account", accountName],
              ["Note", note],
            ],
          }
          const [open, setOpen] = useState(false)
          const removeTransaction = useMutation(api.transaction.delete)

          return (
            <Drawer.Root onOpenChange={setOpen} open={open}>
              <Drawer.Trigger asChild>
                <Button
                  className={cn(
                    "group flex h-12 w-full select-none bg-fill-quaternary outline-none",
                    "first:rounded-t-2xl", // Pretty self-explanatory
                    "[.groupTitle+*]:rounded-t-2xl", // Button right after the heading
                    "[&:not(:has(+button))]:rounded-b-2xl", // The last button in the group
                    "[&:not(:has(+button))_.listSeparator]:border-b-0", // Separator of the last button
                    "focus-visible:ring-ios-blue/(--separator-non-opaque-opacity)"
                    // "focus-visible:rounded-2xls focus-visible: focus-visible:[&_.listSeparator]:border-b-transparent [&_.listWrapper]:ring-4"
                  )}
                  {...props}
                />
              </Drawer.Trigger>
              <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 z-50 bg-background/60" />
                <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto mt-24 flex h-auto max-w-xl flex-col rounded-t-xl bg-[#1c1c1e] p-4 pt-0 outline-none">
                  <Drawer.Handle className="my-2" />
                  <Drawer.Title className="font-bold text-2xl">
                    Transaction
                  </Drawer.Title>

                  <DataTable
                    ariaLabel="Transaction details"
                    className="mt-5"
                    data={data}
                  />

                  <div className="flex flex-row-reverse gap-2">
                    <AnimatedButton className="flex-1" color="gray" isDisabled>
                      Edit
                    </AnimatedButton>
                    <ConfirmButton
                      className="flex-1"
                      onConfirm={() => {
                        setOpen(false)
                        removeTransaction({ id })
                      }}
                      restVariants={{ color: "gray" }}
                    />
                  </div>
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.Root>
          )
        },
        Group: (props) => <div className="groupTitle" {...props} />,
        List: (props) => <div className="groupList" {...props} />,
        Footer: () => <Footer isLoading={isLoading} />,
      }}
      endReached={() => loadMore(10)}
      groupContent={(index) => (
        <h4 className="px-4 pt-6 font-medium text-label-tertiary text-sm leading-8">
          {groupNames[index]}
        </h4>
      )}
      groupCounts={groupCounts}
      increaseViewportBy={{ top: 400, bottom: 400 }}
      itemContent={(idx, groupIndex) => {
        const transaction = allItemsFlat[idx]
        const groupLength = allItemsGrouped[groupIndex].length
        const _lastIndex = groupLength - 1
        const _indexInGroup =
          idx -
          groupCounts
            .slice(0, groupIndex)
            .reduce((sum, count) => sum + count, 0)

        return (
          <div
            className={cn(
              "flex h-full w-full items-center gap-2 px-4",
              "rounded-2xl ring-ios-blue/(--separator-non-opaque-opacity) group-focus-visible:ring-4"
            )}
          >
            {/*
             * Wrapper for the icon
             */}
            <ark.div asChild className="h-7.5 w-7.5 overflow-hidden">
              <Emoji asChild>
                <p className="inline-grid place-content-center text-lg">
                  {transaction.category.icon}
                </p>
              </Emoji>
            </ark.div>

            {/*
             * Rest of the content
             */}
            <div className="flex h-full w-full flex-1 flex-col">
              <div className="fle-1 flex h-full w-full items-center">
                <p className="font-medium">{transaction.category.name}</p>
                <div className="flex-1" />
                <p className="text-label-secondary">
                  {formatter.format(transaction.amount)}
                </p>
              </div>

              <div className="listSeparator w-full border-b border-b-separator-opaque mix-blend-color-dodge group-focus-visible:border-b-transparent" />
            </div>
          </div>
        )
      }}
      useWindowScroll
    />
  )
}

const Footer = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <p className="text-center">{isLoading ? "Loading..." : "End Reached"}</p>
  )
}
