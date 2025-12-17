import { PrismaClient, Prisma } from "@prisma/client";
import { logger } from "./logger";

// Create a Prisma client instance
const prisma = new PrismaClient({
  log: [
    { level: "query", emit: "event" },
    { level: "error", emit: "stdout" },
    { level: "warn", emit: "stdout" },
  ],
});

// Log queries in development for debugging
if (process.env.NODE_ENV === "development") {
  prisma.$on("query", (event: Prisma.QueryEvent) => {
    logger.debug("Prisma Query", {
      query: event.query,
      params: event.params,
      duration: event.duration,
    });
  });
}

export { prisma };
