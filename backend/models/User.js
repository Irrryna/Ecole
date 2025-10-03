const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, trim: true },
  lastName:  { type: String, trim: true },

  email: {
    type: String,
    required: [true, 'Votre email /Ваш email'],
    unique: true,
    lowercase: true,
    index: true,
    match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i, 'Veuillez fournir un email valide /Будь ласка, надайте дійсну електронну адресу'],
  },

  password: {
    type: String,
    required: [true, 'Votre mot de passe /Ваш секретний пароль'],
    minlength: 6,
    select: false,
  },

  role: { type: String, enum: ['ADMIN', 'TEACHER', 'PARENT'], default: 'PARENT', index: true },

  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],

  // vérification email
  isEmailVerified: { type: Boolean, default: false },
  emailVerifyToken: String,
  emailVerifyExpires: Date,

}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.createEmailVerifyToken = function () {
  const raw = crypto.randomBytes(32).toString('hex');
  this.emailVerifyToken = crypto.createHash('sha256').update(raw).digest('hex');
  this.emailVerifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
  return raw;
};

UserSchema.set('toJSON', { transform: (_doc, ret) => { delete ret.password; return ret; } });

module.exports = mongoose.model('User', UserSchema);
