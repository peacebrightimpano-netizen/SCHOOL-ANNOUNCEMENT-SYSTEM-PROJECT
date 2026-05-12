const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove, getUsers } = require('../controllers/announcementController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Public routes (but filtered by user if logged in)
router.get('/', (req, res, next) => {
  // Try to get token but don't require it
  const token = req.headers['authorization']?.split(' ')[1];
  if (token) {
    const jwt = require('jsonwebtoken');
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      req.user = null;
    }
  }
  next();
}, getAll);

router.get('/users', auth, isAdmin, getUsers);
router.get('/:id', getOne);

// Admin only routes
router.post('/', auth, isAdmin, create);
router.put('/:id', auth, isAdmin, update);
router.delete('/:id', auth, isAdmin, remove);

module.exports = router;