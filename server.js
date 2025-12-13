const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
require('dotenv').config();

const contactRoutes = require('./routes/contact.route.js');
const connectDB = require('./db/db.js');
const { closeDB } = require('./db/db.js');
const job = require('./jobs/cron.jobs.js');
const { errorHandler, notFound } = require('./middleware/errorHandler.middleware.js');
const { generalLimiter } = require('./middleware/rateLimiter.middleware.js');
const validateEnv = require('./utils/validateEnv.utils.js');
const logger = require('./utils/logger.utils.js');

// Validate environment variables
validateEnv();

const app = express();

// Security Middlewares
if (process.env.NODE_ENV === "production") {
  app.use(helmet()); // includes HSTS
} else {
  app.use(
    helmet({
      hsts: false
    })
  );
}
app.use(mongoSanitize()); // Prevent MongoDB injection
app.use(xss()); // Prevent XSS attacks

// CORS Configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body Parser
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Rate Limiting
app.use('/api', generalLimiter);

// Routes
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Portfolio Backend API is running ✅',
        version: '2.0.0',
        endpoints: {
            contact: '/api/contact',
            health: '/api/health'
        }
    });
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running & healthy ✅',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// API Routes
app.use('/api/contact', contactRoutes);

// 404 Handler
app.use(notFound);

// Error Handler (must be last)
app.use(errorHandler);

// Connect to Database
connectDB();

// // Start the cron job ONLY in production
// if (process.env.NODE_ENV === 'production') {
//     job.start();
//     logger.info(`Cron job started with schedule: ${process.env.CRON_SCHEDULE || '*/14 * * * *'}`);
// }

// Graceful Shutdown
const gracefulShutdown = async (signal) => {
    logger.info(`${signal} received. Starting graceful shutdown...`);

    // Stop accepting new requests
    server.close(async () => {
        logger.info('HTTP server closed');

        // Stop cron job
        if (process.env.NODE_ENV === 'production') {
            // job.stop();
            logger.info('Cron job stopped');
        }

        // Close database connection
        await closeDB();

        logger.success('Graceful shutdown completed');
        process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
    }, 10000);
};

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    logger.success(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Promise Rejection', err);
    gracefulShutdown('UNHANDLED_REJECTION');
});

// Handle SIGTERM
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;
