"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const logger_1 = require("../utils/logger");
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_1.default.findByPk(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. User not found.'
            });
        }
        req.user = {
            userId: user.id,
            email: user.email,
            name: user.name
        };
        next();
    }
    catch (error) {
        logger_1.logger.error('Auth Middleware Error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }
};
exports.auth = auth;
//# sourceMappingURL=auth.js.map