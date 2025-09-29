const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET /api/students - Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().populate('class', 'name');
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/students - Create a new student
router.post('/', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
