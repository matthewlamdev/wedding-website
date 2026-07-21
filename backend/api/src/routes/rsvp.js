import { Router } from 'express';
import { pool } from '../db.js';
import { requireAdminKey } from '../middleware/adminAuth.js';

export const rsvpRouter = Router();

// clamps the seat count to what that guest was actually allotted.
rsvpRouter.post('/', async (req, res) => {
  const { guestCode, name, email, attending, guests, dietary, note } = req.body || {};

  if (!guestCode || !name || !email || !['yes', 'no'].includes(attending)) {
    return res.status(400).json({ error: 'Missing or invalid required fields' });
  }

  try {
    const guestResult = await pool.query(
      'SELECT * FROM guests WHERE lower(code) = lower($1)',
      [String(guestCode).trim()]
    );
    if (guestResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid guest code' });
    }
    const guestRow = guestResult.rows[0];

    const requested = parseInt(guests, 10) || 1;
    const guestsCount = Math.min(Math.max(requested, 1), guestRow.seats_allotted);

    await pool.query(
      `INSERT INTO rsvps (guest_code, name, email, attending, guests_count, dietary, note)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        guestRow.code,
        String(name).trim(),
        String(email).trim(),
        attending,
        guestsCount,
        (dietary || '').trim(),
        (note || '').trim()
      ]
    );

    return res.json({ ok: true });
  } catch (err) {
    console.error('RSVP submission failed', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/rsvp — list every RSVP, newest first. Protected: requires
// header `x-admin-key: <ADMIN_KEY>`.
rsvpRouter.get('/', requireAdminKey, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.id, r.guest_code, g.display_name, r.name, r.email, r.attending,
              r.guests_count, r.dietary, r.note, r.submitted_at
       FROM rsvps r
       LEFT JOIN guests g ON g.code = r.guest_code
       ORDER BY r.submitted_at DESC`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('Failed to list RSVPs', err);
    return res.status(500).json({ error: 'Server error' });
  }
});
