"use client"

import { eachDayOfInterval, endOfToday, startOfDay, subDays } from "date-fns"
import useMeasure from "react-use-measure"
import { Chart, type ChartData } from "./chart"

export function BalanceTrend() {
  const [containerRef, bound] = useMeasure()

  const rangeEndDate = endOfToday()
  const rangeStartDate = startOfDay(subDays(rangeEndDate, 3)) // TODO: Make it 29 (30 days)
  const dateRange = eachDayOfInterval({
    start: rangeStartDate,
    end: rangeEndDate,
  })

  // TODO: Remove dummy data before shipping
  const data = dateRange.map((date) => {
    return {
      date,
      value: Math.round(Math.random() * 100),
    }
  }) satisfies ChartData[]

  return (
    <div className="h-52 w-full" ref={containerRef}>
      <Chart bound={{ height: bound.height, width: bound.width }} data={data} />
    </div>
  )
}
