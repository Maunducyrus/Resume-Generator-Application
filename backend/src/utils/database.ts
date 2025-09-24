import { Sequelize } from "sequelize-typescript";
import { logger } from "./logger";
import User from "../models/User";
import CV from "../models/CV";

let sequelize: Sequelize;

export const connectDB = async () => {
  try {
    const dbUrl =
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URI ||
      "postgresql://localhost:5432/cv_builder";

    sequelize = new Sequelize(dbUrl, {
      dialect: "postgres",
      models: [User, CV],
      logging:
        process.env.NODE_ENV === "development"
          ? (msg) => logger.info(msg)
          : false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      dialectOptions:
        process.env.NODE_ENV === "production"
          ? {
              ssl: {
                require: true,
                rejectUnauthorized: false,
              },
            }
          : {},
    });

    await sequelize.authenticate();
    logger.info("✅ PostgreSQL connected successfully");

    await sequelize.sync({ alter: process.env.NODE_ENV === "development" });
    logger.info("✅ Database synchronized");
  } catch (error) {
    logger.error("❌ PostgreSQL connection failed:", error);
    // Don't exit — allow server to keep running for health checks
  }
};
