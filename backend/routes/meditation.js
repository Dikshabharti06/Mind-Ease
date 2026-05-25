
const express = require('express');
const router = express.Router();
const Meditation = require('../models/Meditation');
const auth = require('../middleware/auth');
const axios = require('axios');
require('dotenv').config();

// YouTube API Key (this should be in your .env file)
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Function to fetch YouTube videos
async function fetchYouTubeVideos(searchQuery, maxResults = 5) {
  try {
    console.log(`Fetching YouTube videos for: ${searchQuery} meditation`);
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        maxResults,
        q: searchQuery + ' meditation',
        type: 'video',
        videoDuration: 'medium',
        key: YOUTUBE_API_KEY
      }
    });

    return response.data.items.map(item => ({
      title: item.snippet.title,
      description: item.snippet.description,
      videoUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
      imageUrl: item.snippet.thumbnails.high.url,
      duration: 'Variable',
      category: searchQuery,
    }));
  } catch (error) {
    console.error('YouTube API Error:', error.message);
    if (error.response) {
      console.error('API Response:', error.response.data);
    }
    return [];
  }
}

// Get all exercises
router.get('/', async (req, res) => {
  try {
    const category = req.query.category;
    const duration = req.query.duration;
    const refresh = req.query.refresh === 'true';
    
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (duration) {
      query.duration = duration;
    }
    
    // Get stored meditations
    const storedMeditations = await Meditation.find(query);
    
    // Check if we need to fetch from YouTube API
    let youtubeVideos = [];
    if (refresh) {
      // Fetch categories that use YouTube API
      const categories = await Meditation.distinct('category');
      for (const cat of categories) {
        const ytVideos = await fetchYouTubeVideos(cat);
        youtubeVideos.push(...ytVideos);
      }
      
      // If we got videos, return both stored and new
      if (youtubeVideos.length > 0) {
        return res.json([...storedMeditations, ...youtubeVideos]);
      }
    }
    
    res.json(storedMeditations);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get exercise by ID
router.get('/:id', async (req, res) => {
  try {
    const exercise = await Meditation.findById(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    
    res.json(exercise);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Track exercise completion
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const { feedback, effectivenessRating } = req.body;
    
    const exercise = await Meditation.findById(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    
    // Here you would typically store the completion record
    // with the user's feedback and rating
    
    res.json({ success: true, message: 'Completion recorded' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add or remove from favorites
router.post('/:id/favorite', auth, async (req, res) => {
  try {
    const { action } = req.body; // 'add' or 'remove'
    
    const meditation = await Meditation.findById(req.params.id);
    
    if (!meditation) {
      return res.status(404).json({ error: 'Meditation not found' });
    }
    
    if (action === 'add') {
      meditation.favorites += 1;
    } else if (action === 'remove' && meditation.favorites > 0) {
      meditation.favorites -= 1;
    }
    
    await meditation.save();
    
    res.json({ success: true, message: `Meditation ${action === 'add' ? 'added to' : 'removed from'} favorites`, favorites: meditation.favorites });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Refresh YouTube videos
router.get('/refresh/youtube', async (req, res) => {
  try {
    const category = req.query.category;
    let searchQuery = category || 'meditation';
    
    const videos = await fetchYouTubeVideos(searchQuery);
    
    res.json(videos);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error fetching YouTube videos' });
  }
});

module.exports = router;
