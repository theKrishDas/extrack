import { cn } from "@/lib/utils";
import Link from "next/link";
import { HiArrowDown, HiArrowUp } from "react-icons/hi2";
import { TbSquareArrowRight } from "react-icons/tb";

export default function TransactionItem({
  transaction,
}: {
  transaction: transactionSchemaType;
}) {
  const transactionDate = new Date(transaction.date).toLocaleDateString(
    "en-IN",
    { month: "short", day: "numeric" },
  );

  return (
    <>
      <Link
        href={`/app/transactions/${transaction.id}`}
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
              <small className="text-content3 italic">Add label</small>
            )}

            <p className="text-content4 text-sm">{transactionDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <p
            className={cn(
              "text-default-500 text-sm",
              !transaction.isExpense && "text-success-500",
            )}
          >
            {/* //TODO: Format the amount */}
            {transaction.amount}
          </p>

          <TbSquareArrowRight strokeWidth={1.5} />
        </div>
      </Link>
    </>
  );
}
