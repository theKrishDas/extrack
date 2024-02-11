"use server";
import { db } from "@/db";
import { preference, transax } from "@/db/drizzle/schema";
import { currentUser } from "@clerk/nextjs";
import { eq, sum } from "drizzle-orm";

export async function getTotalBalance() {
  try {
    const user = await currentUser();
    if (!user) return { error: "You must be signed in to add transaction" };

    const userId = user.id;

    const balanceInfo = await db
      .select({ initialBalance: preference.initialBalance })
      .from(preference)
      .where(eq(preference.userId, userId));

    const totalTransactionData = await db
      .select({ totalTransactionAmount: sum(transax.amount) })
      .from(transax)
      .where(eq(transax.userId, userId));

    if (!totalTransactionData || !balanceInfo)
      return { error: "Unable to get balance" };

    const totalTransactionAmount = parseInt(
      totalTransactionData[0].totalTransactionAmount || "0",
    );
    const initialBalance = balanceInfo[0].initialBalance;

    const totalBalance = (initialBalance + totalTransactionAmount) / 100;

    return { totalBalance };
  } catch (error) {
    return { error: "An error occured while fetching transactions" };
  }
}
