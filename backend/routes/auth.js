const express = require('express');
const router = express.Router();

function register(req, res) {
  require('../controllers/authController').register(req, res);
}

function login(req, res) {
  require('../controllers/authController').login(req, res);
}

function googleLogin(req, res) {
  require('../controllers/authController').googleLogin(req, res);
}

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);

module.exports = router;