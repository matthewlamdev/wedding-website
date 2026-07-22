export function GuestInfoCard({ guestData, rsvpData }) {
  return (
    <div className="wrap" style={{ marginTop: 20 }}>
      <div className="guest-info-card">
        <h2>Welcome, {guestData.displayName}!</h2>
        <div className="guest-details">
          <div className="detail-row">
            <strong>Guests:</strong> {guestData.names.join(', ')}
          </div>
          <div className="detail-row">
            <strong>Seats Allotted:</strong> {guestData.seatsAllotted}
          </div>
          {guestData.tableName && (
            <div className="detail-row">
              <strong>Table:</strong> {guestData.tableName}
            </div>
          )}
          {guestData.notes && (
            <div className="detail-row">
              <strong>Notes:</strong> {guestData.notes}
            </div>
          )}
        </div>

        {rsvpData && rsvpData.length > 0 && (
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #eee' }}>
            <h3 style={{ marginTop: 0 }}>Your RSVP</h3>
            {rsvpData.map((rsvp, idx) => (
              <div key={idx} className="rsvp-detail">
                <strong>{rsvp.name}</strong> — {rsvp.attending === 'yes' ? '✓ Attending' : '✗ Declining'}
                {rsvp.dietary && <div style={{ fontSize: '0.9rem', color: '#666' }}>Dietary: {rsvp.dietary}</div>}
                {rsvp.note && <div style={{ fontSize: '0.9rem', color: '#666' }}>Note: {rsvp.note}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
