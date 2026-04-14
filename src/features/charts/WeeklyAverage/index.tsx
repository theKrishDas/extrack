"use client"

import { eachDayOfInterval, endOfToday, startOfDay, subDays } from "date-fns"
import useMeasure from "react-use-measure"
import type { Colors } from "#lib/constants/colors"
import type { TransactionTypes } from "#lib/constants/transaction-types"
import { Spacer } from "@/components/ui/spacer"
import { useCurrencyFormatter } from "@/hooks/useCurrencyFormatter"
import { Chart, type ChartData } from "./chart"

export function WeeklyAverage() {
  const rangeEndDate = endOfToday()
  const rangeStartDate = startOfDay(subDays(rangeEndDate, 6))
  const dateRange = eachDayOfInterval({
    start: rangeStartDate,
    end: rangeEndDate,
  })

  // TODO: Replace dummy data before shipping
  const data = dateRange.map((date) => {
    return { date, value: Math.round(Math.random() * 100) + 8 }
  }) satisfies ChartData[]

  return (
    <div className="grid grid-cols-2 gap-2">
      <WeeklyAverageCard data={data} type="expense" />
      <WeeklyAverageCard data={data} type="income" />
    </div>
  )
}

const WeeklyAverageCard = ({
  data,
  type,
}: {
  data: ChartData[]
  type: TransactionTypes
}) => {
  const [containerRef, bound] = useMeasure()
  const sum = data.reduce((acc, d) => acc + d.value, 0)
  const average = Math.round(sum / data.length)

  const formatter = useCurrencyFormatter()
  const formattedAverage = formatter.format(average)

  const colors = {
    expense: "red",
    income: "green",
  } satisfies Record<TransactionTypes, Exclude<Colors, "gray">>
  const color = colors[type]

  const labels = {
    expense: "Expense",
    income: "Income",
  } satisfies Record<TransactionTypes, string>
  const label = labels[type]

  return (
    <div
      className="supports-[corner-shape:squircle]:corner-squircle inline-flex aspect-square max-h-44 w-full flex-col rounded-3xl bg-background-primary-elevated p-4 shadow-ios-md supports-[corner-shape:squircle]:rounded-4xl"
      style={
        {
          "--chart-color": `var(--ios-${color})`,
        } as React.CSSProperties
      }
    >
      <p className="text-lg leading-none">
        <span className="mb-1 block">{label}</span>
        <span className="inline-block font-semibold text-(--chart-color) text-4xl">
          {formattedAverage}
        </span>{" "}
        <span className="text-base">Avg.</span>
      </p>

      <Spacer className="h-2" />

      <div
        className="min-h-0 w-full flex-1 text-(--chart-color)"
        ref={containerRef}
      >
        <Chart
          bound={{ height: bound.height, width: bound.width }}
          data={data}
        />
      </div>
    </div>
  )
}
