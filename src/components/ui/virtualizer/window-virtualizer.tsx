import type {
  ReactVirtualizerOptions,
  VirtualItem,
} from "@tanstack/react-virtual"
import { useWindowVirtualizer } from "@tanstack/react-virtual"
import { useEffect, useRef } from "react"

/**
 * Userland options for `useWindowVirtualizer`.
 *
 * We intentionally omit the low-level wiring that the hook already provides for
 * window scrolling (scroll element + observers + scrollTo impl).
 */
type VirtualizerOptions = Omit<
  ReactVirtualizerOptions<Window, Element>,
  | "getScrollElement"
  | "observeElementRect"
  | "observeElementOffset"
  | "scrollToFn"
>

export interface WindowVirtProps {
  opts: VirtualizerOptions
  renderItem: (props: { index: number; count: number }) => React.ReactNode
  headers?: {
    indexes: Set<number>
    renderHeader: (index: number) => React.ReactNode
  }
  infinite?: {
    hasMore: boolean
    isLoading: boolean
    onLoadMore: () => void
    renderLoader: () => React.ReactNode
  }
}

/**
 * Window-scrolling virtual list.
 *
 * This renders a single "inner" element sized to the total virtual height and
 * absolutely positions only the currently virtualized items within it (the
 * standard TanStack Virtual layout strategy).
 */
export function WindowVirtualizer({
  opts,
  renderItem,
  infinite,
  headers,
}: WindowVirtProps) {
  const hasMore = infinite?.hasMore ?? false
  const isLoading = infinite?.isLoading ?? false
  const onLoadMore = infinite?.onLoadMore

  // Infinite mode adds a sentinel "loader row" at the end of the list.
  // That row lives at index === opts.count (one past the last real item).
  const count = hasMore ? opts.count + 1 : opts.count
  const virtualizer = useWindowVirtualizer({ ...opts, count })
  const virtualItems = virtualizer.getVirtualItems()
  const lastVirtualIndex = virtualItems.at(-1)?.index ?? -1

  const getContent = (vItem: VirtualItem) => {
    // Loader row sentinel (see `count` above).
    if (vItem.index >= opts.count) {
      return hasMore ? infinite?.renderLoader() : null
    }
    if (headers?.indexes.has(vItem.index)) {
      return headers.renderHeader(vItem.index)
    }
    return renderItem({ index: vItem.index, count: opts.count })
  }

  const lastRequestedCountRef = useRef<number | null>(null)

  useEffect(() => {
    if (!(onLoadMore && hasMore && !isLoading)) return
    // If count increased, allow next request cycle
    if (
      lastRequestedCountRef.current !== null &&
      opts.count > lastRequestedCountRef.current
    ) {
      lastRequestedCountRef.current = null
    }
    if (lastVirtualIndex === -1) return
    const isNearEnd = lastVirtualIndex >= opts.count - 1
    if (!isNearEnd) return
    // Already requested for this count snapshot
    if (lastRequestedCountRef.current === opts.count) return
    lastRequestedCountRef.current = opts.count
    onLoadMore()
  }, [lastVirtualIndex, opts.count, hasMore, isLoading, onLoadMore])

  return (
    <div
      style={{
        height: virtualizer.getTotalSize(),
        width: "100%",
        position: "relative",
      }}
    >
      {virtualItems.map((vItem) => (
        <div
          key={vItem.key}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: vItem.size,
            // `scrollMargin` shifts the virtual coordinate origin (e.g. for a
            // fixed header above a window virtualizer). Adjust the transform so
            // items still land in the correct visual position.
            transform: `translateY(${vItem.start - (virtualizer.options.scrollMargin ?? 0)}px)`,
          }}
        >
          {getContent(vItem)}
        </div>
      ))}
    </div>
  )
}
