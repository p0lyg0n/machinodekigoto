function MapView({ events, setView }) {
  const [selected, setSelected] = React.useState(events[0].id);
  const sel = events.find(e => e.id === selected);

  return (
    <div data-screen-label="07 Map">
      <div className="section-head" style={{ marginBottom: 24 }}>
        <h2>地図からさがす — のみ市周辺</h2>
        <span className="meta">AREA MAP · 5月のイベント</span>
      </div>

      <div className="map-shell">
        <div className="map-canvas">
          <svg viewBox="0 0 100 80" preserveAspectRatio="none">
            {/* stylized "map" — faint roads & river */}
            <rect x="0" y="0" width="100" height="80" fill="var(--bg-soft)" />
            {/* river */}
            <path d="M-2 28 Q 20 32 40 26 T 80 30 T 104 24" stroke="var(--line)" strokeWidth="1.6" fill="none" opacity="0.7"/>
            {/* roads */}
            <path d="M0 55 L100 50" stroke="var(--line-soft)" strokeWidth="0.3" fill="none" />
            <path d="M30 0 L44 80" stroke="var(--line-soft)" strokeWidth="0.3" fill="none" />
            <path d="M64 0 L70 80" stroke="var(--line-soft)" strokeWidth="0.3" fill="none" />
            <path d="M0 18 L100 22" stroke="var(--line-soft)" strokeWidth="0.3" fill="none" />
            {/* blocks */}
            <g opacity="0.5">
              <rect x="12" y="40" width="14" height="8" fill="none" stroke="var(--line-soft)" strokeWidth="0.3"/>
              <rect x="50" y="36" width="16" height="12" fill="none" stroke="var(--line-soft)" strokeWidth="0.3"/>
              <rect x="74" y="48" width="12" height="10" fill="none" stroke="var(--line-soft)" strokeWidth="0.3"/>
              <rect x="24" y="62" width="14" height="10" fill="none" stroke="var(--line-soft)" strokeWidth="0.3"/>
            </g>
            {/* area label */}
            <text x="50" y="8" textAnchor="middle" fontSize="2.4" fill="var(--ink-mute)" letterSpacing="0.6">M I N O   C I T Y</text>
            <text x="18" y="72" fontSize="2" fill="var(--ink-mute)">つだうの町並み</text>
            <text x="62" y="18" fontSize="2" fill="var(--ink-mute)">和紙の里</text>
          </svg>
          {events.map((e, i) => (
            <div key={e.id}
              className={"map-pin " + (selected === e.id ? "on" : "")}
              style={{ left: e.lng + "%", top: e.lat + "%" }}
              onClick={() => setSelected(e.id)}>
              <div className="bubble">{i + 1}</div>
              <div className="tail" />
            </div>
          ))}
        </div>
        <div className="map-list">
          {events.map((e, i) => (
            <div key={e.id}
              className={"map-list-item " + (selected === e.id ? "on" : "")}
              onClick={() => setSelected(e.id)}
              onDoubleClick={() => setView({ name: "event", id: e.id })}>
              <div className="idx">{i + 1}</div>
              <div>
                <div className="t">{e.title.replace(/ — .*/, "")}</div>
                <div className="d"><FmtDate d={e.date} /> · {e.venue}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {sel && (
        <div style={{ marginTop: 16, padding: 16, border: "1px solid var(--line)", background: "var(--bg-card)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="small muted" style={{ letterSpacing: "0.14em" }}>SELECTED</div>
            <div style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 16 }}>{sel.title.replace(/ — .*/, "")}</div>
            <div className="small muted">{sel.address}</div>
          </div>
          <button className="btn primary sm" onClick={() => setView({ name: "event", id: sel.id })}>
            詳しくみる <Icon.arrow />
          </button>
        </div>
      )}
    </div>
  );
}

window.MapView = MapView;
