const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const journalRoutes = require('./routes/journal');
const meditationRoutes = require('./routes/meditation');
const moodRoutes = require('./routes/mood');
const chatRoutes = require('./routes/chat');
const communityRoutes = require('./routes/community');
const toolsRoutes = require('./routes/tools');
const sleepRoutes = require('./routes/sleep');
const therapyRoutes = require('./routes/therapy');

// Load environment variables
dotenv.config();

// Check critical environment variables
if (!process.env.MONGODB_URL || !process.env.JWT_SECRET) {
  console.error('Error: Missing required environment variables');
  process.exit(1);
}

if (!process.env.GEMINI_API_KEY) {
  console.warn('Warning: GEMINI_API_KEY not set. Chat and tools will use fallback responses.');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Configure CORS with more permissive settings for development
app.use(cors({
  origin: ['http://localhost:8080', 'http://192.168.41.147:8080', 'http://localhost:5173', 'https://psyc-frontend.vercel.app', 'https://psyco.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization'],
  credentials: true // Allow cookies to be sent with requests
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Debug routes for troubleshooting
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/meditation', meditationRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/sleep', sleepRoutes);
app.use('/api/therapy', therapyRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Test route for checking server connectivity
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'API server is running and accessible' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
