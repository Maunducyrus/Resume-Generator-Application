"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const errorHandler = (error, req, res, next) => {
    logger_1.logger.error('Error Handler:', {
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip
    });
    // Mongoose validation error
    if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors
        });
    }
    // Mongoose duplicate key error
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return res.status(400).json({
            success: false,
            message: `${field} already exists`
        });
    }
    // JWT errors
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired'
        });
    }
    // Default error
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal Server Error'
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map