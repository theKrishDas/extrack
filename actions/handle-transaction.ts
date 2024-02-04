"use server";
import { db } from "@/db";
import { transax } from "@/db/drizzle/schema";
import {
  NewTransactionSchema,
  NewTransactionSchemaType,
} from "@/lib/form-schema/new-transaction-schema";
import { currentUser } from "@clerk/nextjs";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// TODO: Return Drizzle error instance instead.

export async function getTransactions() {
  try {
    const data = await db.select().from(transax);

    const transactions =
      data &&
      data.map(({ ...transaction }) => ({
        ...transaction,
        amount: transaction.amount / 100,
      }));

    return { transactions };
  } catch (error) {
    return { error: "An error occured while fetching transactions" };
  }
}

export async function getTransactionById(transactionId: string) {
  try {
    const data = await db
      .selectDistinct()
      .from(transax)
      .where(eq(transax.id, transactionId));

    if (data.length === 0) return { transaction: undefined };

    const transaction = {
      ...data[0],
      amount: data[0].amount / 100,
    };

    return { transaction };
  } catch (error) {
    return { error: "Unable to fetch the rquested transaction" };
  }
}

export async function insertTransactions(formData: NewTransactionSchemaType) {
  try {
    const user = await currentUser();
    if (!user) return { error: "You must be signed in to add transaction" };

    const validatedData = NewTransactionSchema.safeParse(formData);
    if (!validatedData.success) return { error: "Error parsing input values" };

    const { amount, label, is_expense, date } = validatedData.data;

    const newTransactionData: transactionInsertSchemaType = {
      userId: user.id,
      amount: is_expense ? amount * -100 : amount * 100,
      label: label,
      isExpense: is_expense,
      date: date?.toISOString(),
    };

    await db.insert(transax).values(newTransactionData);

    // TODO: Use revalidate tag instead
    revalidatePath("/");

    return { success: "Added new transaction" };
  } catch (error) {
    return { error: "An error occured while adding new transaction" };
  }
}

export async function updateTransaction(
  updateId: string,
  formData: NewTransactionSchemaType,
) {
  try {
    const user = await currentUser();
    if (!user) return { error: "You must be signed in to add transaction" };

    const userId = user.id;

    const validatedData = NewTransactionSchema.safeParse(formData);
    if (!validatedData.success) return { error: "Error parsing input values" };

    const { amount, label, is_expense, date } = validatedData.data;

    const updateTransactionData = {
      amount: is_expense ? amount * -100 : amount * 100,
      label: label,
      isExpense: is_expense,
      date: date?.toISOString(),
    };

    await db
      .update(transax)
      .set(updateTransactionData)
      .where(and(eq(transax.userId, userId), eq(transax.id, updateId)));

    // TODO: Use revalidate tag instead
    revalidatePath("/");

    return { success: "Updated the transaction" };
  } catch (error) {
    return { error: "An error occured while adding new transaction" };
  }
}

export async function deleteTransaction(transactionId: string) {
  try {
    const { transaction, error } = await getTransactionById(transactionId);

    if (error) return { error };
    if (!transaction) return { error: "Transaction does not exists" };

    await db.delete(transax).where(eq(transax.id, transactionId));

    // TODO: Use revalidate tag instead
    revalidatePath("/");

    return { success: "Transaction is successfully deleted!" };
  } catch (error) {
    return { error: "Unable to delete the transaction" };
  }
}
