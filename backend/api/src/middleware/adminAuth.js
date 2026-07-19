// Simple shared-secret auth for the "view all RSVPs" endpoint.
// Not a full auth system — fine for a single admin (you) hitting the API
// directly or from a small internal dashboard. Send the key as:
//   x-admin-key: <ADMIN_KEY>

export function requireAdminKey(req, res, next) {
  const key = req.header('x-admin-key');
  if (!process.env.ADMIN_KEY) {
    return res.status(500).json({ error: 'Server misconfigured: ADMIN_KEY not set' });
  }
  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
