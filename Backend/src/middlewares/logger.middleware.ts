import { Request, Response, NextFunction } from "express";

// Logger Middleware - TODO: Implement request/response logging
export const logger = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement logging logic
  next();
};
