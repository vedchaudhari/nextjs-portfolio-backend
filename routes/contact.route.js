const express = require('express');
const { body } = require('express-validator');
const { contactController, getMessages } = require('../controllers/contact.controller');
const { handleValidationErrors } = require('../middleware/validate.middleware');
const { contactLimiter } = require('../middleware/rateLimiter.middleware');

const router = express.Router();

/**
 * Validation rules for contact form
 */
const contactValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
        .escape(),

    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail()
        .isLength({ max: 100 }).withMessage('Email cannot exceed 100 characters'),

    body('mobile')
        .optional()
        .trim()
        .isLength({ max: 20 }).withMessage('Mobile number cannot exceed 20 characters')
        .escape(),

    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters')
        .escape()
];

/**
 * @route   POST /api/contact
 * @desc    Submit contact form
 * @access  Public (rate limited)
 */
router.post('/', contactLimiter, contactValidation, handleValidationErrors, contactController);

/**
 * @route   GET /api/contact
 * @desc    Get all contact messages (for admin - add auth later)
 * @access  Public (should be protected)
 */
router.get('/', getMessages);

/**
 * @route   GET /api/contact/health
 * @desc    Health check for contact API
 * @access  Public
 */
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Contact API is healthy',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
