import { BadRequestException } from "@nestjs/common";
import { defaultUser } from "../database/schemas/standard.schema.js";
import { database } from "../database/client.js";
import { eq } from "drizzle-orm";

async function getBalance(id: string) {
  const [userBalance] = await database
    .select({ balance: defaultUser.balance })
    .from(defaultUser)
    .where(eq(defaultUser.id, id))
    .limit(1);
  return userBalance;
}

async function verifyAmount(amount: number, balance: number) {
  if (balance < amount) {
    throw new BadRequestException("balance is less than amount");
  }
  if (amount < 100) {
    throw new BadRequestException("amount should be at least 100");
  }
  return true;
}

export {getBalance, verifyAmount}