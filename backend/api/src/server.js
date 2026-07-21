import express from 'express';
import cors from 'cors';
import { guestsRouter } from './routes/guests.js';
import { rsvpRouter } from './routes/rsvp.js';
import { authRouter } from './routes/auth.js';

const app = express();

app.use(express.json());

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [];

const defaultOrigins = ['http://localhost:3000', 'http://localhost:3001'];
const origins = allowedOrigins.length > 0 ? allowedOrigins : defaultOrigins;

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (origins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-admin-key', 'Authorization'],
    credentials: true
  })
);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.use(['/api/guests', '/guests'], guestsRouter);
app.use(['/api/rsvp', '/rsvp'], rsvpRouter);
app.use(['/api/auth', '/auth'], authRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Wedding RSVP API listening on port ${port}`);
  console.log(`CORS allowed origins: ${origins.join(', ')}`);
});