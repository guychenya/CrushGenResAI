const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// Middleware to get user from Supabase
const getUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing' });
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    next();
};

// Apply the middleware to all routes in this file
router.use(getUser);

// Create a new job
router.post('/', async (req, res) => {
    const { title, company, description, location, url } = req.body;
    const { data, error } = await supabase
        .from('jobs')
        .insert([{ title, company, description, location, url, user_id: req.user.id }])
        .select();

    if (error) {
        return res.status(500).json({ message: error.message });
    }
    res.status(201).json(data[0]);
});

// Get all jobs for a user
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', req.user.id)
        .order('created_at', { ascending: false });

    if (error) {
        return res.status(500).json({ message: error.message });
    }
    res.status(200).json(data);
});

// Get a single job
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .eq('user_id', req.user.id)
        .single();

    if (error) {
        return res.status(500).json({ message: error.message });
    }
    if (!data) {
        return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(data);
});

// Update a job
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, company, description, location, url, status } = req.body;

    const { data, error } = await supabase
        .from('jobs')
        .update({ title, company, description, location, url, status, updated_at: new Date() })
        .eq('id', id)
        .eq('user_id', req.user.id)
        .select();

    if (error) {
        return res.status(500).json({ message: error.message });
    }
    res.status(200).json(data[0]);
});

// Delete a job
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id)
        .eq('user_id', req.user.id);

    if (error) {
        return res.status(500).json({ message: error.message });
    }
    res.status(204).send();
});

module.exports = router;
