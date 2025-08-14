const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

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

router.use(getUser);

// Share a resume
router.post('/:id/share', async (req, res) => {
    const { id } = req.params;
    const { email, permissions } = req.body;

    // 1. Find the user to share with
    const { data: sharedWithUser, error: findUserError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

    if (findUserError || !sharedWithUser) {
        return res.status(404).json({ message: 'User to share with not found.' });
    }

    // 2. Check if the resume belongs to the current user
    const { data: resume, error: resumeError } = await supabase
        .from('resumes')
        .select('id')
        .eq('id', id)
        .eq('user_id', req.user.id)
        .single();

    if (resumeError || !resume) {
        return res.status(404).json({ message: 'Resume not found or you do not have permission to share it.' });
    }

    // 3. Insert into the shared_resumes table
    const { data, error } = await supabase
        .from('shared_resumes')
        .insert([{
            resume_id: id,
            shared_by_user_id: req.user.id,
            shared_with_user_id: sharedWithUser.id,
            permissions: permissions || 'view'
        }])
        .select();

    if (error) {
        return res.status(500).json({ message: error.message });
    }

    res.status(201).json(data[0]);
});

// Get shared resumes for the current user
router.get('/shared-with-me', async (req, res) => {
    const { data, error } = await supabase
        .from('shared_resumes')
        .select('*, resumes(*, profiles:user_id(*))')
        .eq('shared_with_user_id', req.user.id);

    if (error) {
        return res.status(500).json({ message: error.message });
    }

    res.status(200).json(data);
});

module.exports = router;
