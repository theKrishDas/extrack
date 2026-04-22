"use client"

import { useQuery } from "convex-helpers/react/cache"
import { endOfMonth, startOfMonth } from "date-fns"
import { useNumberFormatter } from "react-aria"
import useMeasure from "react-use-measure"
import { api } from "#/convex/_generated/api"
import type { TransactionTypes } from "#lib/constants/transaction-types"
import { Skeleton } from "@/components/ui/loading/skeleton"
import { Chart, type ChartData } from "./chart"

export function SpendingPace() {
  const [containerRef, bound] = useMeasure()
  const formatter = useNumberFormatter({
    style: "percent",
  })

  const rangeStartDate = startOfMonth(Date.now())
  const rangeEndDate = endOfMonth(Date.now())

  const transactionsInRange = useQuery(api.transaction.listByTimeframe, {
    start: rangeStartDate.getTime(),
    end: rangeEndDate.getTime(),
  })

  if (!transactionsInRange)
    return (
      <Skeleton className="supports-[corner-shape:squircle]:corner-squircle inline-grid h-26 w-full place-content-center rounded-3xl supports-[corner-shape:squircle]:rounded-4xl" />
    )

  const totals = new Map<TransactionTypes, number>()
  for (const txn of transactionsInRange) {
    const sum = totals.get(txn.type) ?? 0
    totals.set(txn.type, sum + txn.amount)
  }

  const income = totals.get("income") ?? 0
  const expense = totals.get("expense") ?? 0

  const spentRatio = income > 0 ? expense / income : 0
  const usage = Math.min(spentRatio, 1)
  const formattedUsage = formatter.format(spentRatio)

  return (
    <div className="supports-[corner-shape:squircle]:corner-squircle w-full rounded-3xl bg-background-primary-elevated p-4 shadow-ios-md supports-[corner-shape:squircle]:rounded-4xl">
      <p className="mb-3 font-medium text-lg">
        {formattedUsage} of income used this month
      </p>

      <div className="h-8 w-full" ref={containerRef}>
        <Chart
          bound={{ height: bound.height, width: bound.width }}
          percentage={usage satisfies ChartData}
        />
      </div>
    </div>
  )
}
