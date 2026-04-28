// Recent past events with reports section
function RecentReportsSection({ selectedRegions, setView }) {
  const allPast = window.APP_DATA.pastEvents || [];
  // Filter: has reports, in selected regions (or all if no filter), sort by date desc
  const withReports = allPast
    .filter(e => e.reports && e.reports.length > 0)
    .filter(e => !selectedRegions || selectedRegions.length === 0 || selectedRegions.includes(e.region))
    .sort((a, b) => (b.date || b.dateLabel || "").localeCompare(a.date || a.dateLabel || ""))
    .slice(0, 6);

  if (withReports.length === 0) {
    return <div className="report-empty">近くの最近のレポートはまだありません</div>;
  }

  return (
    <div className="recent-reports-grid">
      {withReports.map(e => {
        const r = e.reports[e.reports.length - 1];
        return (
          <div key={e.id} className="recent-report-card" onClick={() => setView({ name: "event", id: e.id })} style={{ cursor: "pointer" }}>
            <div className="rr-photos">
              {Array.from({ length: Math.min(r.photos || 2, 3) }).map((_, i) => (
                <div key={i} className="rr-photo" />
              ))}
            </div>
            <div className="rr-body">
              <div className="rr-meta">
                <span className="rr-date"><FmtDate d={e.date || e.dateLabel} /></span>
                <span className="dot-sep">·</span>
                <span>{e.venue}</span>
              </div>
              <h3 className="rr-title serif">{e.title.replace(/ — .*/, "")}</h3>
              <p className="rr-text">{r.text.slice(0, 80)}…</p>
              <div className="rr-sig small muted">{r.author} · レポート</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Embedded map view used inside Top
function MapSection({ events, setView }) {
  const [selected, setSelected] = React.useState(events[0]?.id);
  const sel = events.find(e => e.id === selected);

  React.useEffect(() => {
    if (events.length > 0 && !events.find(e => e.id === selected)) {
      setSelected(events[0].id);
    }
  }, [events]);

  if (events.length === 0) {
    return <div className="report-empty">選択されたエリアのイベントはありません</div>;
  }

  return (
    <div>
      <div className="map-shell">
        <div className="map-canvas">
          <svg viewBox="0 0 100 80" preserveAspectRatio="none">
            <rect x="0" y="0" width="100" height="80" fill="var(--bg-soft)" />
            <path d="M-2 28 Q 20 32 40 26 T 80 30 T 104 24" stroke="var(--line)" strokeWidth="1.6" fill="none" opacity="0.7"/>
            <path d="M0 55 L100 50" stroke="var(--line-soft)" strokeWidth="0.3" fill="none" />
            <path d="M30 0 L44 80" stroke="var(--line-soft)" strokeWidth="0.3" fill="none" />
            <path d="M64 0 L70 80" stroke="var(--line-soft)" strokeWidth="0.3" fill="none" />
            <path d="M0 18 L100 22" stroke="var(--line-soft)" strokeWidth="0.3" fill="none" />
            <g opacity="0.5">
              <rect x="12" y="40" width="14" height="8" fill="none" stroke="var(--line-soft)" strokeWidth="0.3"/>
              <rect x="50" y="36" width="16" height="12" fill="none" stroke="var(--line-soft)" strokeWidth="0.3"/>
              <rect x="74" y="48" width="12" height="10" fill="none" stroke="var(--line-soft)" strokeWidth="0.3"/>
              <rect x="24" y="62" width="14" height="10" fill="none" stroke="var(--line-soft)" strokeWidth="0.3"/>
            </g>
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
              onClick={() => setSelected(e.id)}>
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
        <div className="map-selected-bar">
          <div>
            <div className="small muted" style={{ letterSpacing: "0.12em", fontWeight: 500 }}>えらんでいる場所</div>
            <div style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 17, fontWeight: 600, marginTop: 2 }}>{sel.title.replace(/ — .*/, "")}</div>
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

// Multi-region chip chooser
function RegionChooser({ regions, selected, setSelected }) {
  const toggle = (r) => {
    if (selected.includes(r)) {
      setSelected(selected.length > 1 ? selected.filter(x => x !== r) : selected);
    } else {
      setSelected([...selected, r]);
    }
  };
  return (
    <div className="region-panel">
      <span className="lbl">表示する地域</span>
      <button className={"chip " + (selected.length === regions.length ? "on" : "")}
        onClick={() => setSelected(regions)}>すべて</button>
      {regions.map(r => (
        <button key={r}
          className={"chip accent " + (selected.includes(r) && selected.length < regions.length ? "on" : "")}
          onClick={() => toggle(r)}>
          {selected.includes(r) && selected.length < regions.length ? "✓ " : ""}{r}
        </button>
      ))}
      <span className="small muted" style={{ marginLeft: "auto" }}>
        {selected.length === regions.length ? "すべて表示中" : `${selected.length}地域 選択中`}
      </span>
    </div>
  );
}

// Top view
function TopView({ authed, user, events, series, setView, anchor, regions, favs }) {
  const safeRegions = Array.isArray(regions) ? regions : [];
  const userRegions = Array.isArray(user?.regions) ? user.regions : safeRegions;
  const [selectedRegions, setSelectedRegions] = React.useState(authed ? userRegions : safeRegions);

  React.useEffect(() => {
    if (anchor) {
      setTimeout(() => scrollToAnchor(anchor), 80);
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [anchor]);

  const sel = Array.isArray(selectedRegions) ? selectedRegions : safeRegions;
  const filtered = events.filter(e => sel.includes(e.region));

  return (
    <div data-screen-label="01 Top">
      <GuestTop events={events} series={series} setView={setView}
        regions={safeRegions} selectedRegions={sel} setSelectedRegions={setSelectedRegions}
        filtered={filtered} favs={favs} />
    </div>
  );
}

function GuestTop({ events, series, setView, regions, selectedRegions, setSelectedRegions, filtered, favs }) {
  const [tagFilters, setTagFilters] = React.useState([]);
  const [catOpen, setCatOpen] = React.useState(false);
  const [activeCatGroup, setActiveCatGroup] = React.useState(null);
  const catRef = React.useRef(null);

  const toggleTag = (tag) => {
    setTagFilters(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const tagFiltered = tagFilters.length === 0 ? filtered : filtered.filter(e =>
    e.tags && tagFilters.some(f => e.tags.some(t => t === f || t.includes(f) || f.includes(t)))
  );

  // Close dropdowns on outside click
  React.useEffect(() => {
    if (!catOpen) return;
    const h = (e) => { if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [catOpen]);

  const CATS = [
    { group: "集まり・交流", tags: ["おしゃべり会", "交流会", "多世代交流", "子育て", "シニア", "国際交流", "街コン", "婚活・友活", "推し活"] },
    { group: "食・飲み物",   tags: ["食", "マルシェ", "朝市", "料理教室", "カフェ", "お茶会", "農業"] },
    { group: "マーケット",   tags: ["マルシェ", "朝市", "即売会", "交換会・物々交換", "フリマ", "バザー"] },
    { group: "学び・体験",   tags: ["ワークショップ", "講座", "勉強会", "読書", "語学", "手芸・クラフト", "伝統工芸", "哲学対話", "もくもく会", "練習会"] },
    { group: "文化・芸術",   tags: ["アート", "展示会", "音楽", "演劇", "映画", "写真", "ダンス", "落語", "コスプレ"] },
    { group: "まち・地域",   tags: ["まちづくり", "歴史", "環境・自然", "防災", "ボランティア", "観光"] },
    { group: "スポーツ・大会", tags: ["スポーツ", "ウォーキング", "アウトドア", "ヨガ・健康", "大会・コンペ"] },
    { group: "ビジネス",     tags: ["ビジネス", "ネットワーキング", "起業", "キャリア", "ハッカソン", "もくもく会"] },
    { group: "食事の場",     tags: ["ランチ", "ディナー", "朝活", "こども食堂"] },
    { group: "デジタル",     tags: ["ゲーム", "eスポーツ", "テクノロジー", "ハッカソン"] },
    { group: "福祉・医療",   tags: ["福祉", "認知症", "健康・医療", "障がい者支援"] },
    { group: "その他",       tags: ["定例", "お祭り", "見学・ツアー", "その他（カテゴリなし）"] },
  ];

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="kanji-mark">まち の で き ご と</div>
          <h1>あなたのまちで、<br/>きょう何かが始まる。</h1>
          <p className="lede">
            マルシェ、読書会、音楽の夕べ、福祉カフェ——<br/>
            近所で誰かが開いているイベントを、もっと簡単に見つけられる場所。
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn primary" onClick={() => scrollToAnchor("discover")}>イベントをさがす <Icon.arrow /></button>
            <button className="btn ghost" onClick={() => scrollToAnchor("map")}>地図からさがす</button>
          </div>
        </div>

        <div className="hero-scene" aria-hidden="true">
          <div className="hs-frame hs-a">
            <StripePlaceholder label="" style={{ width: "100%", height: "100%" }} />
            <div className="hs-tag">スープのタイム</div>
          </div>
          <div className="hs-frame hs-b">
            <StripePlaceholder label="" style={{ width: "100%", height: "100%" }} />
            <div className="hs-tag">認知症カフェ</div>
          </div>
          <div className="hs-frame hs-c">
            <StripePlaceholder label="" style={{ width: "100%", height: "100%" }} />
            <div className="hs-tag">朝市</div>
          </div>
          <div className="hs-stamp">
            <div className="hs-stamp-mark">今月</div>
            <div className="hs-stamp-num">312</div>
            <div className="hs-stamp-lbl">の できごと</div>
          </div>
          <svg className="hs-deco" viewBox="0 0 200 200" preserveAspectRatio="none">
            <path d="M10 140 Q 60 100 110 120 T 190 90" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.3"/>
            <circle cx="30" cy="40" r="1.2" fill="currentColor" opacity="0.35"/>
            <circle cx="170" cy="170" r="1.2" fill="currentColor" opacity="0.35"/>
          </svg>
        </div>
      </section>

      <section className="hero-stats-bar">
        <div className="hero-stat"><div className="n">312</div><div className="l">EVENTS · 今月のできごと</div></div>
        <div className="hero-stat"><div className="n">48</div><div className="l">ORGANIZERS · 主催者</div></div>
        <div className="hero-stat"><div className="n">2,140</div><div className="l">PARTICIPANTS · 参加した人</div></div>
      </section>

      <section id="discover" style={{ marginBottom: 48, scrollMarginTop: 80 }}>
        <div className="section-head">
          <h2>みつける — {selectedRegions.length === regions.length ? "お近くの地域" : selectedRegions.join(" / ")}</h2>
          <span className="meta">5月のイベント</span>
        </div>
        <RegionPicker selected={selectedRegions} onChange={setSelectedRegions} />

        {/* Category filter — same style as RegionPicker */}
        <div className="rp-compact" ref={catRef} style={{ marginBottom: 20 }}>
          <div className="rp-bar" onClick={() => { const next = !catOpen; setCatOpen(next); if (next && !activeCatGroup) setActiveCatGroup(CATS[0].group); }}>
            <span className="rp-bar-label">🏷</span>
            <div className="rp-bar-chips">
              {tagFilters.length === 0
                ? <span className="rp-bar-empty">カテゴリを選ぶ</span>
                : tagFilters.map(tag => (
                    <span key={tag} className="rp-bar-chip">{tag}
                      <button className="rp-bar-chip-x" onClick={e => { e.stopPropagation(); toggleTag(tag); }}>×</button>
                    </span>
                  ))
              }
            </div>
            <span className={"rp-bar-arrow " + (catOpen ? "up" : "")}>▾</span>
          </div>

          {catOpen && (
            <div className="rp-panel">
              <div className="rp-panel-inner" style={{ gridTemplateColumns: "110px 1fr" }}>
                <div className="rp-pref-list">
                  {CATS.map(cat => (
                    <button key={cat.group}
                      onClick={() => setActiveCatGroup(cat.group)}
                      className={"rp-pref-item " + (activeCatGroup === cat.group ? "active " : "") + (cat.tags.some(t => tagFilters.includes(t)) ? "has-sel" : "")}>
                      {cat.group}
                      {cat.tags.filter(t => tagFilters.includes(t)).length > 0 && (
                        <span className="rp-pref-cnt">{cat.tags.filter(t => tagFilters.includes(t)).length}</span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="rp-city-panel">
                  {(activeCatGroup ? CATS.filter(c => c.group === activeCatGroup) : CATS).map(cat => (
                    <div key={cat.group} className="cat-group" style={{ borderBottom: "1px solid var(--line-soft)", paddingBottom: 10, marginBottom: 10 }}>
                      <div className="cat-group-label">{cat.group}</div>
                      <div className="rp-city-grid">
                        {cat.tags.map(tag => (
                          <button key={tag}
                            className={"rp-city-btn " + (tagFilters.includes(tag) ? "on" : "")}
                            onClick={() => toggleTag(tag)}>
                            {tagFilters.includes(tag) ? "✓ " : ""}{tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rp-panel-footer">
                <span className="small muted">{tagFilters.length === 0 ? "全カテゴリ表示中" : `${tagFilters.length}カテゴリ選択中`}</span>
                <button className="btn sm ghost" onClick={() => setTagFilters([])}>リセット</button>
              </div>
            </div>
          )}
        </div>

        {tagFiltered.length > 0 ? (
          <div className="grid-3">
            {tagFiltered.slice(0, 6).map(e => (
              <EventCard key={e.id} event={e} onOpen={id => setView({ name: "event", id })} favs={favs} />
            ))}
          </div>
        ) : (
          <div className="report-empty">条件に合うイベントはまだ登録されていません</div>
        )}
      </section>

      <section id="map" style={{ marginBottom: 48, scrollMarginTop: 80 }}>
        <div className="section-head">
          <h2>地図からみつける</h2>
          <span className="meta">AREA MAP · {selectedRegions.join(" / ")}</span>
        </div>
        <MapSection events={tagFiltered.length > 0 ? tagFiltered : filtered} setView={setView} />
      </section>

      <section style={{ marginBottom: 48 }}>
        <div className="section-head">
          <h2>続いている集まり — シリーズ</h2>
          <a className="muted small" onClick={() => setView({ name: "series-list" })} style={{ cursor: "pointer" }}>すべて見る →</a>
        </div>
        <div className="grid-2">
          {series.map(s => (
            <div key={s.id} className="event-card" style={{ flexDirection: "row", cursor: "pointer" }}
              onClick={() => setView({ name: "series", id: s.id })}>
              <div style={{ width: 140, flexShrink: 0, borderRight: "1px solid var(--line)", borderBottom: 0 }} className="flyer">
                <div className="series-logo" style={{ border: 0, aspectRatio: "auto", height: "100%" }}>{s.mark}</div>
              </div>
              <div className="flyer-body" style={{ flex: 1 }}>
                <div className="meta-line" style={{ marginBottom: 4 }}>
                  <span>{s.eventsCount}回開催 · {s.startedYear}〜</span>
                </div>
                <h3>{s.name}</h3>
                <div className="small muted" style={{ marginTop: 6, lineHeight: 1.7 }}>{s.desc.slice(0, 48)}…</div>
                <div className="small" style={{ marginTop: 8, color: "var(--accent)", fontWeight: 500 }}>{s.organizer} →</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>似ている集まり</h2>
          <span className="meta">あなたが見ているイベントから</span>
        </div>
        <div className="grid-3">
          {events.slice(3, 6).map(e => (
            <EventCard key={e.id} event={e} onOpen={id => setView({ name: "event", id })} favs={favs} />
          ))}
        </div>
      </section>

      <section style={{ marginTop: 52, marginBottom: 40 }}>
        <div className="section-head">
          <h2>最近開催されました</h2>
          <span className="meta">RECENT REPORTS · レポートあり</span>
        </div>
        <RecentReportsSection selectedRegions={selectedRegions} setView={setView} />
      </section>
    </>
  );
}

function AuthedTop({ user, events, series, setView, regions, selectedRegions, setSelectedRegions, filtered }) {
  const pastEvents = window.APP_DATA.pastEvents || [];
  const myUpcoming = events.filter(e => e.organizer === "のみ地域包括支援センター" || e.organizer === "かがやくイス");
  const myPast = pastEvents.filter(e => e.organizer === "のみ地域包括支援センター" || e.organizer === "かがやくイス");
  const [orgTab, setOrgTab] = React.useState("all");
  const reportMissing = myPast.filter(e => !e.reports || e.reports.length === 0).length;

  let shownOrg;
  if (orgTab === "upcoming") shownOrg = myUpcoming.map(e => ({ ...e, _past: false }));
  else if (orgTab === "past") shownOrg = myPast.map(e => ({ ...e, _past: true }));
  else shownOrg = [
    ...myUpcoming.map(e => ({ ...e, _past: false })),
    ...myPast.map(e => ({ ...e, _past: true })),
  ];

  const myRegistered = [events[0], events[1], events[3]];
  const myAttended = events.slice(2, 5);

  return (
    <>
      <section className="hero-welcome">
        <div className="small muted" style={{ letterSpacing: "0.12em", marginBottom: 6, fontWeight: 500 }}>おかえりなさい</div>
        <h1 className="greet">{user.name} さん、</h1>
        <div className="sub">{user.region} · 主催 {myUpcoming.length + myPast.length}件 · 参加予約 {user.upcomingRegistered} · 参加した {user.attended}</div>
      </section>

      <section className="personal-row">
        <div className="personal-cell">
          <div className="label">開催予定</div>
          <div className="value">{myUpcoming.length}件</div>
          <div className="hint">次回: <span className="accent-ink">5月8日 認知症カフェ</span></div>
        </div>
        <div className="personal-cell">
          <div className="label">開催済</div>
          <div className="value">{myPast.length}件</div>
          <div className="hint">{reportMissing > 0 ? <span className="accent-ink">レポート未投稿 {reportMissing}件</span> : "レポート済"}</div>
        </div>
        <div className="personal-cell">
          <div className="label">参加予約中</div>
          <div className="value">{user.upcomingRegistered}件</div>
          <div className="hint">直近: <span className="accent-ink">5月10日 のみっこ</span></div>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <div className="section-head">
          <h2>あなたのイベント</h2>
          <a className="muted small" style={{ cursor: "pointer" }} onClick={() => setView({ name: "dash" })}>ダッシュボード →</a>
        </div>
        <div className="filter-bar" style={{ borderTop: 0, marginBottom: 18, paddingTop: 0 }}>
          <div className="filter-group">
            <span className="lbl">表示</span>
            <button className={"chip " + (orgTab === "all" ? "on" : "")} onClick={() => setOrgTab("all")}>すべて({myUpcoming.length + myPast.length})</button>
            <button className={"chip " + (orgTab === "upcoming" ? "on" : "")} onClick={() => setOrgTab("upcoming")}>開催予定({myUpcoming.length})</button>
            <button className={"chip " + (orgTab === "past" ? "on" : "")} onClick={() => setOrgTab("past")}>開催済({myPast.length})</button>
          </div>
          <button className="btn sm primary" style={{ marginLeft: "auto" }} onClick={() => setView({ name: "new-event" })}>
            + 新規イベント
          </button>
        </div>
        <div className="grid-3">
          {shownOrg.map(e => (
            <div key={e.id} style={{ position: "relative" }}>
              {e._past && (
                <span className="tag" style={{ position: "absolute", top: 10, left: 10, zIndex: 2, background: "var(--ink)", color: "var(--bg)" }}>開催済</span>
              )}
              <EventCard event={e} onOpen={id => setView({ name: "event", id })} />
              {e._past && (!e.reports || e.reports.length === 0) && (
                <div style={{ position: "absolute", bottom: 10, right: 10, background: "var(--accent)", color: "var(--accent-ink)", fontSize: 11, fontWeight: 600, padding: "3px 8px", letterSpacing: "0.08em" }}>レポート未投稿</div>
              )}
            </div>
          ))}
          {orgTab !== "past" && (
            <div className="event-card" style={{ justifyContent: "center", alignItems: "center", padding: 40, border: "1px dashed var(--line)", background: "transparent", cursor: "pointer" }} onClick={() => setView({ name: "new-event" })}>
              <div style={{ textAlign: "center", color: "var(--ink-mute)" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>+</div>
                <div className="small">新しいイベントを登録</div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section style={{ marginBottom: 48 }}>
        <div className="section-head">
          <h2>参加を予約しているイベント</h2>
          <span className="meta">近い順</span>
        </div>
        <div className="grid-3">
          {myRegistered.map(e => (
            <EventCard key={e.id} event={e} onOpen={id => setView({ name: "event", id })} />
          ))}
        </div>
      </section>

      <section id="discover" style={{ marginBottom: 48, scrollMarginTop: 80 }}>
        <div className="section-head">
          <h2>みつける — あなたの地域から</h2>
          <span className="meta">おすすめ · 5月</span>
        </div>
        <RegionPicker selected={selectedRegions} onChange={setSelectedRegions} />
        {filtered.length > 0 ? (
          <div className="grid-3">
            {filtered.slice(0, 6).map(e => (
              <EventCard key={e.id} event={e} onOpen={id => setView({ name: "event", id })} />
            ))}
          </div>
        ) : (
          <div className="report-empty">条件に合うイベントはまだ登録されていません</div>
        )}
      </section>

      <section id="map" style={{ marginBottom: 48, scrollMarginTop: 80 }}>
        <div className="section-head">
          <h2>地図からみつける</h2>
          <span className="meta">AREA MAP</span>
        </div>
        <MapSection events={filtered} setView={setView} />
      </section>

      <section>
        <div className="section-head">
          <h2>参加したイベントから — おすすめ</h2>
          <span className="meta">傾向が近いイベント</span>
        </div>
        <div className="grid-3">
          {myAttended.map(e => (
            <EventCard key={e.id} event={e} onOpen={id => setView({ name: "event", id })} />
          ))}
        </div>
      </section>
    </>
  );
}

window.TopView = TopView;
window.MapSection = MapSection;
