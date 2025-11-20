const logger = require('./logger.utils');

/**
 * Validates required environment variables
 */
const validateEnv = () => {
    const required = [
        'MONGO_URI',
        'RESEND_API_KEY',
        'TO_EMAIL',
        'FROM_EMAIL',
        'PORT'
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        logger.error(`Missing required environment variables: ${missing.join(', ')}`);
        logger.info('Please check your .env file and ensure all required variables are set.');
        process.exit(1);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(process.env.TO_EMAIL)) {
        logger.error('Invalid TO_EMAIL format in environment variables');
        process.exit(1);
    }

    if (!emailRegex.test(process.env.FROM_EMAIL)) {
        logger.error('Invalid FROM_EMAIL format in environment variables');
        process.exit(1);
    }

    logger.success('Environment variables validated successfully');
};

module.exports = validateEnv;
