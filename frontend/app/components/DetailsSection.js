export function DetailsSection() {
  return (
    <section id="details">
      <div className="wrap">
        <div className="section-eyebrow">Saturday, May 8, 2027</div>
        <h2 className="section-title">Wedding Day Details</h2>
        <div className="timeline">
          <div className="tl-row">
            <div className="tl-time">3:30 PM</div>
            <div className="tl-what">
              <h3>Guests Arrive</h3>
              <p>Please arrive by 3:45 — the ceremony starts promptly at 4.</p>
            </div>
          </div>
          <div className="tl-row">
            <div className="tl-time">4:00 PM</div>
            <div className="tl-what">
              <h3>Ceremony</h3>
              <p>Outdoor, weather permitting. The Willow Barn, Fraser Valley.</p>
            </div>
          </div>
          <div className="tl-row">
            <div className="tl-time">5:00 PM</div>
            <div className="tl-what">
              <h3>Cocktail Hour</h3>
              <p>Drinks and appetizers on the lawn.</p>
            </div>
          </div>
          <div className="tl-row">
            <div className="tl-time">6:30 PM</div>
            <div className="tl-what">
              <h3>Reception &amp; Dinner</h3>
              <p>Seated dinner, toasts, and dancing until midnight.</p>
            </div>
          </div>
        </div>
        <div className="venue-note">
          <strong>The Willow Barn</strong> — 1284 Orchard Lane, Fraser Valley, BC
          <br />
          Add parking info, shuttle details, or a map link here.
        </div>
      </div>
    </section>
  );
}
