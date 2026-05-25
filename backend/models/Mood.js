
const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    required: true,
    enum: ['happy', 'neutral', 'sad', 'anxious']
  },
  note: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Mood = mongoose.model('Mood', moodSchema);

module.exports = Mood;
