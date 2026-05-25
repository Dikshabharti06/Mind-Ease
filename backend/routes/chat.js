const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // Load environment variables

// Initialize Gemini API with error handling
let genAI;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('ERROR: GEMINI_API_KEY environment variable is not set!');
  }
  genAI = new GoogleGenerativeAI(apiKey);
  console.log('Gemini API initialized successfully');
} catch (error) {
  console.error('Failed to initialize Gemini API:', error);
}

// Helper function to generate response from Gemini API
async function generateGeminiResponse(message) {
  if (!genAI) {
    console.error('Gemini API not initialized');
    throw new Error('Gemini API not properly initialized. Check your API key.');
  }

  try {
    console.log('Sending request to Gemini API...');

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Chat with a fresh context (No history storage)
    const chat = model.startChat({
      history: [], // Start fresh
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    console.log('Sending message to Gemini:', message);
    const result = await chat.sendMessage(message);
    console.log('Received response from Gemini API');

    return result.response.text();
  } catch (error) {
    console.error('Error generating Gemini response:', error);
    return `I'm sorry, I'm having trouble processing your request right now. Error: ${error.message}`;
  }
}

// Get chat history for the current user (Now starts fresh every time)
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching chat history for user:', req.user.id);

    // Return a fresh chat start with welcome message
    const initialMessage = {
      sender: 'ai',
      message: "Hi there! I'm your mental wellness companion. How are you feeling today?",
    };

    res.json([initialMessage]);
  } catch (err) {
    console.error('Error fetching chat history:', err.message, err.stack);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Send a message and get AI response
router.post('/', auth, async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    console.error('Invalid message format received:', message);
    return res.status(400).json({ error: 'Invalid message format' });
  }

  try {
    console.log('Processing new message from user:', req.user.id);
    console.log('Message content (first 50 chars):', message.substring(0, 50) + (message.length > 50 ? '...' : ''));

    console.log('Generating AI response...');
    const aiResponseText = await generateGeminiResponse(message);
    console.log('AI response generated (first 50 chars):', aiResponseText.substring(0, 50) + (aiResponseText.length > 50 ? '...' : ''));

    // Send AI response
    const aiMessage = {
      sender: 'ai',
      message: aiResponseText
    };

    res.json(aiMessage);
  } catch (err) {
    console.error('Error processing message:', {
      error: err.message,
      stack: err.stack,
      userId: req.user.id,
      messageLength: message?.length
    });
    res.status(500).json({ 
      error: 'Failed to process message', 
      details: err.message 
    });
  }
});

// Reset chat (not needed for functionality but keeping for API completeness)
router.post('/reset', auth, (req, res) => {
  try {
    console.log('Resetting chat for user:', req.user.id);
    res.json({ message: 'Chat reset successful' });
  } catch (err) {
    console.error('Error resetting chat:', err.message, err.stack);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
