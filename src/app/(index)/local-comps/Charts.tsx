import {useState} from "react"
import {_api} from "@iconify/react/dist/iconify.cjs"
import {useNumberFormatter} from "@react-aria/i18n"
import {api} from "#/convex/_generated/api"
import {FunctionReturnType} from "convex/server"
import {format} from "date-fns"
import {IoArrowDown, IoArrowUp} from "react-icons/io5"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {TooltipIndex} from "recharts/types/state/tooltipSlice"
import z from "zod"

import {CURRENCY} from "@/lib/date-utils"
import {cn} from "@/lib/utils"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export default function Component({
  data: rawData,
}: {
  data: FunctionReturnType<typeof api.summary.getTransactionSummaryByTimeframe>
}) {
  const data = rawData.byFrames.map(d => ({
    date: d.timeframe.start,
    total: d.breakdown.totalFlow,
    income: d.breakdown.incomeAmount,
    expense: d.breakdown.expenseAmount,
  }))
  const chartConfig = {
    total: {
      label: "Total",
      color: "var(--ios-blue)",
    },
  } satisfies ChartConfig

  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)
  const formatter = useNumberFormatter({
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 0,
  })

  const display: Record<string, number>[] = [
    {
      Spent: activeIndex
        ? data[activeIndex].expense
        : rawData.breakdown.expenseAmount,
    },
    {
      Earned: activeIndex
        ? data[activeIndex].income
        : rawData.breakdown.incomeAmount,
    },
    {
      "Net Flow": activeIndex
        ? data[activeIndex].total
        : rawData.breakdown.netFlow,
    },
  ]

  return (
    <>
      <div className="bg-fill-quaternary my-5 rounded-2xl p-4">
        <div className="">
          <p className="text-label-secondary text-sm">
            Transactions in past {data.length} days
          </p>
        </div>
        <div className="mt-6 mb-4 w-full">
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={data}
              // data={chartData}
              barCategoryGap="35%"
              onClick={state => {
                if (state?.activeTooltipIndex === undefined) return

                const index = z
                  .string()
                  .transform(v => parseInt(v))
                  .parse(state.activeIndex)

                console.clear()
                console.info("index:", index)
                console.info("activeIndex:", activeIndex)

                setActiveIndex(prev => (prev === index ? undefined : index)) // Toggle selection
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
                tickFormatter={value => format(value, "EEEEE")}
              />
              <Bar dataKey="total" radius={5}>
                {data.map((_, idx) => {
                  const isActive =
                    activeIndex === undefined || idx === activeIndex

                  return (
                    <Cell
                      key={`cell-${idx}`}
                      className={cn(isActive ? "opacity-100" : "opacity-60")}
                      fill={
                        isActive
                          ? "var(--color-total)"
                          : "var(--fill-secondary)"
                      }
                    />
                  )
                })}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4">
          {display.map((item, idx) => {
            const [[key, value]] = Object.entries(item)
            return (
              <div className="" key={idx}>
                <p className="grid w-full grid-rows-2 truncate [&_span]:leading-5.5">
                  <span className="text-sm">{key}</span>
                  <span
                    className="text-label-secondary overflow-hidden text-lg font-bold tracking-tight whitespace-nowrap ring"
                    style={{
                      WebkitMaskImage:
                        "linear-gradient(to right, black 80%, transparent 96%)",
                      maskImage:
                        "linear-gradient(to right, black 80%, transparent 96%)",
                      WebkitMaskRepeat: "no-repeat",
                      maskRepeat: "no-repeat",
                    }}
                  >
                    {formatter.format(value)}
                  </span>
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
