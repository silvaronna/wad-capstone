// File: src/index.js — versi lengkap dengan semua security middleware
const config = require("./config");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const corsOptions = require("./config/cors");
const {
  apiLimiter,
  authLimiter,
  sensitiveLimiter,
} = require("./config/rateLimiter");

// Routes
const routes = require("./routes");
const authRoutes = require("./routes/auth.routes");
const tasksRoutes = require("./routes/tasks.routes");
const usersRoutes = require("./routes/users.routes");
const adminRoutes = require("./routes/admin.routes");
const setupSwagger = require("./docs/swagger");

const app = express();

// ─── 1. Security Headers (Helmet) ──────────────────────
// Harus dipasang PALING AWAL sebelum middleware lain
app.use(helmet());

// ─── 2. CORS ─────────────────────────────────────────
app.use(cors(corsOptions));
// FIX EXPRESS v5: Menggunakan parameter bernama dengan wildcard untuk preflight
app.options(/.*/, cors(corsOptions)); 

// ─── 3. Body Parser ──────────────────────────────────
app.use(express.json({ limit: "10kb" })); // Batasi ukuran body 10KB
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ─── 4. Rate Limiting Global ─────────────────────────
app.use("/api/", apiLimiter);

// ─── 5. Request Logger ───────────────────────────────
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} → ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// ─── 6. Routes ───────────────────────────────────────
app.use("/", routes);
app.use("/api", routes);

// Auth routes — rate limiting ketat
app.use("/auth/login", authLimiter);
app.use("/auth/refresh", sensitiveLimiter);
app.use("/auth", authRoutes);

// Protected API routes
app.use("/api/v1/tasks", tasksRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/admin", adminRoutes);

// ─── 7. Swagger UI ───────────────────────────────────
setupSwagger(app);

// ─── 8. 404 Handler ──────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.path} tidak ditemukan.`,
    },
  });
});

// ─── 9. Global Error Handler ─────────────────────────
app.use((err, req, res, next) => {
  // CORS error
  if (err.message && err.message.includes("tidak diizinkan oleh CORS")) {
    return res.status(403).json({
      error: { code: "CORS_ERROR", message: err.message },
    });
  }

  // Auth service errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: { code: err.code || "AUTH_ERROR", message: err.message },
    });
  }

  // Prisma P2002 duplicate
  if (err.code === "P2002") {
    return res.status(409).json({
      error: { code: "DUPLICATE_RESOURCE", message: "Data sudah digunakan." },
    });
  }

  console.error("Unhandled error:", err.message);
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: config.env === "development" ? err.message : "Terjadi kesalahan.",
    },
  });
});

app.listen(config.port, () => {
  console.log("─".repeat(55));
  console.log(` ${config.appName} v${config.version}`);
  console.log(` Environment : ${config.env}`);
  console.log(` Server      : http://localhost:${config.port}`);
  console.log(` Docs        : http://localhost:${config.port}/api/docs`);
  console.log(` Security    : Helmet ✓ CORS ✓ Rate Limit ✓`);
  console.log("─".repeat(55));
});

module.exports = app;