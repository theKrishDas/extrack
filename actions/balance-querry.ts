"use server";
import { db } from "@/db";
import { transax } from "@/db/drizzle/schema";
import { currentUser } from "@clerk/nextjs";
import { eq, sum } from "drizzle-orm";

export async function getTotalBalance() {
  try {
    const user = await currentUser();
    if (!user) return { error: "You must be signed in to add transaction" };

    const userId = user.id;

    const INITIAL_BALANCE = 0;

    const data = await db
      .select({ value: sum(transax.amount) })
      .from(transax)
      .where(eq(transax.userId, userId));

    if (!data) return { error: "Error fetching data" };
    const value = parseInt(data[0].value || "0");

    const totalBalance = INITIAL_BALANCE + value / 100;

    return { totalBalance };
  } catch (error) {
    return { error: "An error occured while fetching transactions" };
  }
}
