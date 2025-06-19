"use client"

import {useMemo} from "react"
import {ark} from "@ark-ui/react/factory"
import {useNumberFormatter} from "@react-aria/i18n"
import {api} from "#/convex/_generated/api"
import {usePaginatedQuery} from "convex/react"
import {format, isToday, isYesterday} from "date-fns"
import {GroupedVirtuoso} from "react-virtuoso"

import {CURRENCY} from "@/lib/date-utils"
import {TransactionJoined} from "@/lib/types/convex-queries"
import {cn, createCollection} from "@/lib/utils"
import {IonArrowDown, IonArrowUp} from "@/components/icons/ion"
import {Container} from "@/components/layout/container"

const Page = () => {
  const {
    results: transactions,
    loadMore,
    isLoading,
  } = usePaginatedQuery(
    api.transactions.getJoinedPaginated,
    {},
    {initialNumItems: 12}
  )

  return (
    <>
      <Container className="flex flex-col gap-0.5" as="section">
        <div className="px-4">
          <h3 className="mt-4 mb-4.5 text-3xl font-semibold tracking-tight">
            Activities
          </h3>

          <Virtuoso
            transactions={transactions}
            isLoading={isLoading}
            loadMore={loadMore}
          />
        </div>
      </Container>
    </>
  )
}

const Virtuoso = ({
  transactions,
  isLoading,
  loadMore,
}: {
  transactions: TransactionJoined[]
  isLoading: boolean
  loadMore: (n: number) => void
}) => {
  const {groupCounts, groupNames, allItemsGrouped, allItemsFlat} =
    useMemo(() => {
      const collection = createCollection(transactions, "_id", item =>
        isToday(item._creationTime)
          ? "Today"
          : isYesterday(item._creationTime)
            ? "Yesterday"
            : format(item._creationTime, "EEEE, MMMM dd")
      )
      const groups = collection.group()

      return {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        groupCounts: groups.map(([_, items]) => items.length),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        groupNames: groups.map(([groupName, _]) => groupName),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        allItemsFlat: groups.flatMap(([_, items]) => items),
        allItemsGrouped: groups.map(([, t]) => t),
      }
    }, [transactions])

  const formatter = useNumberFormatter({
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 0,
  })

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
        const lastIndex = groupLength - 1
        const indexInGroup =
          idx -
          groupCounts
            .slice(0, groupIndex)
            .reduce((sum, count) => sum + count, 0)
        const transaction = allItemsFlat[idx]

        const isExpense = transaction.type === "expense"

        return (
          <div
            className={cn(
              "bg-fill-quaternary flex items-center gap-2 pl-4",
              indexInGroup === 0 && "rounded-t-[0.95rem]",
              indexInGroup === lastIndex && "rounded-b-[0.95rem]"
            )}
          >
            {/*
             * Wrapper for the icon
             */}
            <ark.div className="flex items-center pr-2">
              <div
                className={cn(
                  "inline-grid aspect-square place-content-center rounded-full p-0.5 text-xl [&_svg]:mix-blend-plus-darker [&_svg]:dark:mix-blend-plus-lighter",
                  isExpense
                    ? "text-ios-red bg-ios-red/[var(--fill-tertiary-opacity)]"
                    : "text-ios-green bg-ios-green/[var(--fill-tertiary-opacity)]"
                )}
              >
                {isExpense ? <IonArrowDown /> : <IonArrowUp />}
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

              <div
                className={cn(
                  "bg-separator-opaque separator h-px w-full mix-blend-color-dodge",
                  indexInGroup === lastIndex && "hidden bg-transparent"
                )}
              />
            </div>
          </div>
        )
      }}
      components={{
        Item: props => <ark.div className="groupItem" asChild {...props} />,
        Group: props => <ark.div className="groupGroup" asChild {...props} />,
        List: props => <ark.div className="groupList" {...props} />,
        Footer: () => (
          <p className="text-center">
            {isLoading ? "Loading..." : "End Reached"}
          </p>
        ),
      }}
    />
  )
}

export default Page
