"use client"

import {ReactNode} from "react"
import {Icon} from "@iconify/react"
import {useNumberFormatter} from "@react-aria/i18n"
import {api} from "#/convex/_generated/api"
import {useQuery} from "convex/react"
import {FunctionReturnType} from "convex/server"
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
import {Button} from "react-aria-components"

import {CURRENCY} from "@/lib/date-utils"
import {cn} from "@/lib/utils"

const TransactionSummary = () => {
  const today = startOfToday()
  const frameStart = startOfWeek(today)
  const frameEnd = endOfWeek(today)
  const timeframes = eachDayOfInterval({start: frameStart, end: frameEnd})
  const timeframesInNumber = timeframes.map(f => ({
    start: startOfDay(f).getTime(),
    end: endOfDay(f).getTime(),
  }))

  const summary = useQuery(api.summary.getTransactionSummaryByTimeframe, {
    timeframes: timeframesInNumber,
    accounts: [],
  })

  if (!summary) return <p>Loading transaction summary...</p>
  console.clear()
  console.info("summary:", summary)

  return (
    <>
      <div className="bg-fill-quaternary rounded-[0.95rem] pl-4">
        <Overview summary={summary} />
        <Bars summary={summary} />
        {/* <Details /> */}
      </div>
    </>
  )
}

const Overview = ({
  summary,
}: {
  summary: FunctionReturnType<
    typeof api.summary.getTransactionSummaryByTimeframe
  >
}) => {
  const {netFlow, expenseAmount, incomeAmount} = summary.breakdown
  const formatter = useNumberFormatter({
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 0,
  })

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
      <div className={cn("w-full", `col-span-${span}`)}>
        <div className="inline-flex w-full flex-col">
          <span className="text-label-secondary text-sm font-medium">
            {label}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-label-primary font-bold">{value}</span>
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
      <Stats
        label={"Net Flow"}
        value={formatter.format(netFlow)}
        span={3}
        icon={
          <Icon
            icon={netFlow < 0 ? "ion:ios-trending-down" : "ion:ios-trending-up"}
            className={cn(
              "text-[1em] font-bold",
              netFlow < 0 ? "text-ios-red" : "text-ios-green"
            )}
          />
        }
      />
    </div>
  )
}

const Bars = ({
  summary,
  onBarClick,
}: {
  summary: FunctionReturnType<
    typeof api.summary.getTransactionSummaryByTimeframe
  >
  onBarClick?: (idx: number) => void
}) => {
  const {breakdown, byFrames} = summary
  const {totalFlow} = breakdown

  return (
    <div
      className="grid gap-2 pr-4"
      style={{
        gridTemplateColumns: `repeat(${byFrames.length}, 1fr)`,
      }}
    >
      {byFrames.map((frame, idx) => {
        const {timeframe, breakdown} = frame
        const {totalFlow: totalFlowInFrame, expenseAmount} = breakdown
        const flowPercentage = (totalFlowInFrame / totalFlow) * 100
        const expensePercentage = (expenseAmount / totalFlow) * 100
        const today = isToday(timeframe.start)
        const isActive = today

        const Bar = ({
          barHeight,
          childHeight,
        }: {
          barHeight: number
          childHeight: number
        }) => {
          return (
            <div
              className={cn(
                "pointer-events-none flex w-full flex-col justify-end overflow-hidden rounded-md",
                isActive ? "bg-fill-primary" : "bg-fill-tertiary"
              )}
              style={{
                height: `${barHeight}%`,
              }}
            >
              {isActive && (
                <div
                  className="bg-ios-red w-full rounded-t-[0.2em]"
                  style={{height: `${childHeight}%`}}
                />
              )}
            </div>
          )
        }

        return (
          <Button
            className="flex h-30 w-full flex-col items-center justify-end outline-none select-none"
            key={idx}
            onPress={() => onBarClick?.(idx)}
          >
            <Bar barHeight={flowPercentage} childHeight={expensePercentage} />
            <time
              className={cn(
                "text-label-secondary pointer-events-none inline-grid h-6 w-6 place-content-center rounded-full text-xs leading-0 font-medium uppercase",
                today &&
                  "text-ios-red font-extrabold mix-blend-plus-darker dark:mix-blend-plus-lighter"
              )}
            >
              {format(timeframe.start, "EEEEE")}
            </time>
          </Button>
        )
      })}
    </div>
  )
}

export default TransactionSummary
