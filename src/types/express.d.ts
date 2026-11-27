import { defaultUser, session } from "../database/schemas/standard.schema.ts";

type User = typeof defaultUser.$inferSelect;
type Session = typeof session.$inferSelect;
export type UserSession = {
  user: User;
  session: Session;
};

declare global {
  namespace Express {
    interface Request {
      userSession: UserSession;
    }
  }
}

export {};
