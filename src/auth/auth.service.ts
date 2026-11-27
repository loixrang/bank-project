import { BadRequestException, Injectable } from "@nestjs/common";
import { LoginDto } from "./dto/create-auth.dto.js";
import { InjectDrizzle } from "@nestjs/drizzle";
import { type Database } from "../database/client.js";
import {
  defaultUser,
  session as sessions,
} from "../database/schemas/standard.schema.js";

@Injectable()
export class AuthService {
  constructor(@InjectDrizzle() private readonly db: Database) {}
  async create(dto: LoginDto) {
    if (dto.pin < 1000 || dto.pin > 9999) {
      throw new BadRequestException("Pin must be 4 chars");
    }
    const userStartUp = await this.db.transaction(async (tx) => {
      const [user] = await tx
        .insert(defaultUser)
        .values({
          name: dto.name,
          pin: dto.pin,
        })
        .returning();
      const [session] = await tx
        .insert(sessions)
        .values({
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        })
        .returning();
      return { user, session };
    });

    return userStartUp;
  }
}
