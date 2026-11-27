import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import { CreateWithdrawDto } from "./dto/create-withdraw.dto.js";
import { InjectDrizzle } from "@nestjs/drizzle";
import { type Database } from "../database/client.js";
import {
  defaultUser,
  transactHistory,
  transactions,
} from "../database/schemas/standard.schema.js";
import { eq } from "drizzle-orm";
import { TransactionType } from "../types/transact-type.js";
import { getBalance, verifyAmount } from "../functions/functions.js";
import { UserSession } from "../types/express.js";

@Injectable()
export class WithdrawService {
  constructor(@InjectDrizzle() private readonly db: Database) {}
  async create(createWithdrawDto: CreateWithdrawDto, req: UserSession) {
    const balance = (await getBalance(req.user.id)).balance;
    await verifyAmount(createWithdrawDto.amount, balance);
    const withdraw = await this.db.transaction(async (tx) => {
      const [verifyPin] = await tx
        .select({ pin: defaultUser.pin })
        .from(defaultUser)
        .where(eq(defaultUser.id, req.user.id))
        .limit(1);
      if (verifyPin.pin !== createWithdrawDto.pin) {
        throw new BadRequestException("Wrong pin, try again");
      }
      const [withdrawal] = await tx
        .insert(transactions)
        .values({
          type: TransactionType.WITHDRAW,
          userId: req.user.id,
          amount: createWithdrawDto.amount,
        })
        .returning();

      await tx
        .insert(transactHistory)
        .values({
          transactionId: withdrawal.id,
          userId: req.user.id,
          description: `You withdrew ${withdrawal.amount}`,
        })
        .returning();

      await tx
        .update(defaultUser)
        .set({
          balance: withdrawal.amount,
        })
        .where(eq(defaultUser.id, req.user.id))
        .returning();

      return { withdrawal };
    });
    if (!withdraw) {
      throw new BadGatewayException("Could not complete withdrawal");
    }
    return withdraw;
  }
}
