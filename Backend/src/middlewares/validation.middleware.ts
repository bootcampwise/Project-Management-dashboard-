import { Request, Response, NextFunction } from "express";

// Validation Middleware - TODO: Implement request validation
export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // TODO: Implement validation logic
    next();
  };
};
