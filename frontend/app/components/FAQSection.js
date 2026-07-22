export function FAQSection() {
  return (
    <section id="faq">
      <div className="wrap">
        <div className="section-eyebrow">Good to know</div>
        <h2 className="section-title">FAQ</h2>
        <div className="faq">
          <details>
            <summary>Are kids welcome?</summary>
            <p>
              Edit this to reflect your policy — e.g. &quot;We love your little ones, but our
              wedding is an adults-only celebration&quot; or the opposite.
            </p>
          </details>
          <details>
            <summary>Can I bring a plus-one?</summary>
            <p>Your invitation will indicate if a plus-one is included. Check your guest info above.</p>
          </details>
          <details>
            <summary>What if it rains?</summary>
            <p>The Willow Barn has an indoor space we&apos;ll move to. Either way, the party goes on.</p>
          </details>
          <details>
            <summary>Is there a hashtag?</summary>
            <p>#DerrickAndMichelle2027 — tag your photos so we can find them all later.</p>
          </details>
          <details>
            <summary>When&apos;s the RSVP deadline?</summary>
            <p>Please respond by [date, ~6-8 weeks before the wedding] so we can finalize catering counts.</p>
          </details>
        </div>
      </div>
    </section>
  );
}
