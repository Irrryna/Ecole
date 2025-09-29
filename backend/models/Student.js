const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
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
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
  },
});

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;
