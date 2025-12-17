import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

export const loggerMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { method, path, body } = req;

  logger.info(`${method} ${path}`);

  if (Object.keys(body).length > 0) {
    logger.info("Request Body:", body);
  }

  next();
};
