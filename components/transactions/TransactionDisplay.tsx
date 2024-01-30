import { getTransactions } from "@/actions/handle-transaction";
import TransactionItem from "./TransactionItem";

export default async function TransactionDisplay() {
  const { transactions, error } = await getTransactions();

  // TODO: Build custom components for following cases
  if (error) return <p>{error}</p>;
  if (!transactions) return <p>Unable to load transactions</p>;

  return (
    <div className="space-y-1">
      {transactions.length === 0 ? (
        // TODO: Build component for this
        <p>No transactions</p>
      ) : (
        transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))
      )}
    </div>
  );
}
