
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register a new user
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    console.log('Received signup request for:', email);
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists:', email);
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password
    });

    // Save user to DB
    await user.save();
    console.log('New user created:', email);

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) {
          console.error('JWT sign error:', err);
          return res.status(500).json({ error: 'Error generating authentication token' });
        }
        console.log('JWT token created for user:', email);
        console.log('Token first 15 chars:', token.substring(0, 15) + '...');
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
      }
    );
  } catch (err) {
    console.error('Server error during signup:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt for:', email);
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Invalid login: User not found:', email);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Invalid login: Password incorrect for:', email);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    console.log('Successful login for:', email);

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        console.log('Token generated, first 15 chars:', token.substring(0, 15) + '...');
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
      }
    );
  } catch (err) {
    console.error('Server error during login:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    console.log('Getting user info for ID:', req.user.id);
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.log('User not found:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }
    console.log('User found:', user.email);
    res.json(user);
  } catch (err) {
    console.error('Server error getting current user:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Test endpoint to verify token
router.get('/verify-token', auth, (req, res) => {
  res.json({ valid: true, userId: req.user.id });
});

module.exports = router;
