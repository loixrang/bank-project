import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import { CreateDepositDto } from "./dto/create-deposit.dto.js";
import { InjectDrizzle } from "@nestjs/drizzle";
import { type Database } from "../database/client.js";
import {
  defaultUser,
  transactHistory,
  transactions,
} from "../database/schemas/standard.schema.js";
import { TransactionType } from "../types/transact-type.js";
import { eq } from "drizzle-orm";

@Injectable()
export class DepositService {
  constructor(@InjectDrizzle() private readonly db: Database) {}
  async create(createDepositDto: CreateDepositDto, userId: string) {
    if (createDepositDto.amount > 3000) {
      throw new BadRequestException("Amount must be less than 3,000");
    }
    if (createDepositDto.amount > 3000) {
      throw new BadRequestException("Amount must be less than 3,000");
    }
    const createDeposit = await this.db.transaction(async (tx) => {
      const [deposit] = await tx
        .insert(transactions)
        .values({
          userId,
          amount: createDepositDto.amount,
          type: TransactionType.DEPOSIT,
        })
        .returning();
      if (!deposit) {
        throw new BadGatewayException("Could not deposit");
      }

      await tx
        .insert(transactHistory)
        .values({
          transactionId: deposit.id,
          userId,
          description: `You deposited ${deposit.amount}`,
        })
        .returning();

      await tx
        .update(defaultUser)
        .set({
          balance: deposit.amount,
        })
        .where(eq(defaultUser.id, userId))
        .returning();
      return { deposit };
    });
    if (!createDeposit) {
      throw new BadGatewayException("Could not complete deposit");
    }
    return createDeposit;
  }
}
