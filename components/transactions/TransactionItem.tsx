import { cn } from "@/lib/utils";
import Link from "next/link";
import { HiArrowDown, HiArrowUp } from "react-icons/hi2";
import { TbSquareArrowRight } from "react-icons/tb";

export default function TransactionItem({
  transaction,
}: {
  transaction: transactionSchemaType;
}) {
  const LOCALE = "en-IN";

  const transactionDate = new Date(transaction.date).toLocaleDateString(
    LOCALE,
    { month: "short", day: "numeric" },
  );

  const amountFormat = new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const formattedAmount = amountFormat.format(transaction.amount);

  return (
    <>
      <Link
        href={`/transactions/${transaction.id}`}
        className="flex items-center justify-between rounded-md bg-secondary p-4 transition hover:bg-accent hover:text-accent-foreground"
      >
        <div className="flex items-start gap-2">
          {transaction.isExpense ? (
            <HiArrowDown className="text-danger mt-[0.2rem]" />
          ) : (
            <HiArrowUp className="text-success mt-[0.2rem]" />
          )}

          <div>
            {transaction.label ? (
              <h6 className="font-semibold">{transaction.label}</h6>
            ) : (
              <small className="italic text-foreground/40">Add label</small>
            )}

            <p className="text-xs text-foreground/60">{transactionDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <p
            className={cn(
              "text-sm text-foreground",
              !transaction.isExpense && "text-success",
            )}
          >
            {formattedAmount}
          </p>

          <TbSquareArrowRight strokeWidth={1.5} />
        </div>
      </Link>
    </>
  );
}
