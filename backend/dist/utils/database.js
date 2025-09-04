"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.disconnectDB = exports.connectDB = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const logger_1 = require("./logger");
const User_1 = __importDefault(require("../models/User"));
const CV_1 = __importDefault(require("../models/CV"));
let sequelize;
const connectDB = async () => {
    try {
        const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URI || 'postgresql://localhost:5432/cv_builder';
        exports.sequelize = sequelize = new sequelize_typescript_1.Sequelize(dbUrl, {
            dialect: 'postgres',
            models: [User_1.default, CV_1.default],
            logging: process.env.NODE_ENV === 'development' ? (msg) => logger_1.logger.info(msg) : false,
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000,
            },
            dialectOptions: process.env.NODE_ENV === 'production' ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            } : {}
        });
        await sequelize.authenticate();
        logger_1.logger.info('✅ PostgreSQL connected successfully');
        // Sync database (create tables if they don't exist)
        await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
        logger_1.logger.info('✅ Database synchronized');
    }
    catch (error) {
        logger_1.logger.error('❌ PostgreSQL connection failed:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        if (sequelize) {
            await sequelize.close();
            logger_1.logger.info('PostgreSQL disconnected');
        }
    }
    catch (error) {
        logger_1.logger.error('Error disconnecting from PostgreSQL:', error);
    }
};
exports.disconnectDB = disconnectDB;
//# sourceMappingURL=database.js.map