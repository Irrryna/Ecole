const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, trim: true },
  lastName:  { type: String, trim: true },

  email: {
    type: String,
    required: [true, 'Votre email /Ваш email'],
    unique: true,
    lowercase: true,
    index: true,
    match: [
      /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i,
      'Veuillez fournir un email valide /Будь ласка, надайте дійсну електронну адресу',
    ],
  },

  password: {
    type: String,
    required: [true, 'Votre mot de passe /Ваш секретний пароль'],
    minlength: 6,
    select: false, // jamais renvoyé par défaut
  },

  // Rôle pour portail
  role: {
    type: String,
    enum: ['ADMIN', 'TEACHER', 'PARENT'],
    default: 'PARENT',
    index: true,
  },

}, { timestamps: true });

// Hash du mot de passe si modifié
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Comparaison mot de passe
UserSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Nettoyage JSON (jamais exposer le hash)
UserSchema.set('toJSON', {
  transform: (_doc, ret) => { delete ret.password; return ret; }
});

module.exports = mongoose.model('User', UserSchema);
