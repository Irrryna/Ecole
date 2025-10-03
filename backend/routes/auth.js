// backend/routes/auth.js
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
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
    const { firstName, lastName, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normEmail = String(email).trim().toLowerCase();

    const exists = await User.findOne({ email: normEmail }).lean();
    if (exists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = new User({
      firstName,
      lastName,
      email: normEmail,
      password,
      role: 'PARENT'
    });

    const confirmationToken = user.getConfirmationToken();
    await user.save();

    const confirmUrl = `${process.env.CLIENT_URL}/verify-email/${confirmationToken}`;

    const message = `
      Bonjour ${user.firstName},

      Merci de vous être inscrit ! Veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse e-mail:

      <a href="${confirmUrl}">${confirmUrl}</a>

      Ce lien expirera dans 24 heures.

      Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet e-mail.

      Cordialement,
      L'équipe de l'École Ukrainienne de Lyon
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Confirmation de votre adresse e-mail',
        html: message
      });

      res.status(201).json({ 
        success: true, 
        message: `Un e-mail de confirmation a été envoyé à ${user.email}.` 
      });
    } catch (err) {
      console.error('Email sending error:', err);
      // Rollback user creation if email fails
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({ message: "L'e-mail n'a pas pu être envoyé. Veuillez réessayer." });
    }

  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/verify-email/:token
router.get('/verify-email/:token', async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      emailConfirmationToken: hashedToken,
      emailConfirmationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Token invalide ou expiré.' });
    }

    user.isVerified = true;
    user.emailConfirmationToken = undefined;
    user.emailConfirmationExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Email vérifié avec succès. Vous pouvez maintenant vous connecter.' });

  } catch (err) {
    console.error('Email verification error:', err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});


// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const normEmail = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    const user = await User.findOne({ email: normEmail }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Veuillez vérifier votre adresse e-mail avant de vous connecter.' });
    }

    const ok = await user.matchPassword(password);
    if (!ok) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    const token = sign(user);
    return res.json({
      token,
      role: user.role,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const u = await User.findById(req.user.id).select('-password');
    if (!u) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    return res.json(u);
  } catch (err) {
    console.error('Me error:', err);
    return res.status(500).json({ message: 'Erreur du serveur' });
  }
});

module.exports = router;