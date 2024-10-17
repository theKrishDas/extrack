"use server";

import { db } from "@/db";
import { transax } from "@/db/drizzle/schema";
import { TRANSACTION_PER_PAGE_FETCH_LIMIT } from "@/lib/defaultValues";
import { auth } from "@clerk/nextjs/server";
import { sql, eq, desc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const cachedInfiniteTransactions = unstable_cache(
  async (userId: string, offset: number = 0) => {
    const limit = TRANSACTION_PER_PAGE_FETCH_LIMIT;

    try {
      const data = await db
        .select()
        .from(transax)
        .where(eq(transax.userId, userId))
        .orderBy(desc(transax.date))
        .limit(limit)
        .offset(offset);

      const transactions =
        data &&
        data.map(({ ...transaction }) => ({
          ...transaction,
          amount: transaction.amount / 100,
        }));

      // TODO: perhaps extract this fetch to it's own cached-function
      const totalCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(transax)
        .where(eq(transax.userId, userId))
        .then((res) => res[0].count);

      return {
        data: transactions,
        totalCount,
        nextOffset: offset + limit,
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error("Failed to fetch data");
    }
  },
  // TODO: Read the docs for this argument
  [],
  { tags: ["transactions", "infinite_transactions"], revalidate: false },
);

export async function fetchInfiniteTransactions(offset: number = 0) {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("User not found");

    const cachedTransactions = await cachedInfiniteTransactions(userId, offset);

    return cachedTransactions;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data");
  }
}
