"use server";

import { db } from "@/db";
import { transax } from "@/db/drizzle/schema";

export async function getTransactions() {
  try {
    const data = await db.select().from(transax);

    return { data };
  } catch (error) {
    return { error: "An error occured while fetching transactions" };
  }
}
