import { Router } from 'express';
import { pool } from '../db.js';

export const guestsRouter = Router();

function toGuestDTO(row) {
  return {
    code: row.code,
    displayName: row.display_name,
    names: row.names,
    seatsAllotted: row.seats_allotted,
    table: row.table_name,
    notes: row.notes
  };
}

// POST /api/guests/verify  { code }
// Used by the sign-in screen. Codes live only in the database now — not
// in the frontend's public JS bundle — so this is a real check, not just
// an obscurity gate.
guestsRouter.post('/verify', async (req, res) => {
  const code = String(req.body?.code || '').trim();
  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM guests WHERE lower(code) = lower($1)',
      [code]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Code not recognized' });
    }
    return res.json(toGuestDTO(result.rows[0]));
  } catch (err) {
    console.error('Guest verify failed', err);
    return res.status(500).json({ error: 'Server error' });
  }
});
