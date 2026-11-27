import * as p from "drizzle-orm/pg-core";
import { TransactionType } from "../../types/transact-type.js";
import { Banks } from "../../types/banks.js";
import { relations } from "drizzle-orm";

export const transactionTypeEnum = p.pgEnum(
  "transaction_type",
  TransactionType,
);
export const bankEnum = p.pgEnum("banks", Banks);

export const defaultUser = p.pgTable("user", {
  id: p.uuid().primaryKey().defaultRandom(),
  name: p.text().notNull(),
  balance: p.integer().notNull().default(0),
  pin: p.integer().notNull(),
  bank: p.text().notNull().default("Loixrang Bank"),
  createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const session = p.pgTable("session", {
  id: p.uuid().primaryKey().defaultRandom(),
  userId: p
    .uuid()
    .notNull()
    .references(() => defaultUser.id),
  expiresAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
  createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const accounts = p.pgTable("account", {
  id: p.uuid().primaryKey().defaultRandom(),
  name: p.text().notNull(),
  number: p.integer().notNull(),
  balance: p.integer().notNull(),
  bank: bankEnum().notNull(),
  createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const transactions = p.pgTable("transaction", {
  id: p.uuid().primaryKey().defaultRandom(),
  type: transactionTypeEnum().notNull(),
  amount: p.integer().notNull(),
  userId: p
    .uuid()
    .notNull()
    .references(() => defaultUser.id),
  createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const transactHistory = p.pgTable("history", {
  transactionId: p
    .uuid()
    .primaryKey()
    .references(() => transactions.id),
  description: p.text().notNull(),
});

export const accountsRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.userId],
    references: [accounts.id],
  }),
}));
