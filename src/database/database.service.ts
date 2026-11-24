import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { database } from "./client.js";
import { sql } from "drizzle-orm";

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly db = database;
  private readonly logger = new Logger(DatabaseService.name);
  async onModuleInit() {
    try {
      await this.db.execute(sql`SELECT 1`);
      this.logger.log("Database connection verified");
    } catch (error) {
      this.logger.error(
        "PostgreSQL is unavailable. Application startup aborted.",
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }
}
