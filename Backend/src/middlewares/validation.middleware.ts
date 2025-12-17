import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

/**
 * Validation middleware
 * @param schema - Zod schema to validate request body, query, or params
 * @param property - "body" | "query" | "params" (default: "body")
 */
export const validate =
  <T>(schema: ZodType<T>, property: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[property] as unknown);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: err.issues,
        });
      }
      next(err);
    }
  };
