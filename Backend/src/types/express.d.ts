import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string;
        email?: string;
        role?: string;
        name?: string;
        avatar?: string;
        [key: string]: unknown;
      };
    }
  }
}

export {};
