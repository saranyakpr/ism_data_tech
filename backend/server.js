import "./config/env.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";




import authRoutes from "./routes/auth-routes.js";
import jobsRoutes from "./routes/jobs-routes.js";
import publicJobsRoutes from "./routes/public-jobs-routes.js";
import applicationsRoutes from "./routes/applications-routes.js";
import applicationStatusRoutes from "./routes/application-status-routes.js";
import resumeRoutes from "./routes/resume-routes.js";
import overviewRoutes from "./routes/overview-routes.js";
import lifeAtISMAdminRoutes from "./routes/life-at-ism-routes.js";
import careerApplicationRoutes from "./routes/career-application-routes.js";
import contactRoutes from "./routes/contact-routes.js";
import publicLifeAtISMRoutes from "./routes/public-life-at-ism-routes.js";
import lifeAtISMImageRoutes from "./routes/life-at-ism-image-routes.js";

const app = express();

const PORT = process.env.PORT || 3001;

const allowedOrigin =
  process.env.FRONTEND_URL || "http://localhost:5173";

// Trust the proxy when deployed behind a hosting platform.
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// CORS configuration
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      // In development allow any localhost port (Vite port varies).
      if (process.env.NODE_ENV !== "production") {
        try {
          const url = new URL(origin);
          if (url.hostname === "localhost") return callback(null, true);
        } catch {
          // fall through to strict check
        }
      }

      if (origin === allowedOrigin) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json({ limit: "8mb" }));
app.use(cookieParser());

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ISM Data Technology API is running.",
  });
});

// Admin API routes
app.use("/api/admin/auth", authRoutes);
app.use("/api/admin/jobs", jobsRoutes);
app.use("/api/jobs", publicJobsRoutes);
app.use("/api/admin/applications", applicationsRoutes);
app.use("/api/admin/applications", applicationStatusRoutes);
app.use("/api/admin/applications", resumeRoutes);
app.use("/api/admin/overview", overviewRoutes);
app.use("/api/admin/life-at-ism", lifeAtISMAdminRoutes);

// Public API routes
app.use("/api/careers/apply", careerApplicationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/life-at-ism", publicLifeAtISMRoutes);
app.use("/api/life-at-ism", lifeAtISMImageRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: "API route not found.",
  });
});

// Error handling
app.use((error, req, res, next) => {
  console.error("Backend error:", error.message);

  if (error.type === "entity.too.large") {
    return res.status(413).json({
      error: "Request data is too large.",
    });
  }

  if (error instanceof SyntaxError && error.status === 400) {
    return res.status(400).json({
      error: "Invalid JSON request.",
    });
  }

  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      error: "Image size must not exceed 4MB.",
    });
  }

  if (error.message?.includes("Only JPG, PNG and WebP")) {
    return res.status(400).json({
      error: error.message,
    });
  }

  return res.status(500).json({
    error: "Internal server error.",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`ISM Backend running at http://localhost:${PORT}`);
});