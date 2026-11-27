import { Banks } from "../types/banks.js";
import { database } from "./client.js";
import { accounts } from "./schemas/standard.schema.js";

interface SeedAccount {
  name: string;
  number: number;
  bank: Banks;
}

async function seedDatabase(data: SeedAccount) {
  try {
    const [seed] = await database.insert(accounts).values(data).returning();
    if (!seed) {
      throw new Error();
    }
    console.log({ message: "successful", data: seed });
    process.exitCode = 0;
  } catch (error: unknown) {
    console.error(error);
    process.exitCode = 1;
  }
}
