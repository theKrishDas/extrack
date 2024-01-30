import { getTransactions } from "@/actions/handle-transaction";

export default async function Home() {
  const { transactions, error } = await getTransactions();

  // TODO: Build a custom error messege component
  if (error) return <p>{error}</p>;

  return (
    <>
      <h1>
        Welcome to <span className="font-mono font-semibold">PJO-24</span>
      </h1>
      <pre className="overflow-x-scroll rounded-sm border bg-secondary p-3">
        {JSON.stringify(transactions, null, 2)}
      </pre>
    </>
  );
}
