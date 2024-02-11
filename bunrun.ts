import { db } from "./db";
import { transax } from "./db/drizzle/schema";

export async function fetchTransactions() {
  try {
    const data = await db.select().from(transax);

    if (!data) {
      return { error: "No transactions" };
    }

    return { data };
  } catch (error) {
    return { error: "An error occurred while fetching transactions" };
  }
}

export async function insertTransactions(
  newTransactionData: transactionInsertSchemaType,
) {
  try {
    await db.insert(transax).values(newTransactionData);

    return { success: "Transaction inserted successfully" };
  } catch (error) {
    return { error: "An error occurred while inserting transaction" };
  }
}

console.log("Running...");
fetchTransactions().then((res) => console.log(res));
// insertTransactions({}).then((res) => console.log(res));
