import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTransferDto } from "./dto/create-transfer.dto.js";
import { InjectDrizzle } from "@nestjs/drizzle";
import { type Database } from "../database/client.js";
import { VerifyAccountDto } from "./dto/verify-account.dto.js";
import { UserSession } from "../types/express.js";
import { accounts, defaultUser, transactHistory, transactions } from "../database/schemas/standard.schema.js";
import { and, eq } from "drizzle-orm";
import { getBalance, verifyAmount } from "../functions/functions.js";
import { TransactionType } from "../types/transact-type.js";

@Injectable()
export class TransferService {
  constructor(@InjectDrizzle() private readonly db: Database) {}
  async create(createTransferDto: CreateTransferDto, req: UserSession) {
    const userBalance = await getBalance(req.user.id)
    verifyAmount(createTransferDto.amount, userBalance.balance)
    const transfer = await this.db.transaction(async (tx) => {
      const [verifyPin] = await tx
        .select({ pin: defaultUser.pin })
        .from(defaultUser)
        .where(eq(defaultUser.id, req.user.id))
        .limit(1);
      if (verifyPin.pin !== createTransferDto.pin) {
        throw new BadRequestException("Wrong pin, try again");
      }
      const [transfer] = await tx
        .insert(transactions)
        .values({
          type: TransactionType.TRANSFER,
          userId: req.user.id,
          amount: createTransferDto.amount,
        })
        .returning();

      const [history] = await tx
        .insert(transactHistory)
        .values({
          transactionId: transfer.id,
          description: `You transferred ${transfer.amount} to ${createTransferDto.accName}`,
        })
        .returning();

      return { transfer, history };
    })
  }
  async verify(verifyAccountDto: VerifyAccountDto) {
    const [acc] = await this.db
      .select({
        name: accounts.name
      })
      .from(accounts)
      .where(
        and(
          eq(accounts.number, verifyAccountDto.accountNumber),
          eq(accounts.bank, verifyAccountDto.bank),
        ),
    ).limit(1);
    if (!acc) {
      throw new NotFoundException("Account not found")
    }
    return acc 
  }
}
