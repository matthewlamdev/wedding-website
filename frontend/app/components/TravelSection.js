export function TravelSection() {
  return (
    <section id="travel">
      <div className="wrap">
        <div className="section-eyebrow">Getting here</div>
        <h2 className="section-title">Travel &amp; Stay</h2>
        <div className="card-grid">
          <div className="info-card">
            <h3>Accommodations</h3>
            <p>
              We&apos;ve held a block of rooms at [Hotel Name] about 10 minutes from the venue.
              Mention &quot;Derrick &amp; Michelle Wedding&quot; for the discounted rate.
            </p>
            <a className="button-link" href="#">Book a room →</a>
          </div>
          <div className="info-card">
            <h3>Getting There</h3>
            <p>
              Closest airport is [YVR/Airport Code]. Rental cars are recommended — parking is
              free at the venue. Shuttle details to follow.
            </p>
          </div>
          <div className="info-card">
            <h3>Registry</h3>
            <p>
              Your presence is truly the gift. If you&apos;d like to contribute to our next
              chapter, our registry is linked below.
            </p>
            <a className="button-link" href="#">View registry →</a>
          </div>
          <div className="info-card">
            <h3>Dress Code</h3>
            <p>
              Garden formal. Think soft, seasonal colors — outdoor ceremony on grass, so heels
              may want a wedge.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
