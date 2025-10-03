// backend/routes/auth.js
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const { requireAuth } = require('../middleware/auth');
// Génération du JWT
function sign(u) {
  return jwt.sign(
    { id: u._id, role: u.role, email: u.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password /* role */ } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Потрібні email і пароль' });
    }

    const normEmail = String(email).trim().toLowerCase();

    // Vérifie l'existence (case-insensitive)
    const exists = await User.findOne({ email: normEmail }).lean();
    if (exists) {
      return res.status(400).json({ message: 'Електронна адреса вже використовується' });
    }

    //  ne pas accepter le rôle depuis le body
    const user = await User.create({
      firstName,
      lastName,
      email: normEmail,
      password,
      role: 'PARENT' // rôle par défaut sécurisé
    });

    const token = sign(user);
    return res.status(201).json({
      token,
      role: user.role,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email }
    });
  } catch (err) {
    // Duplicate key Mongo (unique index)
    if (err && err.code === 11000) {
      return res.status(400).json({ message: 'Електронна адреса вже використовується' });
    }
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Сталася помилка' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const normEmail = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    const user = await User.findOne({ email: normEmail }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Користувача не знайдено' });
    }

    const ok = await user.matchPassword(password);
    if (!ok) {
      return res.status(400).json({ message: 'Невірний пароль' });
    }

    const token = sign(user);
    return res.json({
      token,
      role: user.role,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Сталася помилка' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const u = await User.findById(req.user.id).select('-password');
    if (!u) return res.status(404).json({ message: 'Користувача не знайдено' });
    return res.json(u);
  } catch (err) {
    console.error('Me error:', err);
    return res.status(500).json({ message: 'Сталася помилка' });
  }
});

module.exports = router;
