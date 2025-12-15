import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorMiddleware(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error("Error:", err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      status: err.statusCode,
    });
  }

  // Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    return res.status(400).json({
      error: "Database error",
      status: 400,
    });
  }

  // Default error
  res.status(500).json({
    error: "Internal server error",
    status: 500,
  });
}
