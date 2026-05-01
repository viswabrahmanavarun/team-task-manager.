const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  searchUsers,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.get('/search', protect, searchUsers);

module.exports = router;
