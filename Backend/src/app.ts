import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { logger } from "./config/logger";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// API Routes
app.use("/api", routes);

// Error handling
app.use(errorMiddleware);

export default app;
