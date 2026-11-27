import { BadRequestException } from "@nestjs/common";
import { defaultUser } from "../database/schemas/standard.schema.js";
import { database } from "../database/client.js";
import { eq } from "drizzle-orm";

async function getBalance(userId: string) {
  const [userBalance] = await database
    .select({ balance: defaultUser.balance })
    .from(defaultUser)
    .where(eq(defaultUser.id, userId))
    .limit(1);
  return userBalance;
}

async function verifyAmount(amount: number, balance: number) {
  if (amount < 100) {
    throw new BadRequestException("amount should be at least 100");
  }
  if (balance < amount) {
    throw new BadRequestException("balance is less than amount");
  }
  return true;
}

export { getBalance, verifyAmount };
