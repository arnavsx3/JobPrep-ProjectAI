import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);
app.use(cookieParser());

/**
 * @description import the routers here
 */
import { authRouter } from "./routes/auth-routes.js";
import { hcRouter } from "./routes/healthCheck-routes.js";

/**
 * @description use the routers here
 */
app.use("/api/auth", authRouter);
app.use("/api/test", hcRouter);

/**
 * @description error-middleware to handle errors
 */
import { errorMiddleware } from "./middlewares/error-middleware.js";
app.use(errorMiddleware);

export { app };
