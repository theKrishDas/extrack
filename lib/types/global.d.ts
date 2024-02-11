import { category, preference, transax } from "@/db/drizzle/schema";

/* eslint-disable */
declare global {
  type preferenceSchemaType = typeof preference.$inferSelect;
  type preferenceInsertSchemaType = typeof preference.$inferInsert;

  type categorySchemaType = typeof category.$inferSelect;
  type categoryInsertSchemaType = typeof category.$inferInsert;

  type transactionSchemaType = typeof transax.$inferSelect;
  type transactionInsertSchemaType = typeof transax.$inferInsert;
}
