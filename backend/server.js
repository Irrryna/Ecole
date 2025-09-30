// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

/* ------------ Middlewares de base ------------ */
app.use(morgan(process.env.NODE_ENV === 'production' ? 'tiny' : 'dev'));
app.use(express.json());

/* ------------ CORS (backend uniquement) ------------
                url/localhost du projet
*/
const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    // Autorise les requêtes sans Origin (curl, healthcheck, SSR) + liste blanche
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return cb(null, true);
    }
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true, // si tu utilises des cookies/Authorization
};
app.use(cors(corsOptions));
// Pré-vol (OPTIONS) pour toutes les routes
app.options('*', cors(corsOptions));

/* ------------ Routes ------------ */
// Healthchecks (pratique pour Render et pour toi)
app.get('/health', (_req, res) => res.sendStatus(200));              // sans /api
app.get('/api/health', (_req, res) => res.json({ ok: true }));       // avec /api

// Tes routes API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/trainers', require('./routes/trainers'));
app.use('/api/classes', require('./routes/classes'));

// 404 propre sur l’API
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

/* ------------ Démarrage ------------ */
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI; // accepte les deux noms
const PORT = process.env.PORT || 5000;

async function start() {
  try {
    if (MONGO_URI) {
      await mongoose.connect(MONGO_URI);
      console.log('✅ MongoDB connecté');
    } else {
      console.warn('⚠️  MONGO_URI/MONGODB_URI manquant. Le serveur démarre sans DB.');
    }

    app.listen(PORT, '0.0.0.0', () =>
      console.log(`🚀 Backend écoute sur port ${PORT}`)
    );
  } catch (err) {
    console.error('❌ Erreur au démarrage:', err.message);
    process.exit(1);
  }
}
start();
