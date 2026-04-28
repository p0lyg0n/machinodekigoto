/* ============================================
   MyEventsView — マイイベント
   上部ナビ + 全セクション縦並び
   主催中 / 主催した / 参加予約中 / 参加した / お気に入り
   ============================================ */

function MyEventsView({ user, events, pastEvents, setView, favs }) {
  const mineOrganizers = ["高田 和夫"];
  const myUpcoming = events.filter(e => mineOrganizers.includes(e.organizer));
  const myPast = pastEvents.filter(e => mineOrganizers.includes(e.organizer));
  const reportMissing = myPast.filter(e => !e.reports || e.reports.length === 0).length;

  const myRegistered = [events[3], events[4], events[5]].filter(Boolean);
  const myAttended = [
    ...pastEvents.filter(e => !mineOrganizers.includes(e.organizer)),
    { id: "att-x1", title: "こども食堂 のみっこ — 四月", subtitle: "春のお祝い", dateLabel: "2026.04.05", date: "2026-04-05", venue: "のみ公民館", organizer: "のみっこの会", region: "のみ市", weekday: "日", time: "11:00 –", tags: ["こども","食"], registered: 32, capacity: 40, attended: 32, reports: [] },
    { id: "att-x2", title: "古本とコーヒー、四月の読書会", subtitle: "課題図書『雨の日の手紙』", dateLabel: "2026.04.19", date: "2026-04-19", venue: "古書室 ツダウ", organizer: "ツダウ読書会", region: "のみ市", weekday: "日", time: "10:00 –", tags: ["読書"], registered: 6, capacity: 8, attended: 6, reports: [] },
  ];

  // Real favorites from state
  const allEvents = [...events, ...pastEvents];
  const favEventList = favs ? allEvents.filter(e => favs.events.includes(e.id)) : [];
  const favSeriesList = favs ? (window.APP_DATA.series || []).filter(s => favs.series.includes(s.id)) : [];
  const favOrganizerList = favs ? favs.organizers : [];

  const sections = [
    { id: "mine-organizing", label: "主催中", count: myUpcoming.length },
    { id: "mine-organized", label: "主催した", count: myPast.length },
    { id: "mine-registered", label: "参加予約中", count: myRegistered.length },
    { id: "mine-attended", label: "参加した", count: myAttended.length },
    { id: "mine-favorites", label: "お気に入り", count: favEventList.length + favSeriesList.length + favOrganizerList.length },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div data-screen-label="Mine">
      <section className="hero-welcome">
        <div className="small muted" style={{ letterSpacing: "0.12em", marginBottom: 6, fontWeight: 500 }}>MY EVENTS · おかえりなさい</div>
        <h1 className="greet">{user.name} さん</h1>
        <div className="sub">{user.region} · 主催 {myUpcoming.length + myPast.length}件 · 参加予約 {myRegistered.length}件 · 参加した {myAttended.length}件</div>
      </section>

      {/* ── 上部セクションナビ ── */}
      <nav className="mine-subnav">
        {sections.map(s => (
          <button key={s.id} className="mine-subnav-item" onClick={() => scrollTo(s.id)}>
            <span className="l">{s.label}</span>
            <span className="n">{s.count}</span>
          </button>
        ))}
      </nav>

      {/* ① 主催中（開催予定） */}
      <section id="mine-organizing" style={{ marginBottom: 52, scrollMarginTop: 110 }}>
        <div className="section-head" style={{ marginBottom: 16 }}>
          <h2>主催中 <span className="meta" style={{ marginLeft: 8 }}>UPCOMING · {myUpcoming.length}件</span></h2>
          <div style={{ display: "flex", gap: 8 }}>
            <a className="muted small" style={{ cursor: "pointer" }} onClick={() => setView({ name: "dash" })}>主催者メニュー →</a>
            <button className="btn sm primary" onClick={() => setView({ name: "new-event" })}>+ 新規</button>
          </div>
        </div>
        <div className="grid-3">
          {myUpcoming.map(e => (
            <EventCard key={e.id} event={e} onOpen={id => setView({ name: "event", id })} />
          ))}
          <div className="event-card" style={{ justifyContent: "center", alignItems: "center", padding: 40, border: "1px dashed var(--line)", background: "transparent", cursor: "pointer" }} onClick={() => setView({ name: "new-event" })}>
            <div style={{ textAlign: "center", color: "var(--ink-mute)" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>+</div>
              <div className="small">新しいイベントを登録</div>
            </div>
          </div>
        </div>
      </section>

      {/* ② 主催した（開催済） */}
      <section id="mine-organized" style={{ marginBottom: 52, scrollMarginTop: 110 }}>
        <div className="section-head" style={{ marginBottom: 16 }}>
          <h2>主催した <span className="meta" style={{ marginLeft: 8 }}>PAST · {myPast.length}件</span></h2>
          {reportMissing > 0 && <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>レポート未投稿 {reportMissing}件</span>}
        </div>
        <div className="grid-3">
          {myPast.map(e => (
            <div key={e.id} style={{ position: "relative" }}>
              <span className="tag" style={{ position: "absolute", top: 10, left: 10, zIndex: 2, background: "var(--ink)", color: "var(--bg)" }}>開催済</span>
              <EventCard event={e} onOpen={id => setView({ name: "event", id })} favs={favs} />
              {(!e.reports || e.reports.length === 0) && (
                <div style={{ position: "absolute", bottom: 10, right: 10, background: "var(--accent)", color: "var(--accent-ink)", fontSize: 11, fontWeight: 600, padding: "3px 8px" }}>レポート未投稿</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ③ 参加予約中 */}
      <section id="mine-registered" style={{ marginBottom: 52, scrollMarginTop: 110 }}>
        <div className="section-head" style={{ marginBottom: 16 }}>
          <h2>参加予約中 <span className="meta" style={{ marginLeft: 8 }}>REGISTERED · {myRegistered.length}件</span></h2>
        </div>
        <div className="grid-3">
          {myRegistered.map(e => (
            <div key={e.id} style={{ position: "relative" }}>
              <span className="tag" style={{ position: "absolute", top: 10, left: 10, zIndex: 2, background: "var(--accent)", color: "var(--accent-ink)" }}>予約済</span>
              <EventCard event={e} onOpen={id => setView({ name: "event", id })} favs={favs} />
            </div>
          ))}
          {myRegistered.length === 0 && <p className="muted">参加予約中のイベントはありません</p>}
        </div>
      </section>

      {/* ④ 参加した */}
      <section id="mine-attended" style={{ marginBottom: 52, scrollMarginTop: 110 }}>
        <div className="section-head" style={{ marginBottom: 16 }}>
          <h2>参加した <span className="meta" style={{ marginLeft: 8 }}>ATTENDED · {myAttended.length}件</span></h2>
        </div>
        <div className="grid-3">
          {myAttended.map(e => (
            <div key={e.id} style={{ position: "relative" }}>
              <span className="tag" style={{ position: "absolute", top: 10, left: 10, zIndex: 2, background: "var(--bg-card)", color: "var(--ink)", border: "1px solid var(--line)" }}>参加済</span>
              <EventCard event={e} onOpen={id => setView({ name: "event", id })} favs={favs} />
            </div>
          ))}
        </div>
      </section>

      {/* ⑤ お気に入り */}
      <section id="mine-favorites" style={{ marginBottom: 52, scrollMarginTop: 110 }}>
        <div className="section-head" style={{ marginBottom: 16 }}>
          <h2>お気に入り <span className="meta" style={{ marginLeft: 8 }}>FAVORITES · {favEventList.length + favSeriesList.length + favOrganizerList.length}件</span></h2>
        </div>

        {favEventList.length === 0 && favSeriesList.length === 0 && favOrganizerList.length === 0 && (
          <div className="report-empty">
            <div style={{ marginBottom: 8 }}>♥ お気に入りはまだありません</div>
            <div className="small muted">イベント・シリーズ・主催者の ♥ を押すと、ここに集まります</div>
          </div>
        )}

        {favOrganizerList.length > 0 && (
          <>
            <div className="small muted" style={{ marginBottom: 10, letterSpacing: "0.1em" }}>— 主催者</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
              {favOrganizerList.map(name => (
                <div key={name} style={{ border: "1px solid var(--line)", background: "var(--bg-card)", padding: "12px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, background: "var(--accent)", color: "var(--accent-ink)", display: "grid", placeItems: "center", fontFamily: "'Noto Serif JP', serif", fontWeight: 600, fontSize: 16 }}>{name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
                    <div className="small muted">主催者</div>
                  </div>
                  <button className="fav-inline on" style={{ marginLeft: 8 }} onClick={() => favs.toggle("organizer", name)}>
                    <span className="heart">♥</span>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {favSeriesList.length > 0 && (
          <>
            <div className="small muted" style={{ marginBottom: 10, letterSpacing: "0.1em" }}>— シリーズ</div>
            <div className="grid-2" style={{ marginBottom: 28 }}>
              {favSeriesList.map(s => (
                <div key={s.id} className="event-card" style={{ flexDirection: "row", cursor: "pointer" }}
                  onClick={() => setView({ name: "series", id: s.id })}>
                  <div style={{ width: 100, flexShrink: 0, borderRight: "1px solid var(--line)", borderBottom: 0, display: "grid", placeItems: "center", background: "var(--bg-soft)" }}>
                    <div style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 36, color: "var(--accent)" }}>{s.mark}</div>
                  </div>
                  <div className="flyer-body" style={{ flex: 1, padding: "14px 16px" }}>
                    <div className="small muted" style={{ marginBottom: 2 }}>{s.startedYear}〜 · {s.eventsCount}回</div>
                    <h3 style={{ fontSize: 15, margin: "0 0 4px" }}>{s.name}</h3>
                    <div className="small muted">{s.organizer}</div>
                  </div>
                  <div style={{ padding: "14px 12px 0 0", fontSize: 18, color: "var(--accent)" }}>♥</div>
                </div>
              ))}
            </div>
          </>
        )}

        {favEventList.length > 0 && (
          <>
            <div className="small muted" style={{ marginBottom: 10, letterSpacing: "0.1em" }}>— イベント</div>
            <div className="grid-3">
              {favEventList.map(e => (
                <div key={e.id} style={{ position: "relative" }}>
                  <EventCard event={e} onOpen={id => setView({ name: "event", id })} favs={favs} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

window.MyEventsView = MyEventsView;
