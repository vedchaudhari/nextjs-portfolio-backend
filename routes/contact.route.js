// routes/contact.route.js
const express = require('express');
const router = express.Router();
const { contactController } = require('../controllers/contact.controller');

// POST /contact
router.post('/', contactController);

module.exports = router;
