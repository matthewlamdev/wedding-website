import express from 'express';
import cors from 'cors';
import { guestsRouter } from './routes/guests.js';
import { rsvpRouter } from './routes/rsvp.js';
import { authRouter } from './routes/auth.js';

const app = express();

app.use(express.json());

// Only allow requests from your actual site. Set ALLOWED_ORIGIN in .env
// to your real domain (e.g. https://ourwedding.com) before deploying —
// otherwise this locks out your own frontend too.
const allowedOrigin = process.env.ALLOWED_ORIGIN;
app.use(
  cors({
    origin: allowedOrigin || false,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'x-admin-key', 'Authorization']
  })
);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.use('/api/guests', guestsRouter);
app.use('/api/rsvp', rsvpRouter);
app.use('/api/auth', authRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Wedding RSVP API listening on port ${port}`);
});
