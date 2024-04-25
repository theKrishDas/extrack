"use server";

import { db } from "@/db";
import { category } from "@/db/drizzle/schema";
import { currentUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";

export async function getAllCategories(isExpense: boolean) {
  try {
    const user = await currentUser();
    if (!user) return { error: "You must be signed in to add transaction" };

    const userId = user.id;

    const categories = await db
      .select()
      .from(category)
      .where(
        and(eq(category.userId, userId), eq(category.isExpense, isExpense)),
      );
    return { categories };
  } catch (error) {
    return { error: "An error occured while fetching transactions" };
  }
}
