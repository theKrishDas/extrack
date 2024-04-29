"use server";

import { db } from "@/db";
import { category } from "@/db/drizzle/schema";
import { NewCategorySchema } from "@/lib/types/new-category-form-schema";
import { currentUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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

export async function createCategory(
  categoryName: string,
  isExpense?: boolean,
) {
  try {
    const user = await currentUser();
    if (!user) return { error: "You must be signed in to add transaction" };

    const userId = user.id;

    const validatedData = NewCategorySchema.safeParse({ name: categoryName });
    if (!validatedData.success) return { error: "Error parsing Category name" };

    const { name } = validatedData.data;

    await db.insert(category).values({ userId: userId, name, isExpense });

    revalidatePath("/settings/category");

    return { success: `Successfully created category: ${categoryName}` };
  } catch (error) {
    return { error: "An error occured while creating new category" };
  }
}
