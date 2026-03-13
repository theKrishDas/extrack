"use client"

import { usePaginatedQuery } from "convex/react"
import { useState } from "react"
import {
  Header,
  ListBox,
  ListBoxItem,
  ListBoxLoadMoreItem,
  ListBoxSection,
  ListLayout,
  Virtualizer,
} from "react-aria-components"
import { api } from "#/convex/_generated/api"
import { Spinner } from "@/components/loading/spinner"
import { Emoji } from "@/components/ui/emoji"
import { Spacer } from "@/components/ui/spacer"
import { useCurrencyFormatter } from "@/hooks/useCurrencyFormatter"
import { formatDateGroup } from "@/lib/date-utils"
import { cn, createCollection } from "@/lib/utils"
import { Drawer } from "./Drawer"
import { ListEndMessage } from "./ListEndMessage"

export function TransactionList() {
  const {
    results: transactions,
    loadMore,
    isLoading,
    status,
  } = usePaginatedQuery(
    api.transaction.listPaginatedDetailed,
    {},
    { initialNumItems: 12 }
  )
  const collection = createCollection(transactions, "_id", formatDateGroup)
  const groups = collection.group()

  const formatter = useCurrencyFormatter()

  // Store full transaction object instead of just ID
  // Avoids O(n) .find() lookups and handles pagination changes gracefully
  const [activeTxn, setActiveTxn] = useState<
    (typeof transactions)[number] | null
  >(null)
  const [open, setOpen] = useState(false)

  return (
    <>
      <Drawer onOpenChange={setOpen} open={open} txn={activeTxn} />

      <Virtualizer
        layout={ListLayout}
        layoutOptions={{
          rowHeight: 48, // default is 48
          gap: 0,
          padding: 0,
        }}
      >
        <ListBox
          aria-label="List of all transactions"
          className="ListBoxRoot block p-0"
          items={transactions}
          renderEmptyState={() => <Spinner />}
          selectionMode="single"
        >
          {groups.map((group, grpIdx) => {
            const [groupName, transactions] = group

            return (
              <ListBoxSection className="ListBoxSection" key={groupName}>
                <Header
                  className={cn(
                    "pointer-events-none select-none truncate px-4 font-medium text-label-tertiary text-sm leading-8",
                    // FIXME: This sticky is not working
                    "sticky z-10",
                    grpIdx > 0 && "mt-6"
                  )}
                >
                  {groupName}
                </Header>
                {transactions.map((txn, txnIdx) => {
                  const {
                    _id: txnId,
                    category: { name, icon },
                  } = txn
                  const amount = txn.amount / 100

                  return (
                    <ListBoxItem
                      className={({ isFocusVisible }) =>
                        cn(
                          "ListItem",
                          "group/ListItem relative flex h-full min-h-0 w-full select-none items-center bg-fill-quaternary px-4 outline-none",
                          "data-hovered:bg-fill-tertiary data-pressed:bg-fill-secondary",
                          isFocusVisible === true &&
                            "rounded-sm! ring-3 ring-ios-blue",
                          // rounded-top for the first item
                          txnIdx === 0 &&
                            "supports-[corner-shape:squircle]:corner-squircle rounded-t-2xl supports-[corner-shape:squircle]:rounded-t-4xl",
                          // rounded-bottom for the last item
                          txnIdx === transactions.length - 1 &&
                            "supports-[corner-shape:squircle]:corner-squircle rounded-b-2xl supports-[corner-shape:squircle]:rounded-b-4xl"
                        )
                      }
                      id={txnId}
                      // biome-ignore lint/suspicious/noArrayIndexKey: during optimistic update, the temporary item shares the same _id as the server-confirmed one — index is the only thing that's actually unique here
                      key={`${txnId}-${txnIdx}`}
                      onPress={() => {
                        setActiveTxn(txn)
                        setOpen(true)
                      }}
                    >
                      <Emoji aria-hidden={true} className="mr-3">
                        {icon}
                      </Emoji>
                      <div className="relative flex h-full flex-1 items-center">
                        <span className="font-medium">{name}</span>
                        <Spacer aria-hidden={true} className="flex-1" />
                        <span className="text-right text-label-secondary">
                          {formatter.format(amount)}
                        </span>

                        <span
                          aria-hidden={true}
                          className={cn(
                            "ListItemSeparator",
                            "absolute inset-x-0 bottom-0 translate-y-1/2 border-b border-b-separator-opaque opacity-30 mix-blend-color-dodge group-data-[focus-visible=true]/ListItem:hidden",
                            // Hide separater for the last item
                            txnIdx === transactions.length - 1 && "hidden"
                          )}
                        />
                      </div>
                    </ListBoxItem>
                  )
                })}
              </ListBoxSection>
            )
          })}
          <ListBoxLoadMoreItem
            isLoading={isLoading}
            onLoadMore={() => loadMore(10)}
          />
        </ListBox>
      </Virtualizer>

      <ListEndMessage visible={status === "Exhausted"} />
    </>
  )
}
