import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectDrizzle } from "@nestjs/drizzle";
import { type Database } from "../database/client.js";
import { UserSession } from "../types/express.js";
import { transactHistory } from "../database/schemas/standard.schema.js";
import { eq } from "drizzle-orm";

@Injectable()
export class HistoryService {
  constructor(@InjectDrizzle() private readonly db: Database) {}
  async findAll(req: UserSession) {
    const userHistory = await this.db
      .select({ description: transactHistory.description })
      .from(transactHistory)
      .where(eq(transactHistory.userId, req.user.id));
    if (!userHistory.length) {
      return [];
    }
    return userHistory;
  }
}
