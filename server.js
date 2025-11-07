const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const contactRoutes = require('./routes/contact.route.js');
const connectDB = require('./db/db.js');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/contact', contactRoutes);

connectDB(process.env.MONGO_URI)

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
