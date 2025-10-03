const router = require('express').Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library'); // login Google (optionnel)
const User = require('../models/Users');
const { requireAuth } = require('../middleware/auth');
const sendEmail = require('../../tools/sendEmail'); // <- tools/sendEmail.js à la racine du projet

const CLIENT_ORIGIN = (process.env.CLIENT_ORIGIN || 'http://localhost:3000').split(',')[0].trim();
const googleClient = process.env.GOOGLE_CLIENT_ID ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID) : null;

function sign(u) {
  return jwt.sign({ id: u._id, role: u.role, email: u.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// ---------- REGISTER (envoie mail de vérif, pas de login auto)
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password /* role */ } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Потрібні email і пароль' });

    const normEmail = String(email).trim().toLowerCase();
    const exists = await User.findOne({ email: normEmail }).lean();
    if (exists) return res.status(400).json({ message: 'Електронна адреса вже використовується' });

    const user = await User.create({ firstName, lastName, email: normEmail, password, role: 'PARENT' });

    // token de vérification
    const rawToken = user.createEmailVerifyToken();
    await user.save({ validateBeforeSave: false });

    const verifyUrl = `${CLIENT_ORIGIN}/verify-email?token=${rawToken}`;
    const subject = 'Confirmez votre e-mail / Підтвердіть свою електронну адресу';
    const html = `
      <p>Bonjour ${firstName || ''},</p>
      <p>Merci pour votre inscription à l’École Ukrainienne de Lyon.</p>
      <p>Veuillez confirmer votre e-mail en cliquant sur le lien ci-dessous :</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      <hr/>
      <p>Вітаємо${firstName ? `, ${firstName}` : ''}!</p>
      <p>Дякуємо за реєстрацію в Українській Школі в Ліоні.</p>
      <p>Будь ласка, підтвердіть свою адресу електронної пошти за посиланням вище.</p>
    `;

    await sendEmail({ to: normEmail, subject, html, text: `Confirmez : ${verifyUrl}` });

    return res.status(201).json({ ok: true, message: 'E-mail de confirmation envoyé' });
  } catch (err) {
    // gestion duplicate key
    if (err && err.code === 11000) return res.status(400).json({ message: 'Електронна адреса вже використовується' });
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Сталася помилка' });
  }
});

// ---------- VERIFY EMAIL
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: 'Немає токена' });

    const hashed = crypto.createHash('sha256').update(String(token)).digest('hex');
    const user = await User.findOne({
      emailVerifyToken: hashed,
      emailVerifyExpires: { $gt: new Date() }
    });

    if (!user) return res.status(400).json({ message: 'Недійсний або прострочений токен' });

    user.isEmailVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // Redirige vers le front (login) avec flag
    const redirectTo = `${CLIENT_ORIGIN}/login?verified=1`;
    return res.redirect(302, redirectTo);
  } catch (err) {
    console.error('Verify error:', err);
    return res.status(500).json({ message: 'Сталася помилка' });
  }
});

// ---------- RESEND VERIFY
router.post('/resend-verify', async (req, res) => {
  try {
    const normEmail = String(req.body.email || '').trim().toLowerCase();
    const user = await User.findOne({ email: normEmail });
    if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });
    if (user.isEmailVerified) return res.json({ ok: true, message: 'Вже підтверджено' });

    const rawToken = user.createEmailVerifyToken();
    await user.save({ validateBeforeSave: false });

    const verifyUrl = `${CLIENT_ORIGIN}/verify-email?token=${rawToken}`;
    await sendEmail({
      to: normEmail,
      subject: 'Confirmez votre e-mail / Підтвердіть свою електронну адресу',
      html: `<p>Confirmez : <a href="${verifyUrl}">${verifyUrl}</a></p>`,
      text: `Confirmez : ${verifyUrl}`
    });

    return res.json({ ok: true, message: 'E-mail renvoyé' });
  } catch (err) {
    console.error('Resend verify error:', err);
    return res.status(500).json({ message: 'Сталася помилка' });
  }
});

// ---------- LOGIN (bloque si email non vérifié)
router.post('/login', async (req, res) => {
  try {
    const normEmail = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    const user = await User.findOne({ email: normEmail }).select('+password');
    if (!user) return res.status(400).json({ message: 'Користувача не знайдено' });

    const ok = await user.matchPassword(password);
    if (!ok) return res.status(400).json({ message: 'Невірний пароль' });

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: 'Будь ласка, підтвердіть свою електронну адресу' });
    }

    const token = sign(user);
    return res.json({ token, role: user.role, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Сталася помилка' });
  }
});

// ---------- GOOGLE LOGIN (optionnel, envoie id_token depuis le front)
router.post('/google', async (req, res) => {
  try {
    if (!googleClient) return res.status(500).json({ message: 'Google non configuré' });
    const { id_token } = req.body;
    if (!id_token) return res.status(400).json({ message: 'id_token manquant' });

    const ticket = await googleClient.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload(); // { email, email_verified, given_name, family_name, picture, ... }

    if (!payload?.email_verified) return res.status(400).json({ message: 'Compte Google non vérifié' });

    const email = payload.email.toLowerCase();
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        password: crypto.randomBytes(20).toString('hex'), // dummy
        isEmailVerified: true, // Google vérifié
        role: 'PARENT'
      });
    } else if (!user.isEmailVerified) {
      user.isEmailVerified = true;
      await user.save({ validateBeforeSave: false });
    }

    const token = sign(user);
    return res.json({ token, role: user.role, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email } });
  } catch (err) {
    console.error('Google login error:', err);
    return res.status(500).json({ message: 'Сталася помилка' });
  }
});

// ---------- ME
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
