import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { pool } from '../db.js';

export const authRouter = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Login endpoint
authRouter.post('/login', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Guest code required' });
    }

    // Get guest from database
    const result = await pool.query(
      'SELECT * FROM guests WHERE lower(code) = lower($1)',
      [String(code).trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Guest code not found' });
    }

    const guest = result.rows[0];

    // Create JWT token
    const token = jwt.sign(
      { guestCode: guest.code, displayName: guest.display_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      guest: {
        code: guest.code,
        displayName: guest.display_name,
        names: guest.names,
        seatsAllotted: guest.seats_allotted,
        tableName: guest.table_name,
        notes: guest.notes
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify token endpoint (check if token is still valid)
authRouter.post('/verify', (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, decoded });
  } catch (err) {
    res.status(401).json({ valid: false, error: 'Invalid or expired token' });
  }
});

// Get guest details and their RSVP (protected route)
authRouter.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const guestCode = decoded.guestCode;

    // Get guest details
    const guestResult = await pool.query(
      'SELECT code, display_name, names, seats_allotted, table_name, notes FROM guests WHERE code = $1',
      [guestCode]
    );

    if (guestResult.rows.length === 0) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    const guest = guestResult.rows[0];

    // Get RSVP details
    const rsvpResult = await pool.query(
      'SELECT * FROM rsvps WHERE guest_code = $1',
      [guestCode]
    );

    res.json({
      guest: {
        code: guest.code,
        displayName: guest.display_name,
        names: guest.names,
        seatsAllotted: guest.seats_allotted,
        tableName: guest.table_name,
        notes: guest.notes
      },
      rsvps: rsvpResult.rows
    });
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.error('Error fetching guest data:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
