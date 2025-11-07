// controllers/contact.controller.js
const Message = require('../models/message.model');
const { sendContactEmail } = require('../utils/mailer.utils.js');

const contactController = async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;

    // ✅ Simple validation
    if (!name || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name and message are required',
      });
    }

    // ✅ Save message to MongoDB
    const newMessage = await Message.create({
      name,
      email,
      mobile,
      message,
    });

    // ✅ Send email notification
    await sendContactEmail({ name, email, mobile, message });

    // ✅ Respond to frontend
    return res.status(200).json({
      success: true,
      message: 'Message received successfully',
      data: newMessage,
    });
  } catch (error) {
    console.error('❌ Error in contactController:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};

module.exports = { contactController };
