import { z } from "zod";

export const NewTransactionSchema = z.object({
  amount: z.number(),
  label: z.string().nullable().optional(),
  // category: z.string().nullable().optional(), // TODO: Add later
  is_expense: z.boolean(),
  date: z.date().optional(),
});
export type NewTransactionSchemaType = z.infer<typeof NewTransactionSchema>;
