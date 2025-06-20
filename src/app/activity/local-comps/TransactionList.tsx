"use client"

import {ark} from "@ark-ui/react/factory"
import {Icon} from "@iconify/react/"
import {useNumberFormatter} from "@react-aria/i18n"
import {api} from "#/convex/_generated/api"
import {usePaginatedQuery} from "convex/react"
import {format, isToday, isYesterday} from "date-fns"
import {Button} from "react-aria-components"
import {GroupedVirtuoso} from "react-virtuoso"

import {CURRENCY} from "@/lib/date-utils"
import {TransactionJoined} from "@/lib/types/convex-queries"
import {cn, createCollection} from "@/lib/utils"

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
   * Render the Virtusuo list
   */
  return (
    <GroupedVirtuoso
      style={{height: "100%"}}
      groupCounts={groupCounts}
      endReached={() => loadMore(10)}
      useWindowScroll
      groupContent={index => (
        <h4 className="text-label-tertiary px-4 pt-6 text-sm leading-8 font-medium">
          {groupNames[index]}
        </h4>
      )}
      itemContent={(idx, groupIndex) => {
        const groupLength = allItemsGrouped[groupIndex].length
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const lastIndex = groupLength - 1
        const indexInGroup =
          idx -
          groupCounts
            .slice(0, groupIndex)
            .reduce((sum, count) => sum + count, 0)
        const transaction = allItemsFlat[idx]

        return <ListItem transaction={transaction} />
      }}
      components={{
        Item: props => <ark.div className="groupItem" asChild {...props} />,
        Group: props => <ark.div className="groupGroup" asChild {...props} />,
        List: props => <ark.div className="groupList" {...props} />,
        Footer: () => <Footer isLoading={isLoading} />,
      }}
    />
  )
}

const ListItem = ({transaction}: {transaction: TransactionJoined}) => {
  /**
   * Format hook to format the amounts
   */
  const formatter = useNumberFormatter({
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 0,
  })

  return (
    <Button
      className={cn(
        "bg-fill-quaternary flex w-full items-center gap-2 pl-4 select-none",
        "[&:first-child]:rounded-t-[0.95rem]", // Pretty self-explanatory
        "[&:is(h4_+_*)]:rounded-t-[0.95rem]", // Button right after the heading
        "[&:not(:has(+button))]:rounded-b-[0.95em]", // The last button in the group
        "[&:not(:has(+button))_.separator]:bg-transparent", // Separator of the last button
        // "[&:not(:has(+_h4))]:ring"
        "focus-visible:ring-ios-blue/[var(--separator-non-opaque-opacity)] outline-none focus-visible:rounded-xl focus-visible:ring-4"
      )}
      // onPress={() => onPress(idx, indexInGroup, groupIndex)}
    >
      {/*
       * Wrapper for the icon
       */}
      <ark.div className="h-7.5 w-7.5 overflow-hidden" asChild>
        <div className="inline-grid place-content-center rounded-full text-xl">
          <Icon icon={transaction.category.icon} />
        </div>
      </ark.div>

      {/*
       * Wraper for the content and the separator
       */}
      <div className="flex-1">
        <div className="border-separator-opaque flex h-12 w-full items-center pr-4">
          <p className="font-medium">{transaction.category.name}</p>
          <div className="flex-1" />
          <p className="text-label-secondary">
            {formatter.format(transaction.amount)}
          </p>
        </div>

        <div className="bg-separator-opaque separator h-px w-full mix-blend-color-dodge" />
      </div>
    </Button>
  )
}
const Footer = ({isLoading}: {isLoading: boolean}) => {
  return (
    <p className="text-center">{isLoading ? "Loading..." : "End Reached"}</p>
  )
}
