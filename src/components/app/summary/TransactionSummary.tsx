import {api} from "#/convex/_generated/api"
import {useQuery} from "convex/react"
import {FunctionReturnType} from "convex/server"
import {
  eachDayOfInterval,
  endOfDay,
  endOfWeek,
  formatDate,
  isToday,
  startOfDay,
  startOfToday,
  startOfWeek,
} from "date-fns"
import {I18nProvider, useNumberFormatter} from "react-aria"
import {Button} from "react-aria-components"

import {cn} from "@/lib/utils"

const today = startOfToday()
const startOfThisWeek = startOfWeek(today)
const endOfThisWeek = endOfWeek(today)
const timeframes = eachDayOfInterval({
  start: startOfThisWeek,
  end: endOfThisWeek,
})

function percentComparison(args: {percentage: number; label: string}[]) {
  const maxPercentage = Math.max(...args.map(a => a.percentage))
  const objectWithMaxPercentage = args.find(v => v.percentage === maxPercentage)
  if (!objectWithMaxPercentage) throw new Error("Object not found")

  const readablePercentage = Math.round(maxPercentage)

  const overOrUnder = readablePercentage < maxPercentage ? "over" + " " : ""

  return `${overOrUnder}${readablePercentage}% is ${objectWithMaxPercentage.label}`
}

const TransactionSummary = () => {
  const summary = useQuery(api.summary.getTransactionsByTimeframe, {
    timeFrames: timeframes.map(day => ({
      start: startOfDay(day).getTime(),
      end: endOfDay(day).getTime(),
    })),
  })
  const decimalFormatter = useNumberFormatter({
    style: "decimal",
    minimumFractionDigits: 0,
  })

  if (!summary) return <p>Loading...</p>

  const totalTransactions = decimalFormatter.format(
    summary.stats.totalTransactionCount
  )
  const percentageText = percentComparison([
    {
      percentage:
        (summary.overview.expense.count / summary.overview.all.count) * 100,
      label: "expense",
    },
    {
      percentage:
        (summary.overview.income.count / summary.overview.all.count) * 100,
      label: "income",
    },
  ])

  console.clear()
  console.dir(summary)

  return (
    <I18nProvider locale="en-US">
      <div className="bg-fill-quaternary rounded-[0.95rem] p-4 pr-0">
        <div className="flex items-center pr-4">
          <h4 className="flex-1 text-xl leading-loose font-bold">
            <span className="tracking-tighter">{totalTransactions}</span>{" "}
            <span className="tracking-tight">transactions</span>
          </h4>
          <span className="text-label-tertiary bg-fill-tertiary inline-flex h-6 items-center justify-center rounded-lg px-1.5 text-sm leading-0 font-medium capitalize">
            This Week
          </span>
        </div>

        <p className="text-label-tertiary pr-4 leading-tight tracking-tight">
          {percentageText}
        </p>

        <Separator />

        <div className="mb-4 grid grid-cols-7 gap-2 pr-4">
          <TextBlock
            label="Highest"
            number={summary.stats.extremes.highest.amount}
          />
          <TextBlock
            label="Expense"
            number={summary.stats.totalExpenseAmount}
          />
          <TextBlock label="Income" number={summary.stats.totalIncomeAmount} />
        </div>

        <div className="grid grid-cols-7 gap-2 pr-4">
          <Bars summary={summary} />
        </div>
      </div>
    </I18nProvider>
  )
}

export default TransactionSummary

const Bars = ({
  summary,
}: {
  summary: FunctionReturnType<typeof api.summary.getTransactionsByTimeframe>
}) => {
  return (
    <>
      {summary.daily.breakdown.map(({all, expense, timeframe}, idx) => {
        const transactionDate = timeframe.start
        const today = isToday(transactionDate)

        const height =
          (all.count / summary.stats.highestDailyTransactionCount) * 100

        return (
          <div
            className="flex flex-col items-center justify-end gap-2"
            key={idx}
          >
            <div className="relative flex h-30 w-full flex-col justify-end">
              <div
                className={cn(
                  "flex w-full flex-col justify-end overflow-hidden rounded-md",
                  today ? "bg-fill-quaternary" : "bg-fill-primary"
                )}
                style={{
                  height: `${height}%`,
                }}
              >
                {today && (
                  <div
                    className="bg-ios-red w-full"
                    style={{
                      height: `${(expense.count / all.count) * 100}%`,
                    }}
                  />
                )}
              </div>
              <Button className="hover:bg-fill-primary absolute -inset-0.5 rounded-lg mix-blend-color-burn dark:mix-blend-color-dodge" />
            </div>

            <span
              className={cn(
                "text-label-secondary inline-grid h-6 w-6 place-content-center rounded-full text-xs leading-0 font-semibold uppercase",
                today && "bg-ios-red text-label-primary font-bold"
              )}
            >
              {formatDate(timeframe.start, "EEEEE")}
            </span>
          </div>
        )
      })}
    </>
  )
}

const TextBlock = ({label, number}: {label: string; number: number}) => {
  const formatter = useNumberFormatter({
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  })

  return (
    <div className="col-span-2 flex flex-col text-sm tracking-tight sm:col-span-1">
      <p className="text-label-secondary">{label}</p>
      <p className="text-label-primary font-bold">{formatter.format(number)}</p>
    </div>
  )
}

const Separator = () => (
  <div className="separator bg-separator-non-opaque mt-4 mb-2.5 h-0.5 w-full rounded-full mix-blend-color-burn dark:mix-blend-color-dodge" />
)
