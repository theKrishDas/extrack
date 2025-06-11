"use client"

import {I18nProvider, useNumberFormatter} from "react-aria"

const timeFrame = "this week"
const totalTransactionsCount = 1830
const percentage = "Over 50% are expenses."

const TransactionSummary = () => {
  const decimalFormatter = useNumberFormatter({
    style: "decimal",
    minimumFractionDigits: 0,
  })
  const formattedTransactionCount = decimalFormatter.format(
    totalTransactionsCount
  )

  return (
    <I18nProvider locale="en-US">
      <div className="bg-fill-quaternary rounded-[0.95rem] p-4 pr-0">
        <div className="flex items-center pr-4">
          <h4 className="flex-1 text-xl leading-loose font-bold">
            <span className="tracking-tighter">
              {formattedTransactionCount}
            </span>{" "}
            <span className="">transactions</span>
          </h4>
          <span className="text-label-tertiary bg-fill-tertiary inline-flex h-6 items-center justify-center rounded-lg px-1.5 text-sm leading-0 font-medium capitalize">
            {timeFrame}
          </span>
        </div>

        <p className="text-label-tertiary pr-4 leading-tight">{percentage}</p>

        <Separator />

        <div className="mb-4 grid grid-cols-7 gap-2 pr-4">
          <TextBlock label="Average" number={360} />
          <TextBlock label="Highest" number={1380} />
          <TextBlock label="Frequent" number={260} />
        </div>

        <div className="grid grid-cols-7 gap-2 pr-4">
          <Bars />
        </div>
      </div>
    </I18nProvider>
  )
}

export default TransactionSummary

const TextBlock = ({label, number}: {label: string; number: number}) => {
  const formatter = useNumberFormatter({
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  })

  return (
    <div className="col-span-2 flex flex-col sm:col-span-1">
      <p className="text-label-secondary text-sm font-medium">{label}</p>
      <p className="text-label-primary font-bold">{formatter.format(number)}</p>
    </div>
  )
}

const Bars = () => {
  return (
    <>
      {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => {
        const height = Math.min(
          100,
          Math.max(5, Math.round(Math.random() * 100 * idx))
        )

        return (
          <div
            className="flex h-30 w-full flex-col items-center justify-end gap-2"
            key={idx}
          >
            <div
              className="bg-fill-primary w-full rounded-[0.5em]"
              style={{
                height: `${height}%`,
              }}
            />
            <span className="text-label-secondary text-xs font-semibold uppercase">
              {day}
            </span>
          </div>
        )
      })}
    </>
  )
}

const Separator = () => (
  <div className="separator bg-separator-non-opaque mt-4 mb-2.5 h-0.5 w-full rounded-full mix-blend-color-burn dark:mix-blend-color-dodge" />
)
