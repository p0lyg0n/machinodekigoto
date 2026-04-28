/* ============================================
   RegionPicker — コンパクト版
   1行表示 + クリックで展開パネル
   ============================================ */

function RegionPicker({ selected, onChange }) {
  const [open, setOpen] = React.useState(false);
  const [activePref, setActivePref] = React.useState(null);
  const ref = React.useRef(null);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Auto-select pref that has selection, or first pref
  React.useEffect(() => {
    if (open && !activePref) {
      const withSel = Object.keys(window.JP_REGIONS).find(p =>
        window.JP_REGIONS[p].some(c => selected.includes(c))
      );
      setActivePref(withSel || "ギフト県");
    }
  }, [open]);

  const toggleCity = (city) => {
    const next = selected.includes(city)
      ? selected.filter(c => c !== city)
      : [...selected, city];
    onChange(next.length > 0 ? next : selected);
  };

  const removeCity = (city, e) => {
    e.stopPropagation();
    const next = selected.filter(c => c !== city);
    if (next.length > 0) onChange(next);
  };

  const prefHasSelection = (pref) =>
    (window.JP_REGIONS[pref] || []).some(c => selected.includes(c));

  const selCountInPref = (pref) =>
    (window.JP_REGIONS[pref] || []).filter(c => selected.includes(c)).length;

  return (
    <div className="rp-compact" ref={ref}>
      {/* ── Trigger bar ── */}
      <div className="rp-bar" onClick={() => setOpen(o => !o)}>
        <span className="rp-bar-label">📍</span>
        <div className="rp-bar-chips">
          {selected.length === 0 && <span className="rp-bar-empty">地域を選ぶ</span>}
          {selected.slice(0, 5).map(city => (
            <span key={city} className="rp-bar-chip">
              {city}
              <button className="rp-bar-chip-x" onClick={(e) => removeCity(city, e)}>×</button>
            </span>
          ))}
          {selected.length > 5 && <span className="rp-bar-chip muted">+{selected.length - 5}</span>}
        </div>
        <span className={"rp-bar-arrow " + (open ? "up" : "")}>▾</span>
      </div>

      {/* ── Dropdown panel ── */}
      {open && (
        <div className="rp-panel">
          <div className="rp-panel-inner">
            {/* Prefectures column */}
            <div className="rp-pref-list">
              {Object.keys(window.JP_REGIONS).map(pref => {
                const cnt = selCountInPref(pref);
                return (
                  <button key={pref}
                    className={"rp-pref-item " + (activePref === pref ? "active " : "") + (cnt > 0 ? "has-sel" : "")}
                    onClick={() => setActivePref(pref)}>
                    {pref}
                    {cnt > 0 && <span className="rp-pref-cnt">{cnt}</span>}
                  </button>
                );
              })}
            </div>

            {/* Cities panel */}
            {activePref && (
              <div className="rp-city-panel">
                <div className="rp-city-head">
                  <span className="serif" style={{ fontWeight: 600, fontSize: 14 }}>{activePref}</span>
                  <button className="rp-all-btn" onClick={() => {
                    const cities = window.JP_REGIONS[activePref];
                    const allSel = cities.every(c => selected.includes(c));
                    if (allSel) {
                      const next = selected.filter(c => !cities.includes(c));
                      onChange(next.length > 0 ? next : selected);
                    } else {
                      onChange([...new Set([...selected, ...cities])]);
                    }
                  }}>
                    {window.JP_REGIONS[activePref].every(c => selected.includes(c)) ? "全解除" : "全選択"}
                  </button>
                </div>
                <div className="rp-city-grid">
                  {window.JP_REGIONS[activePref].map(city => (
                    <button key={city}
                      className={"rp-city-btn " + (selected.includes(city) ? "on" : "")}
                      onClick={() => toggleCity(city)}>
                      {selected.includes(city) ? "✓ " : ""}{city}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="rp-panel-footer">
            <span className="small muted">{selected.length}地域 選択中</span>
            <button className="btn sm ghost" onClick={() => onChange(selected.slice(0,1))}>リセット</button>
          </div>
        </div>
      )}
    </div>
  );
}

window.RegionPicker = RegionPicker;
