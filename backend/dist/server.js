"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const database_1 = require("./utils/database");
const auth_1 = __importDefault(require("./routes/auth"));
const cv_1 = __importDefault(require("./routes/cv"));
const ai_1 = __importDefault(require("./routes/ai"));
// import templateRoutes from './routes/templates';
// import userRoutes from './routes/user';
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./utils/logger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Security middleware
app.use(
  (0, helmet_1.default)({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }),
);
app.use((0, compression_1.default)());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: 15 * 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);
// CORS configuration
app.use(
  (0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);
// Body parsing middleware
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
// Logging
if (process.env.NODE_ENV === "production") {
  app.use(
    (0, morgan_1.default)("combined", {
      stream: { write: (message) => logger_1.logger.info(message.trim()) },
    }),
  );
} else {
  app.use((0, morgan_1.default)("dev"));
}
// Connect to database
(0, database_1.connectDB)();
// Routes
app.use("/api/auth", auth_1.default);
app.use("/api/cv", cv_1.default);
app.use("/api/ai", ai_1.default);
// app.use('/api/templates', templateRoutes);
// app.use('/api/user', userRoutes);
// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: "1.0.0",
  });
});
// Error handling
app.use(errorHandler_1.errorHandler);
// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});
// Graceful shutdown
process.on("SIGTERM", () => {
  logger_1.logger.info("SIGTERM received, shutting down gracefully");
  process.exit(0);
});
process.on("SIGINT", () => {
  logger_1.logger.info("SIGINT received, shutting down gracefully");
  process.exit(0);
});
app.listen(PORT, () => {
  logger_1.logger.info(`🚀 Server running on port ${PORT}`);
  logger_1.logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
  logger_1.logger.info(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map
