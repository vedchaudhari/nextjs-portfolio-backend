const Message = require('../models/message.model.js');
const { sendContactEmail } = require('../utils/mailer.utils.js');
const logger = require('../utils/logger.utils.js');

/**
 * Handle contact form submission
 * @route POST /api/contact
 */
const contactController = async (req, res, next) => {
  try {
    const { name, email, mobile, message } = req.body;

    // Get IP address and user agent for tracking
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    logger.info('New contact form submission', { name, email, ipAddress });

    // Save to database
    const newMessage = await Message.create({
      name,
      email,
      mobile,
      message,
      ipAddress,
      userAgent
    });

    // Send email notification (don't block response if email fails)
    sendContactEmail({ name, email, mobile, message })
      .catch(err => {
        logger.error('Email sending failed but message was saved', err);
      });

    logger.success('Contact message saved successfully', { id: newMessage._id });

    res.status(201).json({
      success: true,
      message: 'Message received successfully! We\'ll get back to you soon.',
      data: {
        id: newMessage._id,
        name: newMessage.name,
        createdAt: newMessage.createdAt
      }
    });
  } catch (error) {
    logger.error('Error in contactController', error);

    // Pass error to error handling middleware
    next(error);
  }
};

/**
 * Get all contact messages (admin only - add auth later)
 * @route GET /api/contact
 */
const getMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Message.countDocuments();

    res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching messages', error);
    next(error);
  }
};

module.exports = { contactController, getMessages };
