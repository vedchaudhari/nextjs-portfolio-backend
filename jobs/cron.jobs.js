const cron = require('node-cron');
const axios = require('axios');

const job = cron.schedule('*/14 * * * *', async () => {
  const url = process.env.API_URL;

  if (!url) {
    console.error('❌ API_URL is not defined in environment variables.');
    return;
  }

  try {
    const res = await axios.get(url);
    const timestamp = new Date().toLocaleString();
    console.log(`✅ [${timestamp}] Ping successful → ${res.status} (${url})`);
  } catch (error) {
    const timestamp = new Date().toLocaleString();
    console.error(
      `❌ [${timestamp}] Ping failed → ${error.response?.status || 'No response'}`
    );
  }
});

module.exports = job;
