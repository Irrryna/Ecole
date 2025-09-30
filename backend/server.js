// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// ---------- Middlewares
app.use(morgan(process.env.NODE_ENV === 'production' ? 'tiny' : 'dev'));
app.use(express.json());

// CORS: accepte plusieurs origines (on les separe avec virgules)
const allowed = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // autorise requêtes sans origin (curl/healthcheck) + liste blanche
    if (!origin || allowed.length === 0 || allowed.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.options('*', cors()); // pré-vol

// ---------- Routes
app.get('/api/health', (_req, res) => res.json({ ok: true, message: 'Backend up' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/trainers', require('./routes/trainers'));
app.use('/api/classes', require('./routes/classes'));

// 404 propre sur l’API
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// ---------- Boot
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

async function start() {
  try {
    if (MONGO_URI) {
      await mongoose.connect(MONGO_URI);
      console.log('✅ MongoDB connecté');
    } else {
      console.warn('⚠️  MONGO_URI manquant. Le serveur démarre sans DB.');
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Backend écoute sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erreur au démarrage:', err.message);
    process.exit(1);
  }
}
start();
