
const mongoose = require('mongoose');

const SleepSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  date: {
    type: Date,
    default: Date.now
  },
  sleepTime: {
    type: String,
    required: true
  },
  wakeTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  quality: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  notes: {
    type: String
  }
});

module.exports = mongoose.model('sleep', SleepSchema);
