// server.js
require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/db.js');
const contactRoutes = require('./routes/contact.route.js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/contact', contactRoutes);

// Connect DB
connectDB();

// Root endpoint
app.get('/', (req, res) => {
  res.send('Contact Backend is Running 🚀');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
