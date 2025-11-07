// models/message.model.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    mobile: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    ip: String,
    userAgent: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
