"use client"

import { useQuery } from "convex-helpers/react/cache"
import { eachDayOfInterval, endOfToday, startOfDay, subDays } from "date-fns"
import useMeasure from "react-use-measure"
import { api } from "#/convex/_generated/api"
import type { Colors } from "#lib/constants/colors"
import type { TransactionTypes } from "#lib/constants/transaction-types"
import { Skeleton } from "@/components/ui/loading/skeleton"
import { Spacer } from "@/components/ui/spacer"
import { useCurrencyFormatter } from "@/hooks/useCurrencyFormatter"
import { cn } from "@/lib/utils"
import { Chart, type ChartData } from "./chart"

const types = ["income", "expense"] satisfies TransactionTypes[]

function buildKey(date: string, type: TransactionTypes): string {
  return `${date}:${type}`
}

export function WeeklyAverage() {
  const rangeEndDate = endOfToday()
  const rangeStartDate = startOfDay(subDays(rangeEndDate, 6))
  const dateRange = eachDayOfInterval({
    start: rangeStartDate,
    end: rangeEndDate,
  })

  const transactionsInRange = useQuery(api.transaction.listByTimeframe, {
    start: rangeStartDate.getTime(),
    end: rangeEndDate.getTime(),
  })
  if (!transactionsInRange)
    return (
      <div className="grid h-fit w-full grid-cols-2 gap-2">
        <Skeleton className="corner-squircle aspect-square max-h-44 w-full rounded-3xl shadow-ios-md supports-[corner-shape:squircle]:rounded-4xl" />
        <Skeleton className="corner-squircle aspect-square max-h-44 w-full rounded-3xl shadow-ios-md supports-[corner-shape:squircle]:rounded-4xl" />
      </div>
    )

  /** transactions grouped by date: unique date and transaction-type */
  const map = new Map<ReturnType<typeof buildKey>, number>()
  for (const txn of transactionsInRange) {
    const key = buildKey(new Date(txn.date).toDateString(), txn.type)
    const bucket = map.get(key) ?? 0
    const cents = bucket + txn.amount
    map.set(key, cents)
  }

  const data = types.reduce(
    (acc, type) => {
      const entries: ChartData[] = []
      acc[type] = entries
      for (const date of dateRange) {
        const key = buildKey(date.toDateString(), type)
        const value = map.get(key) ?? 0
        const entry = { date, value }
        entries.push(entry)
      }
      return acc
    },
    {} as Record<TransactionTypes, ChartData[]>
  )

  return (
    <div className="grid grid-cols-2 gap-2">
      <WeeklyAverageCard data={data.expense} type="expense" />
      <WeeklyAverageCard data={data.income} type="income" />
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

  const formatter = useCurrencyFormatter({ maximumFractionDigits: 0 })
  const formattedAverage = formatter.format(average / 100)

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
        <span className="flex items-baseline gap-1">
          <span
            className={cn(
              "w-fit min-w-0 max-w-full truncate text-clip font-semibold text-(--chart-color) text-4xl",
              formattedAverage.length > 4 && "text-2xl",
              formattedAverage.length > 6 && "text-xl"
            )}
          >
            {formattedAverage}
          </span>
          <span> Avg.</span>
        </span>
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
