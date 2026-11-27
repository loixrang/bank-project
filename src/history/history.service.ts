import { Injectable } from "@nestjs/common";
import { InjectDrizzle } from "@nestjs/drizzle";
import { type Database } from "../database/client.js";
import { UserSession } from "../types/express.js";

@Injectable()
export class HistoryService {
  constructor(@InjectDrizzle() private readonly db: Database) {}
  findAll(req: UserSession) {
    return "This action adds a new history";
  }
}
