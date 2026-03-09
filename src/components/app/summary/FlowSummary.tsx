"use client"

import NumberFlow from "@number-flow/react"
import { useQuery } from "convex/react"
import type { FunctionReturnType } from "convex/server"
import {
  eachDayOfInterval,
  endOfDay,
  format,
  isToday,
  startOfDay,
  startOfToday,
  subDays,
} from "date-fns"
import { useState } from "react"
import { Bar, BarChart, CartesianGrid, Cell, XAxis } from "recharts"
import z from "zod"
import { api } from "#/convex/_generated/api"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { CURRENCY } from "@/lib/date-utils"
import { cn } from "@/lib/utils"

const FlowSummary = () => {
  /**
   * Getting the right dates for the timeframes
   */
  const today = startOfToday()
  const twoWeeksAgo = subDays(today, 7)
  const timeframes = eachDayOfInterval({ start: twoWeeksAgo, end: today })
  const timeframesInNumber = timeframes.map((f) => ({
    start: startOfDay(f).getTime(),
    end: endOfDay(f).getTime(),
  }))

  /**
   * Convex call to get the summary
   */
  const summary = useQuery(api.analytics.getFlowSummary, {
    timeframes: timeframesInNumber,
    accounts: [],
  })

  /**
   * Render
   */
  if (!summary) return <p>Loading charts...</p>

  return <Summary data={summary} />
}

const Summary = ({
  data,
}: {
  data: FunctionReturnType<typeof api.analytics.getFlowSummary>
}) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)
  const isDaySelected = activeIndex !== undefined

  /**
   * Create chart data from the data
   */
  const chartData = data.byFrames.map((d) => ({
    date: d.timeframe.start,
    total: d.breakdown.totalFlow,
    net: d.breakdown.netFlow,
    income: d.breakdown.incomeAmount,
    expense: d.breakdown.expenseAmount,
  }))
  const chartConfig = {
    total: {
      label: "Total",
      color: "var(--ios-blue)",
    },
    expense: {
      label: "Expense",
      color: "var(--ios-red)",
    },
    income: {
      label: "Income",
      color: "var(--ios-green)",
    },
  } satisfies ChartConfig
  const activeChartData = isDaySelected ? chartData[activeIndex] : undefined

  const metrics: Record<string, number>[] = [
    {
      Spent: activeChartData?.expense ?? data.breakdown.expenseAmount,
    },
    {
      Earned: activeChartData?.income ?? data.breakdown.incomeAmount,
    },
    {
      "Net Flow": activeChartData?.net ?? data.breakdown.netFlow,
    },
  ]

  const timeDescription = (() => {
    const dateToCheck =
      isDaySelected && activeChartData?.date
        ? new Date(activeChartData.date)
        : undefined

    if (!dateToCheck) {
      return `in past ${chartData.length} days`
    }
    if (isToday(dateToCheck)) {
      return "Today"
    }
    return `on ${format(dateToCheck, "EEEE")}`
  })()

  return (
    // TODO: Use Box component here
    <div className="rounded-2xl bg-fill-quaternary px-4.5 py-4">
      <div className="">
        <p className="text-label-tertiary text-sm">
          Cash flow {timeDescription}
        </p>
      </div>

      {/* TODO: Use Separator component here */}
      <div className="mt-3 mb-4 w-full border-b border-b-separator-opaque mix-blend-color-dodge" />

      <div className="grid grid-cols-3 md:grid-cols-5">
        {metrics.map((item) => {
          const [[key, value]] = Object.entries(item)
          return (
            <div className="" key={key}>
              <p className="flex w-full flex-col truncate">
                <span className="text-label-secondary text-sm leading-5.5">
                  {key}
                </span>

                <NumberFlow
                  className="overflow-hidden whitespace-nowrap font-semibold text-lg"
                  format={{
                    style: "currency",
                    currency: CURRENCY,
                    trailingZeroDisplay: "stripIfInteger",
                  }}
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to right, black 80%, transparent 96%)",
                    maskImage:
                      "linear-gradient(to right, black 80%, transparent 96%)",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                  }}
                  value={value}
                />
              </p>
            </div>
          )
        })}
      </div>

      <div className="mt-6 w-full">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            barCategoryGap="35%"
            data={chartData}
            onClick={(state) => {
              if (state?.activeTooltipIndex === undefined) return

              const index = z
                .string()
                .transform((v) => Number.parseInt(v, 10))
                .parse(state.activeIndex)

              // Toggle selection
              setActiveIndex((prev) => (prev === index ? undefined : index))
            }}
          >
            <ChartTooltip
              content={
                <ChartTooltipContent className="hidden" indicator="line" />
              }
            />
            <CartesianGrid
              strokeDasharray="1 3"
              strokeWidth={0.5}
              vertical={false}
            />
            <XAxis
              axisLine={false}
              className="select-none"
              dataKey="date"
              tickFormatter={(value) => format(value, "EEEEE")}
              tickLine={false}
              tickMargin={8}
            />
            <Bar dataKey="total" radius={5}>
              {chartData.map((_, idx) => {
                const isHighlighted = !isDaySelected || idx === activeIndex

                return (
                  <Cell
                    className={cn(isHighlighted ? "opacity-100" : "opacity-60")}
                    fill={
                      isHighlighted
                        ? "var(--color-total)"
                        : "var(--fill-secondary)"
                    }
                    key={`cell-${_.date}`}
                  />
                )
              })}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}

export default FlowSummary
