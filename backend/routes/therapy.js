
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Therapy = require('../models/Therapy');

// @route   GET api/therapy/therapists
// @desc    Get all therapists
// @access  Private
router.get('/therapists', auth, async (req, res) => {
  try {
    const { specialty } = req.query;
    let query = {};
    
    if (specialty) {
      query.specialties = specialty;
    }
    
    const therapists = await Therapy.find(query);
    res.json(therapists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/therapy/therapists/:id
// @desc    Get a specific therapist
// @access  Private
router.get('/therapists/:id', auth, async (req, res) => {
  try {
    const therapist = await Therapy.findById(req.params.id);
    
    if (!therapist) {
      return res.status(404).json({ msg: 'Therapist not found' });
    }
    
    res.json(therapist);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Therapist not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/therapy/appointment
// @desc    Book a therapy appointment
// @access  Private
router.post('/appointment', auth, async (req, res) => {
  const { therapistId, date, time, type, concerns } = req.body;

  try {
    const newAppointment = new Therapy.Appointment({
      user: req.user.id,
      therapist: therapistId,
      date,
      time,
      type,
      concerns
    });

    const appointment = await newAppointment.save();
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/therapy/appointments
// @desc    Get user's appointments
// @access  Private
router.get('/appointments', auth, async (req, res) => {
  try {
    const appointments = await Therapy.Appointment.find({ user: req.user.id })
      .sort({ date: 1 })
      .populate('therapist', ['name', 'title', 'image']);
    
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/therapy/appointment/:id
// @desc    Update an appointment
// @access  Private
router.put('/appointment/:id', auth, async (req, res) => {
  const { date, time, type, concerns } = req.body;

  // Build appointment object
  const appointmentFields = {};
  if (date) appointmentFields.date = date;
  if (time) appointmentFields.time = time;
  if (type) appointmentFields.type = type;
  if (concerns) appointmentFields.concerns = concerns;

  try {
    let appointment = await Therapy.Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    // Make sure user owns the appointment
    if (appointment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    appointment = await Therapy.Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: appointmentFields },
      { new: true }
    );

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/therapy/appointment/:id
// @desc    Cancel an appointment
// @access  Private
router.delete('/appointment/:id', auth, async (req, res) => {
  try {
    let appointment = await Therapy.Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    // Make sure user owns the appointment
    if (appointment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Therapy.Appointment.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Appointment cancelled' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
