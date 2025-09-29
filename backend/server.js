require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/trainers', require('./routes/trainers'));
app.use('/api/classes', require('./routes/classes'));

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Backend up' });
});

// Connexion MongoDB
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

async function start() {
  try {
    if (!MONGO_URI) {
      console.warn('⚠️  MONGO_URI manquant dans .env. Le serveur démarre sans DB.');
    } else {
      await mongoose.connect(MONGO_URI);
      console.log('✅ MongoDB connecté');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Backend écoute sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erreur au démarrage:', err.message);
    process.exit(1);
  }
}

start();
