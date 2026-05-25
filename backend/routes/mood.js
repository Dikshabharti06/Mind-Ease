
const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');
const Meditation = require('../models/Meditation');
const auth = require('../middleware/auth');

// Get all moods for current user
router.get('/', auth, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id }).sort({ date: -1 });
    res.json(moods);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new mood entry
router.post('/', auth, async (req, res) => {
  const { mood, note } = req.body;

  try {
    // Create the new mood entry
    const newMood = new Mood({
      user: req.user.id,
      mood,
      note
    });

    const savedMood = await newMood.save();
    
    // Find relevant meditations based on mood
    let recommendedMeditations = await findRecommendedMeditations(mood);
    
    // Return both mood data and recommendations
    res.json({
      mood: savedMood,
      recommendations: recommendedMeditations
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Function to find recommended meditations based on mood
async function findRecommendedMeditations(mood) {
  try {
    let searchTerms = [];
    
    // Map mood to relevant keywords for meditation recommendations
    switch(mood) {
      case 'happy':
        searchTerms = ['gratitude', 'joy', 'positive', 'happiness'];
        break;
      case 'sad':
        searchTerms = ['comfort', 'healing', 'uplift', 'peace'];
        break;
      case 'anxious':
        searchTerms = ['calm', 'anxiety relief', 'relaxation', 'stress'];
        break;
      case 'neutral':
        searchTerms = ['balance', 'mindfulness', 'awareness', 'present'];
        break;
      default:
        searchTerms = ['mindfulness', 'balance'];
    }
    
    // Create regex patterns for searching titles and descriptions
    const searchPatterns = searchTerms.map(term => new RegExp(term, 'i'));
    
    // Find meditations that match the search terms in title or description
    const meditations = await Meditation.find({
      $or: [
        { title: { $in: searchPatterns } },
        { description: { $in: searchPatterns } },
        { category: { $in: searchPatterns } }
      ]
    }).limit(3);
    
    // If we don't have enough results, add some general mindfulness meditations
    if (meditations.length < 3) {
      const additionalMeditations = await Meditation.find({
        _id: { $nin: meditations.map(m => m._id) }
      }).limit(3 - meditations.length);
      
      return [...meditations, ...additionalMeditations];
    }
    
    return meditations;
  } catch (error) {
    console.error('Error finding recommendations:', error);
    return [];
  }
}

module.exports = router;
