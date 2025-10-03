const mongoose = require('mongoose');

const TrainerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Votre prénom /Ваше імя'],
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
  expertise: {
    type: String,
    required: [true, 'Matière enseignée /Предмет викладання'],
  },
});

const Trainer = mongoose.model('Trainer', TrainerSchema);

module.exports = Trainer;
