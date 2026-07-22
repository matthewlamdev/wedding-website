export function StorySection() {
  return (
    <section id="story">
      <div className="wrap">
        <div className="section-eyebrow">How it began</div>
        <h2 className="section-title">Our Story</h2>
        <svg className="sprig" viewBox="0 0 64 40" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M2 20 H62 M20 20 C 20 10, 28 6, 32 6 C 28 12, 24 16, 20 20 Z M44 20 C 44 30, 36 34, 32 34 C 36 28, 40 24, 44 20 Z" />
        </svg>
        <div className="story-text" style={{ marginTop: 30 }}>
          <p>
            Replace this paragraph with how you two met — the honest, slightly unglamorous
            version usually lands better than the polished one. A coffee shop, a mutual
            friend&apos;s terrible party, a dating app neither of you wanted to be on.
          </p>
          <p>
            Add a second paragraph about the proposal: where it happened, who cried, whether
            the dog was involved. Guests genuinely read this section, so keep it in your own
            voice.
          </p>
        </div>
      </div>
    </section>
  );
}
