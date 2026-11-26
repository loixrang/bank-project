import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateWithdrawDto } from "./dto/create-withdraw.dto.js";
import { InjectDrizzle } from "@nestjs/drizzle";
import { type Database } from "../database/client.js";
import {
  defaultUser,
  transactHistory,
  transactions,
} from "../database/schemas/standard.schema.js";
import { eq } from "drizzle-orm";
import { User } from "../types/user.js";
import { TransactionType } from "../types/transact-type.js";
import { getBalance, verifyAmount } from "../functions/functions.js";

@Injectable()
export class WithdrawService {
  constructor(@InjectDrizzle() private readonly db: Database) {}
  async create(createWithdrawDto: CreateWithdrawDto, current: User) {
    const balance = (await getBalance(current.user.id)).balance;
    verifyAmount(createWithdrawDto.amount, balance);
    const withdraw = await this.db.transaction(async (tx) => {
      const [verifyPin] = await tx
        .select({ pin: defaultUser.pin })
        .from(defaultUser)
        .where(eq(defaultUser.id, current.user.id))
        .limit(1);
      if (verifyPin.pin !== createWithdrawDto.pin) {
        throw new BadRequestException("Wrong pin, try again");
      }
      const [withdrawal] = await tx
        .insert(transactions)
        .values({
          type: TransactionType.WITHDRAW,
          accountId: current.user.id,
          amount: createWithdrawDto.amount,
        })
        .returning();

      const [history] = await tx
        .insert(transactHistory)
        .values({
          transactionId: withdrawal.id,
          description: `You withdrew ${withdrawal.amount}`,
        })
        .returning();

      return { withdrawal, history };
    });

    return withdraw;
  }
}
