"use client"

import {ReactNode, useState} from "react"
import {useNumberFormatter} from "@react-aria/i18n"
import {api} from "#/convex/_generated/api"
import {formatTransactionSummary} from "#/convex/utils"
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
import Bar from "@/components/ui/bar"

const TransactionSummary = () => {
  /*
   * Getting the right dates for the timeframes
   */
  // TODO: Remove the override controle when testing is done
  const today = true ? startOfToday() : startOfDay(new Date(2025, 5, 9))
  const frameStart = startOfWeek(today)
  const frameEnd = endOfWeek(today)
  const timeframes = eachDayOfInterval({start: frameStart, end: frameEnd})
  const timeframesInNumber = timeframes.map(f => ({
    start: startOfDay(f).getTime(),
    end: endOfDay(f).getTime(),
  }))

  /*
   * Using those dates get the summary
   */
  const todaysIndex = timeframesInNumber.findIndex(
    v => v.start === startOfDay(today).getTime()
  )
  const [showingSubBreakdown, setShowingSubBreakdown] = useState(false)
  const [activeIndex, setActiveIndex] = useState(todaysIndex)
  const summary = useQuery(api.summary.getTransactionSummaryByTimeframe, {
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
    <>
      <div className="bg-fill-quaternary rounded-[0.95rem] pl-4">
        <Overview summary={showingSubBreakdown ? subSummary : summary} />
        <Bars
          summary={summary}
          onBarClick={idx => {
            setActiveIndex(idx === activeIndex ? todaysIndex : idx)
            setShowingSubBreakdown(v => (idx === activeIndex ? !v : true))
          }}
          setActive={idx => idx === activeIndex}
          showingSubBreakdown={showingSubBreakdown}
        />
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
      <div
        className="w-full"
        style={{
          gridColumn: `span ${span} / span ${span}`,
        }}
      >
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
      <Stats label={"Net Flow"} value={formatter.format(netFlow)} span={3} />
    </div>
  )
}

const Bars = ({
  summary,
  onBarClick,
  setActive,
  showingSubBreakdown,
}: {
  summary: FunctionReturnType<
    typeof api.summary.getTransactionSummaryByTimeframe
  >
  onBarClick?: (idx: number) => void
  setActive: (idx: number) => boolean
  showingSubBreakdown: boolean
}) => {
  const {breakdown, byFrames} = summary
  const {highestFlow} = breakdown

  function formatPercentage(arg: number): number {
    const num = Math.floor(arg)

    if (num > 0 && num < 5) return 3

    const remainder = num % 5

    if (remainder === 0) {
      return num
    } else if (remainder <= 2) {
      return num - remainder
    } else {
      return num + (5 - remainder)
    }
  }

  return (
    <div
      className="grid gap-2 pr-4"
      style={{
        gridTemplateColumns: `repeat(${byFrames.length}, 1fr)`,
      }}
    >
      {byFrames.map((frame, idx) => {
        const {timeframe, breakdown} = frame
        const {totalFlow, expenseAmount} = breakdown
        const flowPercentage = (totalFlow / highestFlow) * 100
        const expensePercentage = (expenseAmount / totalFlow) * 100
        const today = isToday(timeframe.start)
        const isActive = setActive(idx)

        const Indicator = () => {
          return (
            <span
              className={cn(
                "rounded-[0.5em] mix-blend-plus-darker dark:mix-blend-plus-lighter",
                "absolute -inset-x-0.5 top-0",
                showingSubBreakdown && isActive && "bg-fill-quaternary",
                // Formula for the height:
                // 100% + 2px(tw: 0.5 or 0.125rem) - line-height(1.5rem: changes with font-size)
                "h-[calc(100%+0.125rem-1.5rem)]"
              )}
            />
          )
        }

        return (
          <div key={idx} className="flex flex-col items-center justify-end">
            <Button
              className={cn(
                "relative flex h-30 w-full flex-col justify-end overflow-hidden rounded-md outline-none select-none",
                showingSubBreakdown && isActive && "bg-fill-quaternary"
              )}
              onPress={() => onBarClick?.(idx)}
            >
              <Bar
                size={formatPercentage(flowPercentage)}
                className={cn(
                  "bg-fill-secondary flex flex-col justify-end overflow-hidden rounded-[0.3em]",
                  showingSubBreakdown && isActive && "bg-fill-primary",
                  showingSubBreakdown && !isActive && "opacity-18"
                )}
              >
                <Bar
                  // size={isActive ? formatPercentage(expensePercentage) : 0}
                  size={formatPercentage(expensePercentage)}
                  className="bg-ios-red transition-normal duration-250"
                />
              </Bar>
            </Button>

            <time
              className={cn(
                "text-label-secondary pointer-events-none inline-grid h-6 w-6 place-content-center rounded-full text-xs leading-0 font-medium uppercase select-none",
                today &&
                  "text-ios-red font-extrabold mix-blend-plus-darker dark:mix-blend-plus-lighter"
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
