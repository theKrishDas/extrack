"use client"

import { useQuery } from "convex-helpers/react/cache"
import { endOfToday, startOfDay, subDays } from "date-fns"
import useMeasure from "react-use-measure"
import { api } from "#/convex/_generated/api"
import { Spinner } from "@/components/loading/spinner"
import { buildDailyBalanceTimeline } from "./build-daily-balance-timeline"
import { Chart, type ChartData } from "./chart"

export function BalanceTrend() {
  const lookBackDays = 29 as const

  const [containerRef, bound] = useMeasure()

  // --- dates ---
  const rangeEndDate = endOfToday()
  const rangeStartDate = startOfDay(subDays(rangeEndDate, lookBackDays))

  // --- backend calls ---
  const transactions = useQuery(api.transaction.listByTimeframe, {
    start: rangeStartDate.getTime(),
    end: rangeEndDate.getTime(),
  })
  const balance = useQuery(api.account.getBalance, { account: "*" })

  if (!(transactions && balance))
    return (
      <div className="h-52 w-full p-4">
        <Spinner />
      </div>
    )

  const data: ChartData[] = buildDailyBalanceTimeline({
    balanceAsOf: balance,
    lookbackDays: lookBackDays,
    transactions,
  })

  return (
    <div className="h-52 w-full" ref={containerRef}>
      <Chart bound={{ height: bound.height, width: bound.width }} data={data} />
    </div>
  )
}
