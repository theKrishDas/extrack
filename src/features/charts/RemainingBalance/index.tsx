"use client"

import { useNumberFormatter } from "react-aria"
import useMeasure from "react-use-measure"
import { Chart, type ChartData } from "./chart"

export function SpendingPace() {
  const [containerRef, bound] = useMeasure()
  const formatter = useNumberFormatter({
    style: "percent",
  })

  const usage = Math.random() // TODO: Replace dummy data before shipping
  const percentage = formatter.format(usage)

  return (
    <div className="supports-[corner-shape:squircle]:corner-squircle w-full rounded-3xl bg-background-primary-elevated p-4 shadow-ios-md supports-[corner-shape:squircle]:rounded-4xl">
      <p className="mb-3 font-medium text-lg">
        {percentage} of your income left this month
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
