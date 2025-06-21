"use client"

import {useState} from "react"
import {ark} from "@ark-ui/react/factory"
import {Icon} from "@iconify/react/"
import {useNumberFormatter} from "@react-aria/i18n"
import {api} from "#/convex/_generated/api"
import {useMutation, usePaginatedQuery} from "convex/react"
import {format, isToday, isYesterday} from "date-fns"
import {Button} from "react-aria-components"
import {GroupedVirtuoso} from "react-virtuoso"
import {Drawer} from "vaul"

import {CURRENCY} from "@/lib/date-utils"
import {cn, createCollection} from "@/lib/utils"
import {Button as AnimatedButton} from "@/components/ui/button/animated-button"
import {ConfirmButton} from "@/components/ui/confirm-button"
import {DataTable, DataType} from "@/app/(index)/local-comps/DataTable"

export default function TransactionsList() {
  /**
   * Convex query to get paginated transactions
   */
  const {
    results: transactions,
    loadMore,
    isLoading,
  } = usePaginatedQuery(
    api.transactions.getJoinedPaginated,
    {},
    {initialNumItems: 12}
  )

  /**
   * Group the transactions by date format
   */
  const collection = createCollection(transactions, "_id", item =>
    isToday(item.date)
      ? "Today"
      : isYesterday(item.date)
        ? "Yesterday"
        : format(item.date, "EEEE, MMMM dd")
  )
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
  const formatter = useNumberFormatter({
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 0,
  })

  /**
   * Render the Virtusuo list
   */
  return (
    <>
      <GroupedVirtuoso
        // overscan={{main: 500, reverse: 500}}
        increaseViewportBy={{top: 400, bottom: 400}}
        groupCounts={groupCounts}
        endReached={() => loadMore(10)}
        useWindowScroll
        groupContent={index => (
          <h4 className="text-label-tertiary px-4 pt-6 text-sm leading-8 font-medium">
            {groupNames[index]}
          </h4>
        )}
        itemContent={(idx, groupIndex) => {
          const transaction = allItemsFlat[idx]
          const groupLength = allItemsGrouped[groupIndex].length
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const lastIndex = groupLength - 1
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const indexInGroup =
            idx -
            groupCounts
              .slice(0, groupIndex)
              .reduce((sum, count) => sum + count, 0)

          return (
            <div
              className={cn(
                "flex h-full w-full items-center gap-2 px-4",
                "ring-ios-blue/[var(--separator-non-opaque-opacity)] rounded-2xl group-focus-visible:ring-4"
              )}
            >
              {/*
               * Wrapper for the icon
               */}
              <ark.div className="h-7.5 w-7.5 overflow-hidden" asChild>
                <div className="inline-grid place-content-center text-xl">
                  <Icon icon={transaction.category.icon} />
                </div>
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

                <div className="border-b-separator-opaque listSeparator w-full border-b-1 mix-blend-color-dodge group-focus-visible:border-b-transparent" />
              </div>
            </div>
          )
        }}
        components={{
          Item: props => {
            /**
             * Getting the index of the item from the data-attributes
             */
            const itemIndex = Number(props["data-item-index"])
            const {
              _id: id,
              amount,
              date,
              account: {name: accountName},
              category: {name: categorName},
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
            const removeTransaction = useMutation(api.transactions.remove)

            return (
              <Drawer.Root open={open} onOpenChange={setOpen}>
                <Drawer.Trigger asChild>
                  <Button
                    className={cn(
                      "bg-fill-quaternary group flex h-12 w-full outline-none select-none",
                      "[&:first-child]:rounded-t-2xl", // Pretty self-explanatory
                      "[&:is(.groupTitle_+_*)]:rounded-t-2xl", // Button right after the heading
                      "[&:not(:has(+button))]:rounded-b-2xl", // The last button in the group
                      "[&:not(:has(+button))_.listSeparator]:border-b-0", // Separator of the last button
                      "focus-visible:ring-ios-blue/[var(--separator-non-opaque-opacity)]"
                      // "focus-visible:rounded-2xls focus-visible: focus-visible:[&_.listSeparator]:border-b-transparent [&_.listWrapper]:ring-4"
                    )}
                    {...props}
                  />
                </Drawer.Trigger>
                <Drawer.Portal>
                  <Drawer.Overlay className="bg-background/60 fixed inset-0 z-50" />
                  <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto mt-24 flex h-auto max-w-xl flex-col rounded-t-xl bg-[#1c1c1e] p-4 pt-0 outline-none">
                    <Drawer.Handle className="my-2" />
                    <Drawer.Title className="text-2xl font-bold">
                      Transaction
                    </Drawer.Title>

                    <DataTable
                      data={data}
                      ariaLabel="Transaction details"
                      className="mt-5"
                    />

                    <div className="flex flex-row-reverse gap-2">
                      <AnimatedButton
                        className="flex-1"
                        color="gray"
                        isDisabled
                      >
                        Edit
                      </AnimatedButton>
                      <ConfirmButton
                        className="flex-1"
                        restVariants={{color: "gray"}}
                        onConfirm={() => {
                          setOpen(false)
                          removeTransaction({id})
                        }}
                      />
                    </div>
                  </Drawer.Content>
                </Drawer.Portal>
              </Drawer.Root>
            )
          },
          Group: props => <div className="groupTitle" {...props} />,
          List: props => <div className="groupList" {...props} />,
          Footer: () => <Footer isLoading={isLoading} />,
        }}
      />
    </>
  )
}

const Footer = ({isLoading}: {isLoading: boolean}) => {
  return (
    <p className="text-center">{isLoading ? "Loading..." : "End Reached"}</p>
  )
}
