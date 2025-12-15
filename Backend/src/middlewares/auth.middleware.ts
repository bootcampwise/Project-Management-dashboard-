import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { env } from "../config/env";
import { logger } from "../config/logger";

const client = jwksClient({
  jwksUri: `${env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`,
  cache: true,
  rateLimit: true,
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
      return;
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

export interface AuthRequest extends Request {
  user?: {
    sub: string; // Supabase user ID
    email?: string;
    role?: string;
    [key: string]: any;
  };
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    getKey,
    {
      audience: "authenticated",
      issuer: `${env.SUPABASE_URL}/auth/v1`,
      algorithms: ["RS256"],
    },
    (err, decoded) => {
      if (err) {
        logger.error("JWT verification failed:", err.message);
        res.status(401).json({ error: "Unauthorized: Invalid token" });
        return;
      }

      req.user = decoded as AuthRequest["user"];
      next();
    }
  );
}
