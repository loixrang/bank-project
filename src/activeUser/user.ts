import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "../auth/auth.service.js";
import {
  defaultUser,
  session as sessions,
} from "../database/schemas/standard.schema.js";
import { InjectDrizzle } from "@nestjs/drizzle";
import { type Database } from "../database/client.js";
import { eq } from "drizzle-orm";

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly resolver: AuthService,
    @InjectDrizzle() private readonly db: Database,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = request.cookies?.session;

    if (!userId) {
      throw new NotFoundException(`No user or session found`);
    }
    const [user] = await this.db
      .select()
      .from(defaultUser)
      .where(eq(defaultUser.id, userId));
    const [session] = await this.db
      .select()
      .from(sessions)
      .where(eq(sessions.userId, userId))
      .limit(1);

    if (!session) {
      throw new NotFoundException("Session not found");
    }

    request.userSession = { user, session };

    return true;
  }
}
