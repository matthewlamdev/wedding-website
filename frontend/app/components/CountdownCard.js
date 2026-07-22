function pad(n) {
  return String(n).padStart(2, '0');
}

export function CountdownCard({ countdown }) {
  return (
    <div className="wrap">
      <div className="countdown-card">
        {countdown?.done ? (
          <div className="countdown-done">Today's the day — see you there! 🌿</div>
        ) : (
          <>
            <div className="countdown-label">Counting down to the big day</div>
            <div className="countdown-grid">
              <div className="cd-unit">
                <div className="cd-num mono">{countdown ? countdown.days : '--'}</div>
                <div className="cd-word">Days</div>
              </div>
              <div className="cd-unit">
                <div className="cd-num mono">{countdown ? pad(countdown.hours) : '--'}</div>
                <div className="cd-word">Hours</div>
              </div>
              <div className="cd-unit">
                <div className="cd-num mono">{countdown ? pad(countdown.mins) : '--'}</div>
                <div className="cd-word">Minutes</div>
              </div>
              <div className="cd-unit">
                <div className="cd-num mono">{countdown ? pad(countdown.secs) : '--'}</div>
                <div className="cd-word">Seconds</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
