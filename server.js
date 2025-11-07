const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const contactRoutes = require('./routes/contact.route.js');
const connectDB = require('./db/db.js');
const job = require('./jobs/cron.jobs.js'); // Import cron job

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Site backend is working fine ✅');
});

app.use('/api/contact', contactRoutes);

// Connect to DB
connectDB(process.env.MONGO_URI);

// Start the cron job ONLY in production
if (process.env.NODE_ENV === 'production') {
    job.start();
    console.log('⏰ Cron job started to keep the backend alive.');
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
