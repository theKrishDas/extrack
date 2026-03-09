"use client"

import { useQuery } from "convex/react"
import type { FunctionReturnType } from "convex/server"
import {
  eachDayOfInterval,
  endOfDay,
  endOfWeek,
  format,
  isToday,
  startOfDay,
  startOfToday,
  startOfWeek,
} from "date-fns"
import { type ReactNode, useState } from "react"
import { Button } from "react-aria-components"
import { api } from "#/convex/_generated/api"
import { formatTransactionSummary } from "#/convex/lib/utils"
import Bar from "@/components/ui/bar"
import { useCurrencyFormatter } from "@/hooks/useCurrencyFormatter"
import { cn } from "@/lib/utils"

const TransactionSummary = () => {
  /*
   * Getting the right dates for the timeframes
   */
  // TODO: Remove the override controle when testing is done
  const today = startOfToday()
  const frameStart = startOfWeek(today)
  const frameEnd = endOfWeek(today)
  const timeframes = eachDayOfInterval({ start: frameStart, end: frameEnd })
  const timeframesInNumber = timeframes.map((f) => ({
    start: startOfDay(f).getTime(),
    end: endOfDay(f).getTime(),
  }))

  /*
   * Using those dates get the summary
   */
  const todaysIndex = timeframesInNumber.findIndex(
    (v) => v.start === startOfDay(today).getTime()
  )
  const [showingSubBreakdown, setShowingSubBreakdown] = useState(false)
  const [activeIndex, setActiveIndex] = useState(todaysIndex)
  const summary = useQuery(api.analytics.getFlowSummary, {
    timeframes: timeframesInNumber,
    accounts: [],
  })

  if (!summary) return <p>Loading transaction summary...</p>

  /*
   * Using the util function to format the sub-summary
   */
  const subSummary = formatTransactionSummary([
    {
      transactions: summary.byFrames[activeIndex].transactions,
      timeframe: summary.byFrames[activeIndex].timeframe,
    },
  ])

  return (
    <div className="rounded-[0.95rem] bg-fill-quaternary pl-4">
      <Overview summary={showingSubBreakdown ? subSummary : summary} />
      <Bars
        onBarClick={(idx) => {
          setActiveIndex(idx === activeIndex ? todaysIndex : idx)
          setShowingSubBreakdown((v) => (idx === activeIndex ? !v : true))
        }}
        setActive={(idx) => idx === activeIndex}
        showingSubBreakdown={showingSubBreakdown}
        summary={summary}
      />
      {/* <Details /> */}
    </div>
  )
}

const Overview = ({
  summary,
}: {
  summary: FunctionReturnType<typeof api.analytics.getFlowSummary>
}) => {
  const { netFlow, expenseAmount, incomeAmount } = summary.breakdown
  const formatter = useCurrencyFormatter()

  const Stats = ({
    label,
    value,
    icon,
    span = 2,
  }: {
    label: string
    value: string | number
    icon?: ReactNode
    span?: number
  }) => {
    return (
      <div
        className="w-full"
        style={{
          gridColumn: `span ${span} / span ${span}`,
        }}
      >
        <div className="inline-flex w-full flex-col">
          <span className="font-medium text-label-secondary text-sm">
            {label}
          </span>
          <div className="flex items-center gap-1">
            <span className="font-bold text-label-primary">{value}</span>
            {icon}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-8 gap-2 pr-4">
      <Stats label={"Spent"} value={formatter.format(expenseAmount)} />
      <Stats label={"Earned"} value={formatter.format(incomeAmount)} />
      <Stats label={"Net Flow"} span={3} value={formatter.format(netFlow)} />
    </div>
  )
}

const Bars = ({
  summary,
  onBarClick,
  setActive,
  showingSubBreakdown,
}: {
  summary: FunctionReturnType<typeof api.analytics.getFlowSummary>
  onBarClick?: (idx: number) => void
  setActive: (idx: number) => boolean
  showingSubBreakdown: boolean
}) => {
  const { breakdown, byFrames } = summary
  const { highestFlow } = breakdown

  function formatPercentage(arg: number): number {
    const num = Math.floor(arg)

    if (num > 0 && num < 5) return 3

    const remainder = num % 5

    if (remainder === 0) {
      return num
    }
    if (remainder <= 2) {
      return num - remainder
    }
    return num + (5 - remainder)
  }

  return (
    <div
      className="grid gap-2 pr-4"
      style={{
        gridTemplateColumns: `repeat(${byFrames.length}, 1fr)`,
      }}
    >
      {byFrames.map((frame, idx) => {
        const { timeframe, breakdown } = frame
        const { totalFlow, expenseAmount } = breakdown
        const flowPercentage = (totalFlow / highestFlow) * 100
        const expensePercentage = (expenseAmount / totalFlow) * 100
        const today = isToday(timeframe.start)
        const isActive = setActive(idx)

        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: it is fine to use it here
          <div className="flex flex-col items-center justify-end" key={idx}>
            <Button
              className={cn(
                "relative flex h-30 w-full select-none flex-col justify-end overflow-hidden rounded-md outline-none",
                showingSubBreakdown && isActive && "bg-fill-quaternary"
              )}
              onPress={() => onBarClick?.(idx)}
            >
              <Bar
                className={cn(
                  "flex flex-col justify-end overflow-hidden rounded-[0.3em] bg-fill-secondary",
                  showingSubBreakdown && isActive && "bg-fill-primary",
                  showingSubBreakdown && !isActive && "opacity-18"
                )}
                size={formatPercentage(flowPercentage)}
              >
                <Bar
                  // size={isActive ? formatPercentage(expensePercentage) : 0}
                  className="bg-ios-red transition-normal duration-250"
                  size={formatPercentage(expensePercentage)}
                />
              </Bar>
            </Button>

            <time
              className={cn(
                "pointer-events-none inline-grid h-6 w-6 select-none place-content-center rounded-full font-medium text-label-secondary text-xs uppercase leading-0",
                today &&
                  "font-extrabold text-ios-red mix-blend-plus-darker dark:mix-blend-plus-lighter"
              )}
            >
              {format(timeframe.start, "EEEEE")}
            </time>
          </div>
        )
      })}
    </div>
  )
}

export default TransactionSummary
