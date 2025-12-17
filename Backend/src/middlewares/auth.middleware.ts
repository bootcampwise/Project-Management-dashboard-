import { Request, Response, NextFunction } from "express";

/**
 * Authentication middleware
 * Checks for Bearer token in Authorization header
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  // Attach token to the user object (declared in express.d.ts)
  req.user = { sub: token }; // you can add email, role, etc. if available

  next();
};
