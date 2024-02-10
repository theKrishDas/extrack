import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { IoArrowDownSharp, IoArrowUpSharp } from "react-icons/io5";

export default function TransactionDetail({
  transaction,
}: {
  transaction: transactionSchemaType;
}) {
  const isExpense = transaction.isExpense;
  const transactionDate = formatDate(transaction.date);
  const formattedAmount = formatCurrency(transaction.amount);

  return (
    <>
      <section className="flex flex-col items-center justify-center">
        <div
          className={cn(
            "inline-grid h-16 w-16 place-content-center rounded-full",
            isExpense
              ? "bg-destructive-foreground text-destructive"
              : "bg-success-foreground text-success",
          )}
        >
          {isExpense ? <IoArrowUpSharp /> : <IoArrowDownSharp />}
        </div>

        <div className="flex flex-col items-center">
          {transaction.label ? (
            <h3 className="font-semibold">{transaction.label}</h3>
          ) : (
            <small className="italic text-foreground/40">Add label</small>
          )}

          <p className="text-xs text-foreground/60">{transactionDate}</p>
        </div>
      </section>

      <div
        className={cn(
          "grid h-24 place-content-center rounded-md",
          isExpense
            ? "bg-destructive/90 text-destructive-foreground"
            : "bg-success/90 text-success-foreground",
        )}
      >
        <p className="text-xl">{formattedAmount}</p>
      </div>

      <pre className="overflow-x-scroll rounded-lg bg-secondary p-3">
        {JSON.stringify(transaction, null, 2)}
      </pre>
    </>
  );
}
