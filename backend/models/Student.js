const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Votre prénom /Ваше ім’я'],
  },
  lastName: {
    type: String,
    required: [true, 'Votre nom /Ваше прізвище'],
  },
  email: {
    type: String,
    required: [true, 'Votre email /Ваш email'],
    unique: true,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Veuillez fournir un email valide /Будь ласка, надайте дійсну електронну адресу',
    ],
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
  },
});

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;
