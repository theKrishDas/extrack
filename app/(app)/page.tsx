import { db } from "@/db";
import { transax } from "@/db/drizzle/schema";

export default async function Home() {
  const transactions = await db.select().from(transax);

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
