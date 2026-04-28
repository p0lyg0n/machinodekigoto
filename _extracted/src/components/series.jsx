function SeriesListView({ series, events, setView, favs }) {
  return (
    <div data-screen-label="05 Series list">
      <div className="section-head" style={{ marginBottom: 28 }}>
        <h2>続いている集まり — シリーズ一覧</h2>
        <span className="meta">定例で開催されているイベント群</span>
      </div>
      <div className="grid-2">
        {series.map(s => {
          const next = events.find(e => e.seriesId === s.id);
          const isFav = favs && favs.series.includes(s.id);
          return (
            <div key={s.id} style={{ position: "relative" }}>
              <div className="event-card" style={{ flexDirection: "row", cursor: "pointer" }}
                onClick={() => setView({ name: "series", id: s.id })}>
                <div style={{ width: 160, flexShrink: 0, borderRight: "1px solid var(--line)", borderBottom: 0, display: "grid", placeItems: "center", background: "var(--bg-soft)" }}>
                  <div style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 44, color: "var(--accent)" }}>{s.mark}</div>
                </div>
                <div className="flyer-body" style={{ flex: 1, padding: 20 }}>
                  <div className="small muted" style={{ letterSpacing: "0.14em", marginBottom: 4 }}>{s.startedYear}〜 · {s.eventsCount}回</div>
                  <h3 style={{ fontSize: 17 }}>{s.name}</h3>
                  <div className="small muted" style={{ marginTop: 8, lineHeight: 1.7 }}>{s.desc}</div>
                  {next && <div className="small" style={{ marginTop: 10, color: "var(--accent)" }}>次回: <FmtDate d={next.date} /> {next.weekday}曜 →</div>}
                </div>
              </div>
              {favs && (
                <button className={"fav-btn " + (isFav ? "on" : "")}
                  style={{ top: 8, right: 8 }}
                  onClick={e => { e.stopPropagation(); favs.toggle("series", s.id); }}
                  title="お気に入り">♥</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SeriesDetail({ seriesId, series, events, pastEvents, setView, favs }) {
  const s = series.find(x => x.id === seriesId);
  if (!s) return null;
  const upcoming = events.filter(e => e.seriesId === seriesId);
  const past = pastEvents.filter(e => e.seriesId === seriesId);
  const isFav = favs && favs.series.includes(seriesId);

  return (
    <div data-screen-label="06 Series detail">
      <button className="btn sm ghost" onClick={() => setView({ name: "series-list" })} style={{ marginBottom: 16 }}>
        <Icon.arrowBack /> シリーズ一覧にもどる
      </button>

      <section className="series-head">
        <div className="series-logo">{s.mark}</div>
        <div className="series-info">
          <div className="kicker">S E R I E S · {s.startedYear} —</div>
          <h1>{s.name}</h1>
          <p className="desc">{s.desc}</p>
          <div className="small muted" style={{ marginBottom: 12 }}>主催 · {s.organizer}</div>
          {favs && (
            <button className={"fav-inline " + (isFav ? "on" : "")} onClick={() => favs.toggle("series", seriesId)}>
              <span className="heart">♥</span> {isFav ? "お気に入り済み" : "お気に入りに追加"}
            </button>
          )}
          <div className="series-stats">
            <div className="s"><span className="n">{s.eventsCount}</span><span className="l">TIMES HELD</span></div>
            <div className="s"><span className="n">{s.totalAttendees}</span><span className="l">TOTAL GUESTS</span></div>
            <div className="s"><span className="n">{upcoming.length}</span><span className="l">UPCOMING</span></div>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 36 }}>
        <div className="section-head">
          <h2>これから</h2>
          <span className="meta">UPCOMING</span>
        </div>
        {upcoming.length > 0 ? (
          <div className="grid-3">
            {upcoming.map(e => (
              <EventCard key={e.id} event={e} onOpen={id => setView({ name: "event", id })} favs={favs} />
            ))}
          </div>
        ) : (
          <div className="small muted">次回の予定は調整中です</div>
        )}
      </section>

      <section>
        <div className="section-head">
          <h2>これまで — 開催の記録</h2>
          <span className="meta">TIMELINE · 時系列</span>
        </div>
        <div className="timeline">
          {upcoming.map(e => (
            <div key={e.id} className="tl-item upcoming">
              <div className="tl-date"><FmtDate d={e.date} /> {e.weekday}曜 · <span style={{ color: "var(--accent)" }}>予定</span></div>
              <h3 className="tl-title">{e.title}</h3>
              <div className="tl-meta">{e.venue} / {e.registered}名ご予約中</div>
            </div>
          ))}
          {past.map(e => (
            <div key={e.id} className="tl-item past">
              <div className="tl-date"><FmtDate d={e.date || e.dateLabel} /></div>
              <h3 className="tl-title">{e.title}</h3>
              <div className="tl-meta">{e.venue} / {e.attended}名ご参加</div>
              {e.report && (
                <div className="tl-report">
                  <div className="thumbs">
                    <div className="thumb" /><div className="thumb" /><div className="thumb" />
                  </div>
                  <div className="report-text">
                    {e.report}
                    <span className="report-sig">— レポート · {e.reportAuthor}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

window.SeriesListView = SeriesListView;
window.SeriesDetail = SeriesDetail;
