import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectDrizzle } from "@nestjs/drizzle";
import { type Database } from "../database/client.js";
import { defaultUser } from "../database/schemas/standard.schema.js";
import { eq } from "drizzle-orm";

type User = {
  user?: {
    id: string;
  };
  client?: {
      name: string;
      balance: number;
      pin: number;
    };
};

@Injectable()
export class UserGuard implements CanActivate {
  constructor(@InjectDrizzle() private readonly db: Database) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<User>();
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException("Authentication required");
    }

    const [activeUser] = await this.db
      .select({name: defaultUser.name, balance: defaultUser.balance, pin: defaultUser.pin})
      .from(defaultUser)
      .where(eq(defaultUser.id, userId))
      .limit(1);

    if (!activeUser) {
      throw new ForbiddenException("You are not signed in");
    }

    request.client = activeUser
    return true
  }
}
