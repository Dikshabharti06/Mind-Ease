
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Sleep = require('../models/Sleep');

// @route   GET api/sleep
// @desc    Get user's sleep records
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const sleep = await Sleep.find({ user: req.user.id }).sort({ date: -1 });
    res.json(sleep);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Helper function to check if a sleep record exists for the given date
const sleepRecordExistsForDate = async (userId, date) => {
  // Create date objects for start and end of the day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  // Check for records within this date range
  const existingRecord = await Sleep.findOne({
    user: userId,
    date: { $gte: startOfDay, $lte: endOfDay }
  });
  
  return existingRecord;
};

// @route   POST api/sleep
// @desc    Add a new sleep record or update existing one for the day
// @access  Private
router.post('/', auth, async (req, res) => {
  const { sleepTime, wakeTime, quality, duration, notes, date } = req.body;
  
  try {
    // Check if a record already exists for this date
    const recordDate = date ? new Date(date) : new Date();
    const existingRecord = await sleepRecordExistsForDate(req.user.id, recordDate);
    
    if (existingRecord) {
      // Update existing record instead of creating a new one
      existingRecord.sleepTime = sleepTime;
      existingRecord.wakeTime = wakeTime;
      existingRecord.quality = quality;
      existingRecord.duration = duration;
      existingRecord.notes = notes;
      
      const updatedSleep = await existingRecord.save();
      return res.json({ 
        ...updatedSleep._doc, 
        updated: true, 
        message: 'Sleep record updated for this date' 
      });
    }
    
    // Create new record if none exists
    const newSleep = new Sleep({
      user: req.user.id,
      sleepTime,
      wakeTime,
      quality,
      duration,
      notes,
      date: recordDate
    });

    const sleep = await newSleep.save();
    res.json(sleep);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/sleep/:id
// @desc    Update a sleep record
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { sleepTime, wakeTime, quality, duration, notes } = req.body;

  // Build sleep object
  const sleepFields = {};
  if (sleepTime) sleepFields.sleepTime = sleepTime;
  if (wakeTime) sleepFields.wakeTime = wakeTime;
  if (quality) sleepFields.quality = quality;
  if (duration) sleepFields.duration = duration;
  if (notes) sleepFields.notes = notes;

  try {
    let sleep = await Sleep.findById(req.params.id);

    if (!sleep) return res.status(404).json({ msg: 'Sleep record not found' });

    // Make sure user owns the sleep record
    if (sleep.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    sleep = await Sleep.findByIdAndUpdate(
      req.params.id,
      { $set: sleepFields },
      { new: true }
    );

    res.json(sleep);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/sleep/:id
// @desc    Delete a sleep record
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let sleep = await Sleep.findById(req.params.id);

    if (!sleep) return res.status(404).json({ msg: 'Sleep record not found' });

    // Make sure user owns the sleep record
    if (sleep.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Sleep.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Sleep record removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
