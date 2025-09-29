const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const auth = require('../middleware/auth'); // Assuming you have an auth middleware

// GET /api/classes - Get all classes
router.get('/', async (req, res) => {
  try {
    // Removed populate('trainer') as trainer field is removed from schema
    const classes = await Class.find().populate('students', 'firstName lastName');
    res.json({ success: true, data: classes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/classes - Create a new class (protected)
router.post('/', auth, async (req, res) => {
  try {
    const newClass = await Class.create(req.body);
    res.status(201).json({ success: true, data: newClass });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT /api/classes/:id - Update a class (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedClass) {
      return res.status(404).json({ success: false, error: 'Class not found' });
    }
    res.json({ success: true, data: updatedClass });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE /api/classes/:id - Delete a class (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ success: false, error: 'Class not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;