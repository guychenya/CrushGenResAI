const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Create a new resume
router.post('/', async (req, res) => {
  const { title, content } = req.body;
  const { data: { user } } = await supabase.auth.getUser(req.headers.authorization.split(' ')[1]);

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { data, error } = await supabase
    .from('resumes')
    .insert([{ title, content, user_id: user.id }])
    .select();

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.status(201).json(data);
});

// Get all resumes for a user
router.get('/', async (req, res) => {
    const { data: { user } } = await supabase.auth.getUser(req.headers.authorization.split(' ')[1]);

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.status(200).json(data);
});

// Get a single resume
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { data: { user } } = await supabase.auth.getUser(req.headers.authorization.split(' ')[1]);

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  if (!data) {
    return res.status(404).json({ message: 'Resume not found' });
  }

  res.status(200).json(data);
});

// Update a resume
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const { data: { user } } = await supabase.auth.getUser(req.headers.authorization.split(' ')[1]);


  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { data, error } = await supabase
    .from('resumes')
    .update({ title, content, updated_at: new Date() })
    .eq('id', id)
    .eq('user_id', user.id)
    .select();

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.status(200).json(data);
});

// Delete a resume
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { data: { user } } = await supabase.auth.getUser(req.headers.authorization.split(' ')[1]);

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { error } = await supabase
    .from('resumes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.status(204).send();
});

module.exports = router;
