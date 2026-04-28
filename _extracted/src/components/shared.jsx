// Small inline SVG icons, stroked.
const Icon = {
  search: () => (
    <svg className="i" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
  ),
  pin: () => (
    <svg className="i" viewBox="0 0 24 24"><path d="M12 22s-7-7.5-7-13a7 7 0 1 1 14 0c0 5.5-7 13-7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>
  ),
  cal: () => (
    <svg className="i" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>
  ),
  clock: () => (
    <svg className="i" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
  ),
  users: () => (
    <svg className="i" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3 2.5-5 6-5s6 2 6 5"/><circle cx="17" cy="9" r="2.5"/><path d="M21 19c0-2-1.5-3.5-4-3.5"/></svg>
  ),
  arrow: () => (
    <svg className="i" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
  ),
  arrowBack: () => (
    <svg className="i" viewBox="0 0 24 24"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>
  ),
  plus: () => (
    <svg className="i" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
  ),
  check: () => (
    <svg className="i" viewBox="0 0 24 24"><path d="m5 12 5 5 9-10"/></svg>
  ),
  heart: () => (
    <svg className="i" viewBox="0 0 24 24"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></svg>
  ),
  bell: () => (
    <svg className="i" viewBox="0 0 24 24"><path d="M6 16V10a6 6 0 1 1 12 0v6l1.5 2h-15L6 16z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>
  ),
  share: () => (
    <svg className="i" viewBox="0 0 24 24"><circle cx="6" cy="12" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="m8 11 8-4M8 13l8 4"/></svg>
  ),
  edit: () => (
    <svg className="i" viewBox="0 0 24 24"><path d="M4 20h4l11-11-4-4L4 16v4zM14 6l4 4"/></svg>
  ),
  cam: () => (
    <svg className="i" viewBox="0 0 24 24"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>
  ),
  burger: () => (
    <svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
  ),
};

window.Icon = Icon;

// Stripe placeholder
function StripePlaceholder({ label = "イベント画像", style }) {
  return (
    <div className="stripe-placeholder" style={style}>
      {label ? <div className="badge">{label}</div> : null}
    </div>
  );
}
window.StripePlaceholder = StripePlaceholder;

// Event card — minimal flyer style
function EventCard({ event, onOpen, favs }) {
  const isFav = favs && favs.events.includes(event.id);
  const handleFav = (e) => {
    e.stopPropagation();
    if (favs) favs.toggle("event", event.id);
  };
  return (
    <article className="event-card" onClick={() => onOpen(event.id)} data-screen-label={`Event card ${event.id}`} style={{ position: "relative" }}>
      {favs && (
        <button className={"fav-btn " + (isFav ? "on" : "")} onClick={handleFav} title="お気に入り">♥</button>
      )}
      <div className="flyer">
        <div className="flyer-content">
          <div className="fc-top">{event.online ? <span style={{ color: "var(--accent)", fontWeight: 600, letterSpacing: "0.08em" }}>ONLINE</span> : (event.seriesId ? (event.subtitle || "") : "一回限りのイベント")}</div>
          <div>
            <div className="fc-title">{event.title.replace(/ — .*/, "")}</div>
          </div>
          <div className="fc-date">
            <FmtDate d={event.date || event.dateLabel} />
            <small>{event.weekday}曜 · {event.time.split(" ")[0]}</small>
          </div>
        </div>
      </div>
      <div className="flyer-body">
        <div className="meta-line">
          <span>{event.venue}</span>
          <span className="dot-sep">·</span>
          <span>{event.organizer}</span>
        </div>
        <div className="tags">
          {event.tags && event.tags.map(t => <span key={t} className="tag">{t}</span>)}
          <span className="tag outline">{event.registered}/{event.capacity}</span>
          {event.views && <span className="tag views-tag">👀 {event.views >= 1000 ? (event.views/1000).toFixed(1)+'k' : event.views}</span>}
        </div>
      </div>
    </article>
  );
}
window.EventCard = EventCard;

// Date formatting helper
function fmtDate(dateStr) {
  if (!dateStr) return "";
  const m = String(dateStr).match(/(\d{4})[-./](\d{1,2})[-./](\d{1,2})/);
  if (m) return `${m[1]}年${parseInt(m[2])}月${parseInt(m[3])}日`;
  return dateStr;
}
function FmtDate({ d }) {
  if (!d) return null;
  const m = String(d).match(/(\d{4})[-./](\d{1,2})[-./](\d{1,2})/);
  if (!m) return <span>{d}</span>;
  return <span><small style={{ fontSize: "0.65em", opacity: 0.55, letterSpacing: "0.04em" }}>{m[1]}年</small>{parseInt(m[2])}月{parseInt(m[3])}日</span>;
}
window.fmtDate = fmtDate;
window.FmtDate = FmtDate;

// Smooth scroll helper
function scrollToAnchor(id) {
  const el = document.getElementById(id);
  if (el) {
    const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}
window.scrollToAnchor = scrollToAnchor;

// Nav — with menu anchors and mobile sheet
function AppNav({ view, setView, authed, setAuthed, user }) {
  const [q, setQ] = React.useState("");
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const goAnchor = (anchor) => {
    setMobileOpen(false);
    if (view.name !== "top") {
      setView({ name: "top", anchor });
    } else {
      setTimeout(() => scrollToAnchor(anchor), 50);
    }
  };

  const go = (v) => { setMobileOpen(false); setView(v); };

  return (
    <header className="app-nav">
      <div className="app-nav-inner">
        <div className="brand" onClick={() => go({ name: "top" })}>
          <div className="brand-mark">まちのできごと<span className="dot">.</span></div>
          <div className="brand-sub">地域のイベント情報</div>
        </div>
        <nav className="nav-links">
          <a className={view.name === "top" ? "active" : ""} onClick={() => go({ name: "top" })}>みつける</a>
          {authed && (
            <a className={view.name === "mine" ? "active" : ""} onClick={() => go({ name: "mine" })}>マイイベント</a>
          )}
        </nav>
        <div className="nav-right">
          <label className="nav-search">
            <Icon.search />
            <input placeholder="イベント名・地域・主催者" value={q} onChange={e => setQ(e.target.value)} />
          </label>
          {authed ? (
            <div className="avatar" title={user.name}>{user.initial}</div>
          ) : (
            <button className="btn sm ghost" onClick={() => setAuthed(true)}>ログイン</button>
          )}
        </div>
        <button className="nav-burger" onClick={() => setMobileOpen(o => !o)} aria-label="メニュー">
          <Icon.burger />
        </button>
      </div>

      {mobileOpen && (
        <div className="nav-mobile-sheet">
          <a className={view.name === "top" ? "active" : ""} onClick={() => go({ name: "top" })}>みつける</a>
          {authed && <a className={view.name === "mine" ? "active" : ""} onClick={() => go({ name: "mine" })}>マイイベント</a>}
          <div className="ns-input">
            <input placeholder="イベント名・地域・主催者で検索" value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
            {authed ? (
              <button className="btn sm ghost" style={{ flex: 1 }} onClick={() => { setAuthed(false); setMobileOpen(false); }}>ログアウト</button>
            ) : (
              <button className="btn sm primary" style={{ flex: 1 }} onClick={() => { setAuthed(true); setMobileOpen(false); }}>ログイン</button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
window.AppNav = AppNav;

function AppFoot() {
  return (
    <footer className="app-foot">
      © 2026 まちのできごと — あなたのまちのできごとが、もう少し見つかりやすくなる場所
    </footer>
  );
}
window.AppFoot = AppFoot;
