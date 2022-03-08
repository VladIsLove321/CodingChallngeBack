import { Session } from "express-session";

declare module "express-session" {
  interface Session {
    passport: {
      user: string;
    };
  }
}

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      fullName: string;
      hash: string;
      salt: string;
    }
  }
}
