
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini API with error handling
let genAI;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('ERROR: GEMINI_API_KEY environment variable is not set!');
  }
  genAI = new GoogleGenerativeAI(apiKey);
  console.log('Gemini API initialized successfully for tools');
} catch (error) {
  console.error('Failed to initialize Gemini API for tools:', error);
}

// Helper function to generate response from Gemini API for thought reframing
async function reframeThought(thought) {
  if (!genAI) {
    console.error('Gemini API not initialized');
    throw new Error('Gemini API not properly initialized. Check your API key.');
  }

  try {
    console.log('Sending thought to Gemini API for reframing...');

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `As an overthinking management coach, help reframe this negative thought into a more balanced, positive perspective. Keep your response concise (max 2-3 sentences) and empathetic. Only return the reframed thought, nothing else.

Original thought: "${thought}"

Reframed thought:`;

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();
    
    console.log('Thought reframing completed');
    return response;
  } catch (error) {
    console.error('Error reframing thought:', error);
    return `I'm having trouble reframing that thought right now. Remember that all thoughts are temporary, and negative thoughts aren't always accurate reflections of reality.`;
  }
}

// Helper function to analyze emotions with Gemini
async function analyzeEmotion(emotionText) {
  if (!genAI) {
    console.error('Gemini API not initialized');
    throw new Error('Gemini API not properly initialized. Check your API key.');
  }

  try {
    console.log('Sending emotion text to Gemini API for analysis...');

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `As an emotional intelligence coach, analyze this person's emotional state from their text. Return your analysis in the following JSON format only:
{
  "primaryEmotion": "the main emotion they seem to be experiencing",
  "reflection": "a 1-2 sentence empathetic reflection that validates their feelings",
  "suggestions": ["3-4 short, actionable suggestions to help manage this emotion", "suggestion 2", "suggestion 3"],
  "intensity": a number from 1-10 representing the intensity of their emotion
}

Their text: "${emotionText}"

JSON response:`;

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();
    
    try {
      // Try to parse the JSON response
      const parsedResponse = JSON.parse(response);
      console.log('Emotion analysis completed');
      return parsedResponse;
    } catch (jsonError) {
      console.error('Error parsing JSON response:', jsonError);
      // Fallback response if JSON parsing fails
      return {
        primaryEmotion: "unclear",
        reflection: "It seems you're experiencing some complex emotions. Your feelings are valid and it's good you're taking time to reflect.",
        suggestions: [
          "Try taking a few deep breaths",
          "Consider journaling more about this feeling",
          "Take a short break from screens"
        ],
        intensity: 5
      };
    }
  } catch (error) {
    console.error('Error analyzing emotion:', error);
    // Fallback response for API errors
    return {
      primaryEmotion: "unclear",
      reflection: "I'm having trouble analyzing your emotions right now, but what you're feeling is important.",
      suggestions: [
        "Try taking a few deep breaths",
        "Consider journaling more about this feeling",
        "Take a short break from screens"
      ],
      intensity: 5
    };
  }
}

// GET daily challenges
router.get('/challenges', auth, async (req, res) => {
  try {
    // This would come from database in a real implementation
    const challenges = [
      {
        id: '1',
        title: 'Gratitude Practice',
        description: 'Write down 3 things you are grateful for today',
        type: 'gratitude',
        completed: false,
        date: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Deep Breathing',
        description: 'Take 5 deep breaths, holding each for 5 seconds',
        type: 'mindfulness',
        completed: false,
        date: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Digital Detox',
        description: 'Take a 30-minute break from all screens today',
        type: 'action',
        completed: false,
        date: new Date().toISOString()
      }
    ];
    
    // Mock streak data - would come from user profile in real implementation
    const streak = 3;
    
    res.json({ challenges, streak });
  } catch (err) {
    console.error('Error fetching challenges:', err.message, err.stack);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// POST complete a challenge
router.post('/challenges/:id/complete', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real implementation, this would update the database
    console.log(`User ${req.user.id} completed challenge ${id}`);
    
    res.json({ success: true, message: 'Challenge completed successfully' });
  } catch (err) {
    console.error('Error completing challenge:', err.message, err.stack);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// POST reframe a negative thought
router.post('/reframe', auth, async (req, res) => {
  try {
    const { thought } = req.body;
    
    if (!thought) {
      return res.status(400).json({ error: 'Thought text is required' });
    }
    
    const reframed = await reframeThought(thought);
    
    res.json({ original: thought, reframed });
  } catch (err) {
    console.error('Error reframing thought:', err.message, err.stack);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// POST analyze emotions
router.post('/analyze-emotion', auth, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Emotion text is required' });
    }
    
    const analysis = await analyzeEmotion(text);
    
    res.json(analysis);
  } catch (err) {
    console.error('Error analyzing emotion:', err.message, err.stack);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
