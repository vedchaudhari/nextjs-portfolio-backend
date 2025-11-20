const cron = require('node-cron');
const axios = require('axios');
const logger = require('../utils/logger.utils');

/**
 * Cron job to keep the backend alive (prevents free tier sleep)
 * Runs every 14 minutes by default
 */
const schedule = process.env.CRON_SCHEDULE || '*/14 * * * *';

const job = cron.schedule(schedule, async () => {
  const url = process.env.API_URL;

  if (!url) {
    logger.error('API_URL is not defined in environment variables');
    return;
  }

  try {
    const res = await axios.get(url, {
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'Portfolio-Backend-KeepAlive/1.0'
      }
    });

    const timestamp = new Date().toLocaleString();
    logger.success(`[${timestamp}] Keep-alive ping successful → ${res.status} (${url})`);
  } catch (error) {
    const timestamp = new Date().toLocaleString();
    const status = error.response?.status || 'No response';
    const message = error.message || 'Unknown error';

    logger.error(`[${timestamp}] Keep-alive ping failed → ${status}`, new Error(message));
  }
}, {
  scheduled: false // Don't start automatically, let server.js control it
});

module.exports = job;
