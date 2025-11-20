/**
 * Custom Logger Utility
 */
const logger = {
    info: (message, meta = {}) => {
        console.log(`ℹ️  [INFO] ${message}`, meta);
    },

    success: (message, meta = {}) => {
        console.log(`✅ [SUCCESS] ${message}`, meta);
    },

    warn: (message, meta = {}) => {
        console.warn(`⚠️  [WARN] ${message}`, meta);
    },

    error: (message, error = null) => {
        console.error(`❌ [ERROR] ${message}`);
        if (error) {
            console.error('Error details:', {
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    },

    debug: (message, data = {}) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`🔍 [DEBUG] ${message}`, data);
        }
    }
};

module.exports = logger;
