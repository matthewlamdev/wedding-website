export function Navigation({ onLogout }) {
  return (
    <nav>
      <div className="nav-inner">
        <span className="nav-monogram">D &amp; M</span>
        <ul className="nav-links">
          <li><a href="#story">Story</a></li>
          <li><a href="#details">Details</a></li>
          <li><a href="#travel">Travel</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="#rsvp">RSVP</a></li>
          <li><button onClick={onLogout} className="logout-btn">Logout</button></li>
        </ul>
      </div>
    </nav>
  );
}
