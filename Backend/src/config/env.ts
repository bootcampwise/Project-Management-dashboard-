import dotenv from "dotenv";

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "5000", 10),
  DATABASE_URL: process.env.DATABASE_URL!,
  SUPABASE_URL: process.env.SUPABASE_URL!,
} as const;

// Validate required env vars
const requiredEnvVars = ["DATABASE_URL", "SUPABASE_URL"] as const;

for (const envVar of requiredEnvVars) {
  if (!env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
