import { Sequelize } from 'sequelize-typescript';
import { logger } from '../utils/logger';
import User from './User';
import CV from './CV';

let sequelize: Sequelize;

export const initializeDatabase = async () => {
  try {
    const dbUrl = process.env.DATABASE_URL;
    
    if (!dbUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    // Configure Sequelize for Render PostgreSQL
    sequelize = new Sequelize(dbUrl, {
      dialect: 'postgres',
      models: [User, CV],
      logging: process.env.NODE_ENV === 'development' 
        ? (msg) => logger.info(msg) 
        : false,
      pool: {
        max: parseInt(process.env.DB_POOL_MAX || '5'),
        min: parseInt(process.env.DB_POOL_MIN || '0'),
        acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000'),
        idle: parseInt(process.env.DB_POOL_IDLE || '10000'),
      },
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
          require: true,
          rejectUnauthorized: false
        } : false,
      },
      define: {
        timestamps: true,
        underscored: false,
        freezeTableName: true,
      }
    });

    // Test the connection
    await sequelize.authenticate();
    logger.info('✅ PostgreSQL connected successfully');

    // Sync database (create tables if they don't exist)
    await sequelize.sync({ 
      alter: process.env.NODE_ENV === 'development',
      force: false 
    });
    logger.info('✅ Database synchronized');

    return sequelize;
  } catch (error) {
    logger.error('❌ PostgreSQL connection failed:', error);
    throw error;
  }
};

export const closeDatabase = async () => {
  try {
    if (sequelize) {
      await sequelize.close();
      logger.info('PostgreSQL disconnected');
    }
  } catch (error) {
    logger.error('Error disconnecting from PostgreSQL:', error);
  }
};

export { sequelize };
export { User, CV };