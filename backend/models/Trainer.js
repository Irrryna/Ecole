const mongoose = require('mongoose');

const TrainerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide a first name'],
  },
  lastName: {
    type: String,
    required: [true, 'Please provide a last name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Please provide a valid email',
    ],
  },
  expertise: {
    type: String,
    required: [true, 'Please provide an expertise'],
  },
});

const Trainer = mongoose.model('Trainer', TrainerSchema);

module.exports = Trainer;
