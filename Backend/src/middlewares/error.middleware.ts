import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { logger } from "../config/logger";

export class AppError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
  }
}

export function errorMiddleware(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(err.message);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(400).json({
      status: "error",
      message: "Database error",
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
}
