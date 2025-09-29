const express = require('express');
const router = express.Router();
const Trainer = require('../models/Trainer');

// GET /api/trainers - Get all trainers
router.get('/', async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.json({ success: true, data: trainers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/trainers - Create a new trainer
router.post('/', async (req, res) => {
  try {
    const trainer = await Trainer.create(req.body);
    res.status(201).json({ success: true, data: trainer });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
