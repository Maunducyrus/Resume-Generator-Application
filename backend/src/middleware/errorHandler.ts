// import { Request, Response, NextFunction } from "express";
// import { logger } from "../utils/logger";

// export const errorHandler = (
//   error: any,
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   logger.error("Error Handler:", {
//     error: error.message,
//     stack: error.stack,
//     url: req.url,
//     method: req.method,
//     ip: req.ip,
//   });

//   // Mongoose validation error
//   if (error.name === "ValidationError") {
//     const errors = Object.values(error.errors).map((err: any) => err.message);
//     return res.status(400).json({
//       success: false,
//       message: "Validation Error",
//       errors,
//     });
//   }

//   // Mongoose duplicate key error
//   if (error.code === 11000) {
//     const field = Object.keys(error.keyValue)[0];
//     return res.status(400).json({
//       success: false,
//       message: `${field} already exists`,
//     });
//   }

//   // JWT errors
//   if (error.name === "JsonWebTokenError") {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid token",
//     });
//   }

//   if (error.name === "TokenExpiredError") {
//     return res.status(401).json({
//       success: false,
//       message: "Token expired",
//     });
//   }

//   // Default error
//   res.status(error.statusCode || 500).json({
//     success: false,
//     message: error.message || "Internal Server Error",
//   });
// };

import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Log *everything* so we can see exactly what failed
  logger.error("🔥 GLOBAL ERROR HANDLER", {
    message: error.message,
    name: error.name,
    code: error.code,
    errors: error.errors || null,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  console.error("🔥 ERROR DEBUG:", {
    message: error.message,
    name: error.name,
    code: error.code,
    errors: error.errors || null,
    stack: error.stack,
  });

  // Sequelize validation error (useful for Supabase/Postgres)
  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({
      success: false,
      message: "Sequelize Validation Error",
      errors: error.errors.map((err: any) => ({
        field: err.path,
        message: err.message,
      })),
    });
  }

  // Sequelize unique constraint error
  if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      success: false,
      message: `Duplicate value for field: ${Object.keys(error.fields).join(", ")}`,
    });
  }

  // Database connection error
  if (error.name === "SequelizeConnectionError") {
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }

  // JWT errors
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, message: "Token expired" });
  }

  // Default fallback
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
};

