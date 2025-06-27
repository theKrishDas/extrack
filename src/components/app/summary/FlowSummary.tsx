"use client"

import {useState} from "react"
import NumberFlow from "@number-flow/react"
import {api} from "#/convex/_generated/api"
import {useQuery} from "convex/react"
import {FunctionReturnType} from "convex/server"
import {
  eachDayOfInterval,
  endOfDay,
  format,
  startOfDay,
  startOfToday,
  subDays,
} from "date-fns"
import {Bar, BarChart, CartesianGrid, Cell, XAxis} from "recharts"
import z from "zod"

import {CURRENCY} from "@/lib/date-utils"
import {cn} from "@/lib/utils"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const FlowSummary = () => {
  /**
   * Getting the right dates for the timeframes
   */
  const today = startOfToday()
  const twoWeeksAgo = subDays(today, 7)
  const timeframes = eachDayOfInterval({start: twoWeeksAgo, end: today})
  const timeframesInNumber = timeframes.map(f => ({
    start: startOfDay(f).getTime(),
    end: endOfDay(f).getTime(),
  }))

  /**
   * Convex call to get the summary
   */
  const summary = useQuery(api.summary.getTransactionSummaryByTimeframe, {
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
  data: FunctionReturnType<typeof api.summary.getTransactionSummaryByTimeframe>
}) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)

  /**
   * Create chart data from the data
   */
  const chartData = data.byFrames.map(d => ({
    date: d.timeframe.start,
    total: d.breakdown.totalFlow,
    income: d.breakdown.incomeAmount,
    expense: d.breakdown.expenseAmount,
  }))
  const chartConfig = {
    total: {
      label: "Total",
      color: "var(--ios-red)",
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

  const metrics: Record<string, number>[] = [
    {
      Spent: activeIndex
        ? chartData[activeIndex].expense
        : data.breakdown.expenseAmount,
    },
    {
      Earned: activeIndex
        ? chartData[activeIndex].income
        : data.breakdown.incomeAmount,
    },
    {
      "Net Flow": activeIndex
        ? chartData[activeIndex].total
        : data.breakdown.netFlow,
    },
  ]

  return (
    // TODO: Use Box component here
    <div className="bg-fill-quaternary rounded-2xl px-4.5 py-4">
      <div className="">
        <p className="text-label-tertiary text-sm">
          Cash flow in past {chartData.length} days
        </p>
      </div>

      {/* TODO: Use Separator component here */}
      <div className="border-b-separator-opaque mt-3 mb-4 w-full border-b-1 mix-blend-color-dodge" />

      <div className="grid grid-cols-3 md:grid-cols-5">
        {metrics.map((item, idx) => {
          const [[key, value]] = Object.entries(item)
          return (
            <div className="" key={idx}>
              <p className="flex w-full flex-col truncate">
                <span className="text-label-secondary text-sm leading-5.5">
                  {key}
                </span>

                <NumberFlow
                  format={{
                    style: "currency",
                    currency: CURRENCY,
                    trailingZeroDisplay: "stripIfInteger",
                  }}
                  className="overflow-hidden text-lg font-semibold whitespace-nowrap"
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
            data={chartData}
            barCategoryGap="35%"
            onClick={state => {
              if (state?.activeTooltipIndex === undefined) return

              const index = z
                .string()
                .transform(v => parseInt(v))
                .parse(state.activeIndex)

              // Toggle selection
              setActiveIndex(prev => (prev === index ? undefined : index))
            }}
          >
            <ChartTooltip
              content={
                <ChartTooltipContent className="hidden" indicator="line" />
              }
            />
            <CartesianGrid
              vertical={false}
              strokeWidth={0.5}
              strokeDasharray="1 3"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              className="select-none"
              tickFormatter={value => format(value, "EEEEE")}
            />
            <Bar dataKey="total" radius={5}>
              {chartData.map((_, idx) => {
                const isActive =
                  activeIndex === undefined || idx === activeIndex

                return (
                  <Cell
                    key={`cell-${idx}`}
                    className={cn(isActive ? "opacity-100" : "opacity-60")}
                    fill={
                      isActive ? "var(--color-total)" : "var(--fill-secondary)"
                    }
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
