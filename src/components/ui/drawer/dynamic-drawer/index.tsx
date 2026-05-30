"use client"

import { AnimatePresence, motion, useAnimate } from "motion/react"
import {
  type ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { MdClose } from "react-icons/md"
import useMeasure from "react-use-measure"
import { Button } from "@/components/ui/button"
import { Drawer } from "@/components/ui/drawer/base-ui-drawer"
import { useControllableState } from "@/hooks/useControllableState"

type LevelRenderProps<T extends string> = {
  navigate: (key: T) => void
  back: () => void
  close: () => void
}

type LevelConfig<T extends string> = {
  content: (props: LevelRenderProps<T>) => ReactElement
  showClose?: boolean
  title: string
}

export type DynamicDrawerProps<T extends string> = {
  trigger?: ReactElement
  initialLevel: T
  levels: Record<T, LevelConfig<T>>
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * Renders a drawer with navigable levels and animated content transitions.
 *
 * @experimental
 * Import as `{ ExperimentalDynamicDrawer as DynamicDrawer }`.
 *
 * @fix Define the fallback when history contains only a non-initial level.
 * @fix Ensure `initialLevel` is always the first history entry.
 */
export function ExperimentalDynamicDrawer<T extends string>({
  trigger,
  initialLevel,
  levels,
  ...rest
}: DynamicDrawerProps<T>) {
  const initialHistoryRef = useRef<T[]>([initialLevel])
  const initialHistory = initialHistoryRef.current
  const defaultOpen = rest.defaultOpen ?? false

  const [open, setOpen] = useControllableState(
    rest.open,
    defaultOpen,
    rest.onOpenChange
  )
  const [history, setHistory] = useState<T[]>(initialHistory)

  const [scope, animate] = useAnimate()
  const [ref, { height }] = useMeasure({ offsetSize: true })
  const shouldAnimateHeight = useRef<boolean>(false)

  const activeLevel = history.at(-1) ?? initialLevel

  const { content, showClose, title: drawerTitle } = levels[activeLevel]

  const resetHistory = useCallback(
    () => setHistory(initialHistoryRef.current),
    []
  )

  const close = () => setOpen(false)

  const back = () =>
    setHistory((prev) => {
      // Prevents (no-op) `back()` on initialLevel
      const currentLevel = prev.at(-1)
      if (currentLevel === initialLevel) return prev // no-op

      shouldAnimateHeight.current = true
      return prev.slice(0, -1)
    })

  const navigate = (key: T) =>
    setHistory((prev) => {
      // reset history when navigating to initial level
      if (key === initialLevel) {
        // Avoid unnecessary update if already at initial state
        if (prev.length === 1 && prev[0] === initialLevel) return prev
        return initialHistory
      }

      const currentLevel = prev.at(-1)
      if (currentLevel === key) return prev // no-op

      shouldAnimateHeight.current = true

      const historyWithoutLevel = prev.filter((item) => item !== key)
      return [...historyWithoutLevel, key]
    })

  const renderProps: LevelRenderProps<T> = { back, close, navigate }

  const handleCloseComplete = useCallback(
    (open: boolean) => {
      if (!open) {
        resetHistory()
        shouldAnimateHeight.current = false
      }
    },
    [resetHistory]
  )

  useEffect(() => {
    const element = scope.current
    if (!(shouldAnimateHeight.current || element) || height === 0) return
    animate(
      scope.current,
      { height },
      { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
    )
  }, [animate, height, scope])

  return (
    <Drawer.Root
      onOpenChange={setOpen}
      onOpenChangeComplete={handleCloseComplete}
      open={open}
    >
      <Drawer.Trigger render={trigger} />
      <Drawer.Content
        className="relative h-(--drawer-content-height) overflow-hidden"
        ref={scope}
        style={
          {
            "--drawer-content-height": `${height}px`,
          } as React.CSSProperties
        }
      >
        <Drawer.Title className="sr-only">{drawerTitle}</Drawer.Title>

        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            animate="visible"
            className="--dynamic-drawer-motion-div absolute inset-x-0 top-0 h-fit"
            exit="hidden"
            initial="hidden"
            key={activeLevel}
            ref={ref}
            transition={{
              duration: 0.25,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            variants={{
              visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
              hidden: { opacity: 0, scale: 0.97, filter: "blur(2px)" },
            }}
          >
            {content(renderProps)}
          </motion.div>
        </AnimatePresence>

        {showClose && (
          <Button
            className="absolute top-0 right-4"
            color="gray"
            isIconOnly
            onPress={close}
            size="sm"
          >
            <MdClose size={20} />
          </Button>
        )}
      </Drawer.Content>
    </Drawer.Root>
  )
}
