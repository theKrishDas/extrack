import { pgTable, text, timestamp, bigint, foreignKey, uuid, varchar, boolean } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const preference = pgTable("preference", {
	userId: text("user_id").primaryKey().notNull(),
	joinedAt: timestamp("joined_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	initialBalance: bigint("initial_balance", { mode: "number" }).default(0).notNull(),
});

export const category = pgTable("category", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => preference.userId, { onDelete: "restrict", onUpdate: "cascade" } ),
	name: varchar("name", { length: 80 }).notNull(),
	isExpense: boolean("is_expense").default(true).notNull(),
});

export const transax = pgTable("transax", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => preference.userId, { onDelete: "restrict", onUpdate: "cascade" } ),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	amount: bigint("amount", { mode: "number" }).notNull(),
	label: text("label"),
	isExpense: boolean("is_expense").default(true).notNull(),
	date: timestamp("date", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	category: uuid("category").references(() => category.id, { onDelete: "restrict", onUpdate: "cascade" } ),
});