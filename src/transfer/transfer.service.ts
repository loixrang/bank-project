import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateTransferDto } from "./dto/create-transfer.dto.js";
import { InjectDrizzle } from "@nestjs/drizzle";
import { type Database } from "../database/client.js";
import { VerifyAccountDto } from "./dto/verify-account.dto.js";
import { UserSession } from "../types/express.js";
import {
  accounts,
  defaultUser,
  transactHistory,
  transactions,
} from "../database/schemas/standard.schema.js";
import { and, eq } from "drizzle-orm";
import { getBalance, verifyAmount } from "../functions/functions.js";
import { TransactionType } from "../types/transact-type.js";

@Injectable()
export class TransferService {
  constructor(@InjectDrizzle() private readonly db: Database) {}
  async create(createTransferDto: CreateTransferDto, req: UserSession) {
    const userBalance = await getBalance(req.user.id);
    await verifyAmount(createTransferDto.amount, userBalance.balance);
    const transfer = await this.db.transaction(async (tx) => {
      const [verifyPin] = await tx
        .select({ pin: defaultUser.pin })
        .from(defaultUser)
        .where(eq(defaultUser.id, req.user.id))
        .limit(1);
      if (verifyPin.pin !== createTransferDto.pin) {
        throw new BadRequestException("Wrong pin, try again");
      }
      const [accName] = await tx
        .select({ name: accounts.name })
        .from(accounts)
        .where(eq(accounts.id, createTransferDto.accId));
      
      const [transfer] = await tx
        .insert(transactions)
        .values({
          type: TransactionType.TRANSFER,
          userId: req.user.id,
          amount: createTransferDto.amount,
        })
        .returning();

      await tx
        .insert(transactHistory)
        .values({
          transactionId: transfer.id,
          userId: req.user.id,
          description: `You transferred ${transfer.amount} to ${accName.name}`,
        })
        .returning();

      await tx
        .update(defaultUser)
        .set({
          balance: transfer.amount,
        })
        .where(eq(defaultUser.id, req.user.id))
        .returning();

      return { transfer };
    });
    if (!transfer) {
      throw new BadGatewayException("could not complete transfer");
    }
    return transfer;
  }
  async verify(verifyAccountDto: VerifyAccountDto) {
    const [acc] = await this.db
      .select({
        id: accounts.id,
      })
      .from(accounts)
      .where(
        and(
          eq(accounts.number, verifyAccountDto.accountNumber),
          eq(accounts.bank, verifyAccountDto.bank),
        ),
      )
      .limit(1);
    if (!acc) {
      throw new NotFoundException("Account not found");
    }
    return acc;
  }
}
