import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { CORS_ORIGIN } from "./config/index.js";

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // Your frontend URL
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

//Import Routes
import CourseRoutes from "./routes/Course.routes.js";
import EmployeeRoutes from "./routes/Employee.routes.js";
import PerformanceMetricRoutes from "./routes/PerformanceMetric.routes.js";
import TrainerRoutes from "./routes/Trainer.routes.js";
import AuthRoutes from "./routes/auth.routes.js";

//Routes
app.use("/api/v1/CourseRoutes", CourseRoutes);
app.use("/api/v1/EmployeeRoutes", EmployeeRoutes);

app.use("/api/v1/PerformanceMetricRoutes", PerformanceMetricRoutes);

app.use("/api/v1/TrainerRoutes", TrainerRoutes);

app.use("/api/v1/auth", AuthRoutes);

export { app };
