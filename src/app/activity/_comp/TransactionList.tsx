import type { UsePaginatedQueryReturnType } from "convex/react"
import { useMemo, useRef, useState, useTransition } from "react"
import { Button } from "react-aria-components"
import type { api } from "#/convex/_generated/api"
import { limit } from "#lib/constants/constraints"
import { Spinner } from "@/components/loading/spinner"
import { Emoji } from "@/components/ui/emoji"
import { Spacer } from "@/components/ui/spacer"
import { WindowVirtualizer } from "@/components/ui/virtualizer/window-virtualizer"
import { useCurrencyFormatter } from "@/hooks/useCurrencyFormatter"
import { formatDateGroup } from "@/lib/date-utils"
import { cn, createCollection } from "@/lib/utils"
import { Drawer } from "./Drawer"
import { ListEndMessage } from "./ListEndMessage"

type TransactionPaginatedResult = UsePaginatedQueryReturnType<
  typeof api.transaction.listPaginatedDetailed
>

export function TransactionList({
  transactions: { results: transactions, isLoading, loadMore, status },
}: {
  transactions: TransactionPaginatedResult
}) {
  const hasMore = status === "CanLoadMore" || status === "LoadingMore"

  const flattened = useMemo(() => {
    const collection = createCollection(transactions, "_id", formatDateGroup)
    return flattenCollection(collection)
  }, [transactions])

  const estimateSize = (idx: number) => {
    if (idx === flattened.headerIndexes.values().next().value) return 32 // first header
    if (flattened.headerIndexes.has(idx)) return 56 // rest of the headers
    return 48 // items
  }

  const [, startTransition] = useTransition()

  const [open, setOpen] = useState(false)
  const [activeTxn, setActiveTxn] = useState<
    TransactionPaginatedResult["results"][number] | null
  >(null)
  const parentRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <Drawer onOpenChange={setOpen} open={open} txn={activeTxn} />
      <div className="h-full flex-1" ref={parentRef}>
        <WindowVirtualizer
          headers={{
            indexes: flattened.headerIndexes,
            renderHeader: (index: number) => (
              <Header text={flattened.getHeader(index)} />
            ),
          }}
          infinite={{
            hasMore,
            isLoading,
            onLoadMore: () => loadMore(limit.pagination.transactions.perPage),
            renderLoader: () => <Loader />,
          }}
          opts={{
            count: flattened.items.length,
            overscan: 3,
            estimateSize,
            scrollMargin: parentRef.current?.offsetTop ?? 0,
          }}
          renderItem={({ index, count }: { index: number; count: number }) => {
            const isFirst = flattened.headerIndexes.has(index - 1)
            const isLast =
              flattened.headerIndexes.has(index + 1) || index === count - 1
            const transaction = flattened.getItems(index)

            return (
              <Item
                isFirst={isFirst}
                isLast={isLast}
                onPress={() => {
                  startTransition(() => {
                    setActiveTxn(transaction)
                    setOpen(true)
                  })
                }}
                transaction={transaction}
              />
            )
          }}
        />
      </div>
      <ListEndMessage visible={status === "Exhausted"} />
    </>
  )
}

//
// ─── COMPONENTS ───────────────────────────────────────────────────────────────
//

function Item(props: {
  transaction: TransactionPaginatedResult["results"][number]
  isFirst: boolean
  isLast: boolean
  onPress: () => void
}) {
  const { transaction: txn, isFirst, isLast, onPress } = props
  const formatter = useCurrencyFormatter()

  return (
    <Button
      className={cn(
        "group/ListItem flex h-full w-full select-none items-center bg-fill-quaternary px-4 outline-none",
        "data-hovered:bg-fill-tertiary data-pressed:bg-fill-secondary",
        "supports-[corner-shape:squircle]:corner-squircle",
        isLast &&
          "rounded-b-2xl supports-[corner-shape:squircle]:rounded-b-4xl",
        isFirst &&
          "rounded-t-2xl supports-[corner-shape:squircle]:rounded-t-4xl"
      )}
      onPress={onPress}
    >
      <Emoji
        aria-hidden={true}
        className="mr-3 transition-scale duration-130 group-data-pressed/ListItem:scale-85"
      >
        {txn.category.icon}
      </Emoji>
      <div className="relative flex h-full flex-1 items-center">
        <span className="font-medium transition-scale duration-130 group-data-pressed/ListItem:scale-95">
          {txn.category.name}
        </span>
        <Spacer className="flex-1" />
        <span className="text-right text-label-secondary transition-scale duration-130 group-data-pressed/ListItem:scale-95">
          {formatter.format(txn.amount / 100)}
        </span>

        <span
          aria-hidden={true}
          className={cn(
            "absolute inset-x-0 bottom-0 translate-y-1/2 border-b border-b-separator-opaque opacity-30",
            // Hide separater for the last item
            isLast && "hidden"
          )}
        />
      </div>
    </Button>
  )
}
function Header({ text }: { text: string }) {
  return (
    <span className="pointer-events-none flex h-full select-none items-end truncate px-4 font-medium text-label-tertiary text-sm leading-8">
      {text}
    </span>
  )
}
function Loader() {
  return (
    <div className="flex h-full w-full items-center px-4">
      <Spinner />
    </div>
  )
}

//
// ─── HELPERS ───────────────────────────────────────────────────────────────
//

/**
 * Flattens a collection of items into a list of items and header indexes.
 * @param collection - The collection of items to flatten.
 * @returns A list of items and header indexes.
 */
export function flattenCollection<T>(
  collection: ReturnType<typeof createCollection<T>>
): {
  items: Array<string | T>
  headerIndexes: Set<number>
  getHeader: (idx: number) => string
  getItems: (idx: number) => T
} {
  const groups = collection.group() // [["today", [...]], ["yesterday", [...]]]
  const items: Array<string | T> = []
  const headerIndexes = new Set<number>()

  for (const [header, groupItems] of groups) {
    headerIndexes.add(items.length)
    items.push(header)
    for (const item of groupItems) items.push(item)
  }

  return {
    items,
    headerIndexes,
    getHeader: (i: number) => items[i] as string,
    getItems: (i: number) => items[i] as T,
  }
}
