import { ark } from "@ark-ui/react"
import NumberFlow from "@number-flow/react"
import type { TransactionTypes } from "#lib/constants/transaction-types"
import { compactNumberFormatOptions } from "#lib/format"
import { currencyFormatOptions } from "@/hooks/useCurrencyFormatter"
import { cn } from "@/lib/utils"

interface CategoryStatsProps {
  type: TransactionTypes
  transactionCount: number
  amount: number
  isLoading?: boolean
}

export function CategoryStats(props: CategoryStatsProps) {
  const { type, isLoading, transactionCount, amount } = props

  const amountLabel = type === "expense" ? "Amount Spent" : "Amount Earned"
  const typeLabel = type === "expense" ? "Expense" : "Income"

  return (
    <section className="no-drag squircle squircle-rounded-3xl relative grid w-full grid-cols-2 rounded-xl bg-fill-quaternary">
      <Box className="[&_span]:max-w-full [&_span]:truncate">
        <span className="text-[0.9em] text-label-secondary tracking-wide">
          Transactions
        </span>

        <div
          className={cn(
            "flex gap-1 font-semibold transition-colors",
            isLoading && "animate-pulse text-label-tertiary"
          )}
        >
          <NumberFlow
            format={compactNumberFormatOptions}
            value={transactionCount}
          />
          {typeLabel}
        </div>
      </Box>
      <div
        className={cn(
          "absolute top-0 left-1/2 h-full w-px -translate-x-1/2",
          "bg-[rgb(252,252,252)] shadow-[1px_0_0_0_rgba(236,236,236,1)] dark:bg-[rgba(96,96,104,0.18)] dark:shadow-[1px_0_0_0_rgba(0,0,0,0.18)]"
        )}
      />
      <Box className="items-end [&_span]:max-w-full [&_span]:truncate">
        <span className="text-[0.9em] text-label-secondary tracking-wide">
          {amountLabel}
        </span>
        <NumberFlow
          className={cn(
            "font-semibold transition-colors",
            isLoading && "animate-pulse text-label-tertiary"
          )}
          format={{ ...currencyFormatOptions, ...compactNumberFormatOptions }}
          value={amount}
        />
      </Box>
    </section>
  )
}

const Box = ({ className, ...rest }: React.ComponentProps<typeof ark.div>) => {
  return (
    <ark.div
      className={cn("inline-flex w-full flex-col p-3.5", className)}
      {...rest}
    />
  )
}
