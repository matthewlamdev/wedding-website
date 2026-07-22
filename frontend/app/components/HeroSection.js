export function HeroSection() {
  return (
    <header className="hero">
      <svg
        className="hero-botanical"
        viewBox="0 0 900 600"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.9">
          <path d="M60 560 C 80 420, 40 300, 90 160" />
          <path d="M90 160 C 110 140, 140 150, 150 170 C 140 190, 105 190, 90 160 Z" />
          <path d="M75 220 C 95 200, 125 210, 135 230 C 120 250, 90 245, 75 220 Z" />
          <path d="M65 300 C 45 285, 40 255, 60 240 C 80 255, 80 285, 65 300 Z" />
          <path d="M840 40 C 815 170, 850 280, 800 420" />
          <path d="M800 420 C 780 440, 750 430, 745 405 C 760 385, 790 390, 800 420 Z" />
          <path d="M815 340 C 795 325, 790 295, 810 280 C 830 295, 828 325, 815 340 Z" />
          <path d="M825 260 C 845 245, 850 215, 830 200 C 810 215, 810 245, 825 260 Z" />
        </g>
      </svg>
      <div className="hero-content">
        <div className="hero-eyebrow">Together with our families</div>
        <h1 className="hero-names">
          Derrick<span className="hero-amp">&amp;</span>Michelle
        </h1>
        <div className="hero-sub">are getting married</div>
        <div className="hero-place">Saturday, May 8, 2027 · The Willow Barn, Fraser Valley, BC</div>
      </div>
    </header>
  );
}
