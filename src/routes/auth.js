const express = require('express');
const { googleAuth, completeProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/google', googleAuth);
router.post('/complete-profile', authenticate, completeProfile);

module.exports = router;