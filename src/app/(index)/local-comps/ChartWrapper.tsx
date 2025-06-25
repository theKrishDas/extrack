"use client"

import {api} from "#/convex/_generated/api"
import {useQuery} from "convex/react"
import {
  eachDayOfInterval,
  endOfDay,
  startOfDay,
  startOfToday,
  subDays,
} from "date-fns"

import Component from "./Charts"

const ChartWrapper = () => {
  /*
   * Getting the right dates for the timeframes
   */

  const today = startOfToday()
  const twoWeeksAgo = subDays(today, 7)
  const timeframes = eachDayOfInterval({
    start: twoWeeksAgo,
    end: today,
  })
  const timeframesInNumber = timeframes.map(f => ({
    start: startOfDay(f).getTime(),
    end: endOfDay(f).getTime(),
  }))

  const summary = useQuery(api.summary.getTransactionSummaryByTimeframe, {
    timeframes: timeframesInNumber,
    accounts: [],
  })

  if (!summary) return <p>Loading charts...</p>
  console.log(summary)

  return (
    <>
      <Component data={summary} />
    </>
  )
}

export default ChartWrapper
