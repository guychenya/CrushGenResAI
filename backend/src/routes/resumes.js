const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Create a new resume
router.post('/', async (req, res) => {
  const { title, content } = req.body;
  const { uid } = req.user;

  try {
    const { rows } = await db.query(
      'INSERT INTO resumes (title, content, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, content, uid]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all resumes for a user
router.get('/', async (req, res) => {
  const { uid } = req.user;
  try {
    const { rows } = await db.query('SELECT * FROM resumes WHERE user_id = $1', [uid]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single resume
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { uid } = req.user;

  try {
    const { rows } = await db.query('SELECT * FROM resumes WHERE id = $1 AND user_id = $2', [id, uid]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a resume
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const { uid } = req.user;

  try {
    const { rows } = await db.query(
      'UPDATE resumes SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 AND user_id = $4 RETURNING *',
      [title, content, id, uid]
    );
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a resume
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { uid } = req.user;

  try {
    await db.query('DELETE FROM resumes WHERE id = $1 AND user_id = $2', [id, uid]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
