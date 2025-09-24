// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import compression from "compression";
// import morgan from "morgan";
// import dotenv from "dotenv";
// import rateLimit from "express-rate-limit";
// import { connectDB } from "./utils/database";
// import authRoutes from "./routes/auth";
// import cvRoutes from "./routes/cv";
// import aiRoutes from "./routes/ai";
// import { errorHandler } from "./middleware/errorHandler";
// import { logger } from "./utils/logger";

// dotenv.config();
// console.log(
//   "✅ OPENAI_API_KEY loaded:",
//   process.env.OPENAI_API_KEY ? "Yes" : "No",
// );

// const app = express();
// const PORT = process.env.PORT || 5000;

// // ✅ Trust Railway/Render/Heroku proxies so express-rate-limit can read IPs correctly
// app.set("trust proxy", 1);

// // Security middleware
// app.use(
//   helmet({
//     crossOriginEmbedderPolicy: false,
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         styleSrc: ["'self'", "'unsafe-inline'"],
//         scriptSrc: ["'self'"],
//         imgSrc: ["'self'", "data:", "https:"],
//       },
//     },
//   }),
// );
// app.use(compression());

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: {
//     error: "Too many requests from this IP, please try again later.",
//     retryAfter: 15 * 60,
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use("/api/", limiter);

// // CORS configuration
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
//   }),
// );

// // Explicitly allow preflight requests
// app.options("*", cors());

// // Body parsing middleware
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // Logging
// if (process.env.NODE_ENV === "production") {
//   app.use(
//     morgan("combined", {
//       stream: { write: (message) => logger.info(message.trim()) },
//     }),
//   );
// } else {
//   app.use(morgan("dev"));
// }

// // Connect to database
// connectDB();

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/cv", cvRoutes);
// app.use("/api/ai", aiRoutes);

// // Health check
// app.get("/api/health", (req, res) => {
//   res.json({
//     status: "OK",
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV,
//     version: "1.0.0",
//   });
// });

// // Error handling
// app.use(errorHandler);

// // 404 handler
// app.use("*", (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//     path: req.originalUrl,
//   });
// });

// // Graceful shutdown
// process.on("SIGTERM", () => {
//   logger.info("SIGTERM received, shutting down gracefully");
//   process.exit(0);
// });

// process.on("SIGINT", () => {
//   logger.info("SIGINT received, shutting down gracefully");
//   process.exit(0);
// });

// app.listen(PORT, () => {
//   logger.info(`🚀 Server running on port ${PORT}`);
//   logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
//   logger.info(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
// });

// export default app;



import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { initializeDatabase } from './models';
import authRoutes from './routes/auth';
import cvRoutes from './routes/cv';
import aiRoutes from './routes/ai';
import templateRoutes from './routes/templates';
import userRoutes from './routes/user';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for Render
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.openai.com"],
    },
  },
}));

app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter((origin): origin is string => typeof origin === 'string');

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// Ensure uploads directory exists
const fs = require('fs');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

const avatarsPath = path.join(uploadsPath, 'avatars');
if (!fs.existsSync(avatarsPath)) {
  fs.mkdirSync(avatarsPath, { recursive: true });
}

// Logging
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', { 
    stream: { write: (message) => logger.info(message.trim()) } 
  }));
} else {
  app.use(morgan('dev'));
}

// Connect to database
const startServer = async () => {
  try {
    await initializeDatabase();
    
    // Start server only after database connection
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
      logger.info(`🗄️ Database: PostgreSQL`);
      logger.info(`🤖 AI: OpenAI GPT-4`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/user', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
    database: 'PostgreSQL',
    ai: 'OpenAI GPT-4'
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'CV Builder API',
    version: '1.0.0',
    description: 'AI-Powered CV Builder Backend API with PostgreSQL',
    endpoints: {
      auth: '/api/auth',
      cv: '/api/cv',
      ai: '/api/ai',
      templates: '/api/templates',
      user: '/api/user',
      health: '/api/health'
    },
    documentation: 'https://github.com/your-repo/cv-builder-api'
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown handlers
const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully`);
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start server
startServer();

export default app;