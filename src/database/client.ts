import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schemas/standard.schema.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set");
}

export const pool = new Pool({
  connectionString: databaseUrl,
});

export const database = drizzle({ client: pool, casing: "snake_case", schema });
export type Database = typeof database;
