const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register
exports.register = async (req, res) => {
  const { name, email, password, profession, level } = req.body;

  try {
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const allowedProfessions = ['student', 'teacher', 'staff', 'dean', 'discipline_prefect'];
    if (!allowedProfessions.includes(profession)) {
      return res.status(400).json({ message: 'Invalid profession' });
    }

    if (profession === 'student' && !level) {
      return res.status(400).json({ message: 'Students must select a level' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (name, email, password, role, profession, level) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, 'user', profession, level || null]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.log('Register error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login and online status
    await db.query(
      'UPDATE users SET last_login = NOW(), is_online = TRUE WHERE id = ?',
      [user.id]
    );

    const token = jwt.sign(
      { id: user.id, role: user.role, profession: user.profession, level: user.level },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profession: user.profession,
        level: user.level,
      },
    });
  } catch (err) {
    console.log('Login error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Google Login
exports.googleLogin = async (req, res) => {
  const { email, name, google_id } = req.body;

  try {
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    let user;

    if (existing.length > 0) {
      user = existing[0];
    } else {
      const hashedPassword = await bcrypt.hash(google_id, 10);
      const [result] = await db.query(
        'INSERT INTO users (name, email, password, role, profession) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, 'user', 'student']
      );
      const [newUser] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
      user = newUser[0];
    }

    // Update last login and online status
    await db.query(
      'UPDATE users SET last_login = NOW(), is_online = TRUE WHERE id = ?',
      [user.id]
    );

    const token = jwt.sign(
      { id: user.id, role: user.role, profession: user.profession, level: user.level },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profession: user.profession,
        level: user.level,
      }
    });
  } catch (err) {
    console.log('Google login error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    await db.query(
      'UPDATE users SET last_logout = NOW(), is_online = FALSE WHERE id = ?',
      [req.user.id]
    );
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};