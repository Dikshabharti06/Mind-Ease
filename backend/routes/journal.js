
const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');
const auth = require('../middleware/auth');

// Get all journal entries for current user
router.get('/', auth, async (req, res) => {
  try {
    const entries = await Journal.find({ user: req.user.id }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new journal entry
router.post('/', auth, async (req, res) => {
  const { title, content, mood } = req.body;

  try {
    const newEntry = new Journal({
      user: req.user.id,
      title,
      content,
      mood
    });

    const savedEntry = await newEntry.save();
    res.json(savedEntry);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a specific journal entry
router.get('/:id', auth, async (req, res) => {
  try {
    const entry = await Journal.findById(req.params.id);
    
    // Check if entry exists
    if (!entry) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }
    
    // Check if user owns the entry
    if (entry.user.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    
    res.json(entry);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
