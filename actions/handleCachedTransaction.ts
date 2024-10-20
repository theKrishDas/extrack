"use server";

import { db } from "@/db";
import { transax } from "@/db/drizzle/schema";
import { TRANSACTION_PER_PAGE_FETCH_LIMIT } from "@/lib/defaultValues";
import { groupTransactions, processTransactionData } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { sql, eq, desc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const fetchCachedTransactions = unstable_cache(
  async (userId: string, limit: number, offset: number = 0) => {
    try {
      const data = await db
        .select()
        .from(transax)
        .where(eq(transax.userId, userId))
        .orderBy(desc(transax.date))
        .limit(limit)
        .offset(offset);

      // TODO: perhaps extract this fetch to it's own cached-function
      const totalCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(transax)
        .where(eq(transax.userId, userId))
        .then((res) => res[0].count);

      const transactions = processTransactionData(data);

      return {
        ungroupedTransactions: transactions,
        groupedTransactions: groupTransactions(transactions),
        totalCount,
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error("Failed to fetch data");
    }
  },
  [],
  { tags: ["transactions", "infinite_transactions"], revalidate: false },
);

export async function fetchInfiniteTransactions(offset: number = 0) {
  const limit = TRANSACTION_PER_PAGE_FETCH_LIMIT;
  const nextOffset = offset + limit;

  try {
    const { userId } = auth();
    if (!userId) throw new Error("User not found");

    const cachedTransactions = await fetchCachedTransactions(
      userId,
      limit,
      offset,
    );

    const infiniteData = {
      ...cachedTransactions,
      nextOffset,
    };

    return infiniteData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data");
  }
}
