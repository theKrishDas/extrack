"use server";

import { MINIMUM_SARTING_BALANCE } from "@/defaultValues";
import { db } from "@/db";
import { preference } from "@/db/drizzle/schema";
import { currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function testStartingBalance(amount: number) {
  const mappedAmount = Math.abs(amount) * 100;

  const roundedAmount = parseFloat(mappedAmount.toFixed(2));
  console.log(roundedAmount);

  try {
    // Get user id
    const user = await currentUser();
    if (!user) return { error: "You must be signed in to add transaction" };

    const userId = user.id;

    // Update dadtabase
    await db
      .update(preference)
      .set({ initialBalance: roundedAmount })
      .where(eq(preference.userId, userId));

    // TODO: Use revalidate tag instead
    revalidatePath("/");
    revalidatePath("/settings");

    return { success: "Udated initial balance" };
  } catch (error) {
    return { error: "An error occured while updating initial balance" };
  }
}
