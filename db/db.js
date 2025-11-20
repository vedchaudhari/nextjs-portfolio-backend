const mongoose = require('mongoose');
const logger = require('../utils/logger.utils');

/**
 * Connect to MongoDB with retry logic
 * @param {number} retries - Number of retry attempts (default: 5)
 * @param {number} delay - Delay between retries in ms (default: 5000)
 */
const connectDB = async (retries = 5, delay = 5000) => {
  const attempt = async (retriesLeft) => {
    try {
      // Remove deprecated options - they're now defaults in Mongoose 6+
      const conn = await mongoose.connect(process.env.MONGO_URI);

      logger.success(`MongoDB connected: ${conn.connection.host}`);

      // Connection event listeners
      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
      });

      mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error', err);
      });

      mongoose.connection.on('reconnected', () => {
        logger.success('MongoDB reconnected');
      });

    } catch (error) {
      logger.error(`MongoDB connection failed (${retries - retriesLeft + 1}/${retries})`, error);

      if (retriesLeft > 0) {
        logger.info(`Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return attempt(retriesLeft - 1);
      } else {
        logger.error('All MongoDB connection attempts failed. Exiting...');
        process.exit(1);
      }
    }
  };

  await attempt(retries);
};

/**
 * Gracefully close database connection
 */
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error('Error closing MongoDB connection', error);
  }
};

module.exports = connectDB;
module.exports.closeDB = closeDB;
