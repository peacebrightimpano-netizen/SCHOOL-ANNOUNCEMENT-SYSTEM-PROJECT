const db = require('../config/db');

// Get all announcements (filtered by user role)
exports.getAll = async (req, res) => {
  try {
    const user = req.user

    let query = `
      SELECT a.*, c.name as category_name, u.name as created_by_name 
      FROM announcements a
      LEFT JOIN categories c ON a.category_id = c.id
      LEFT JOIN users u ON a.created_by = u.id
      WHERE 1=1
    `
    const params = []

    // If not admin, filter announcements
    if (!user || user.role !== 'admin') {
      if (user) {
        query += ` AND (
          a.target_audience = 'all'
          OR a.target_audience = ?
          OR (a.target_audience = 'personal' AND a.target_user_id = ?)
          OR (a.target_audience = ? )
        )`
        params.push(user.profession, user.id, user.level || '')
      } else {
        query += ` AND a.target_audience = 'all'`
      }
    }

    query += ` ORDER BY a.created_at DESC`

    const [announcements] = await db.query(query, params)
    res.json(announcements)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// Get single announcement
exports.getOne = async (req, res) => {
  try {
    const [announcement] = await db.query(
      `SELECT a.*, c.name as category_name, u.name as created_by_name 
       FROM announcements a
       LEFT JOIN categories c ON a.category_id = c.id
       LEFT JOIN users u ON a.created_by = u.id
       WHERE a.id = ?`,
      [req.params.id]
    )
    if (announcement.length === 0) {
      return res.status(404).json({ message: 'Announcement not found' })
    }
    res.json(announcement[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// Create announcement
exports.create = async (req, res) => {
  const { title, content, category_id, importance, target_audience, target_user_id } = req.body
  try {
    await db.query(
      'INSERT INTO announcements (title, content, category_id, importance, created_by, target_audience, target_user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, content, category_id, importance || 'medium', req.user.id, target_audience || 'all', target_user_id || null]
    )
    res.status(201).json({ message: 'Announcement created successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// Update announcement
exports.update = async (req, res) => {
  const { title, content, category_id, importance, target_audience, target_user_id } = req.body
  try {
    const [existing] = await db.query('SELECT * FROM announcements WHERE id = ?', [req.params.id])
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Announcement not found' })
    }
    await db.query(
      'UPDATE announcements SET title = ?, content = ?, category_id = ?, importance = ?, target_audience = ?, target_user_id = ? WHERE id = ?',
      [title, content, category_id, importance, target_audience || 'all', target_user_id || null, req.params.id]
    )
    res.json({ message: 'Announcement updated successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// Delete announcement
exports.remove = async (req, res) => {
  try {
    const [existing] = await db.query('SELECT * FROM announcements WHERE id = ?', [req.params.id])
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Announcement not found' })
    }
    await db.query('DELETE FROM announcements WHERE id = ?', [req.params.id])
    res.json({ message: 'Announcement deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// Get all users (for personal targeting)
exports.getUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, profession, level FROM users WHERE role != ?',
      ['admin']
    )
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}