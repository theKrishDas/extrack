import { getTransactions } from "@/actions/handle-transaction";
import TransactionItem from "./TransactionItem";
import InlineNavigation from "../navigation/InlineNavigation";
import EmptyTransaction from "./EmptyTransaction";

export default async function TransactionDisplay() {
  const { transactions, error } = await getTransactions();

  // TODO: Build custom components for following cases
  if (error) return <p>{error}</p>;
  if (!transactions) return <p>Unable to load transactions</p>;

  return (
    <section className="flex flex-col justify-center gap-2">
      <InlineNavigation
        heading="Recent transactions"
        href="/transactions"
        linkText="View all"
      />

      {transactions.length === 0 ? (
        <EmptyTransaction />
      ) : (
        <div className="space-y-1">
          {transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )}
    </section>
  );
}
