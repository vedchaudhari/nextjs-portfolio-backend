const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  mobile: { type: String },
  message: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
