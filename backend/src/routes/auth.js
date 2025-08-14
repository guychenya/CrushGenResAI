const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// Endpoint to initiate LinkedIn OAuth
router.get('/linkedin/initiate', async (req, res) => {
    const { redirectTo } = req.query; // Get redirect URL from query params

    if (!redirectTo) {
        return res.status(400).json({ message: 'Redirect URL is required' });
    }

    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'linkedin',
            options: {
                redirectTo, // URL to redirect to after successful auth
            },
        });

        if (error) {
            console.error('Error initiating LinkedIn OAuth:', error);
            return res.status(500).json({ message: 'Failed to initiate LinkedIn login' });
        }

        res.status(200).json({ url: data.url });
    } catch (err) {
        console.error('Unexpected error during LinkedIn OAuth initiation:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Endpoint for LinkedIn OAuth callback (placeholder)
router.get('/linkedin/callback', (req, res) => {
    // In a real application, you would handle the callback from LinkedIn,
    // exchange the authorization code for an access token, and manage the user session.
    res.status(200).json({ message: 'LinkedIn callback received. User session would be managed here.' });
});

// Endpoint to get user profile
router.get('/profile', async (req, res) => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            console.error('Error fetching user profile:', error);
            return res.status(401).json({ message: 'Unauthorized' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error('Unexpected error fetching user profile:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
