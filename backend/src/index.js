require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resumes');
const aiRoutes = require('./routes/ai');
const jobRoutes = require('./routes/jobs');
const shareRoutes = require('./routes/share');

// Middleware
console.log('Initializing middleware...');
app.use(cors());
console.log('CORS middleware initialized.');
app.use(helmet());
console.log('Helmet middleware initialized.');
app.use(express.json());
console.log('Express JSON middleware initialized.');
app.use(morgan('dev'));
console.log('Morgan middleware initialized.');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/share', shareRoutes);


// Basic Routes
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

try {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
} catch (error) {
    console.error('Failed to start server:', error);
}

module.exports = app;
