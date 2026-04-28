function PhotoCarousel({ photos, title, overlay, showThumbs }) {
  const [cur, setCur] = React.useState(0);
  const items = (photos && photos.length > 0) ? photos : [1,2,3,4,5].map((_, i) => ({ placeholder: true, idx: i }));
  const total = items.length;
  const prev = (e) => { e && e.stopPropagation(); setCur(c => (c - 1 + total) % total); };
  const next = (e) => { e && e.stopPropagation(); setCur(c => (c + 1) % total); };

  return (
    <div className="photo-carousel">
      <div className="pc-main">
        {items[cur].placeholder ? (
          <div className="pc-placeholder">
            <StripePlaceholder label="" style={{ width: "100%", height: "100%" }} />
          </div>
        ) : (
          <img src={items[cur].url} alt={`${title} ${cur + 1}`} className="pc-img" />
        )}
        {overlay}
        {total > 1 && (
          <>
            <button className="pc-btn prev" onClick={prev} aria-label="前の写真">‹</button>
            <button className="pc-btn next" onClick={next} aria-label="次の写真">›</button>
          </>
        )}
        <div className="pc-counter">{cur + 1} / {total}</div>
      </div>

      {showThumbs && total > 1 ? (
        <div className="pc-thumbs">
          {items.map((item, i) => (
            <button key={i}
              className={"pc-thumb " + (i === cur ? "on" : "")}
              onClick={() => setCur(i)}
              aria-label={`写真 ${i + 1}`}>
              {item.placeholder ? (
                <StripePlaceholder label="" style={{ width: "100%", height: "100%" }} />
              ) : (
                <img src={item.url} alt="" />
              )}
              <span className="pc-thumb-num">{i + 1}</span>
            </button>
          ))}
        </div>
      ) : total > 1 ? (
        <div className="pc-dots">
          {items.map((_, i) => (
            <button key={i} className={"pc-dot " + (i === cur ? "on" : "")} onClick={() => setCur(i)} aria-label={`写真 ${i + 1}`} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function openHandout(event, report) {
  try { sessionStorage.setItem("mc_handout", JSON.stringify({ event, report })); } catch (e) {}
  window.open("handout.html", "_blank", "noopener");
}

function EventDetail({ event, series, setView, onRegister, isPast, onAddReport, authed, isOrganizer, favs }) {
  if (!event) return null;
  const s = series.find(x => x.id === event.seriesId);
  const capPct = Math.round((event.registered / event.capacity) * 100);
  const reports = event.reports || [];
  const [composing, setComposing] = React.useState(false);
  const [draft, setDraft] = React.useState({ author: "", text: "", photos: 3 });
  const isFavEvent = favs && favs.events.includes(event.id);
  const isFavOrg = favs && favs.organizers.includes(event.organizer);

  return (
    <div data-screen-label="02 Event detail" className="event-detail-page">
      {/* Breadcrumb */}
      <div className="detail-breadcrumb">
        <a onClick={() => setView({ name: "top" })}>みつける</a>
        <span className="sep">›</span>
        {s && (<>
          <a onClick={() => setView({ name: "series", id: s.id })}>{s.name}</a>
          <span className="sep">›</span>
        </>)}
        <span className="cur">{event.subtitle || event.title}</span>
      </div>

      {/* Hero — big photo with title overlay */}
      <div className="detail-hero">
        <PhotoCarousel
          photos={event.photos}
          title={event.title}
          showThumbs
          overlay={
            <div className="detail-hero-overlay">
              <div className="dho-inner">
                <div className="dho-eyebrow">{s ? s.name : "一 回 限 り の イ ベ ン ト"}</div>
                <h1 className="dho-title">{event.title.replace(/ — .*/, "")}</h1>
                {event.subtitle && <div className="dho-sub">— {event.subtitle} —</div>}
              </div>
            </div>
          }
        />
      </div>

      {/* 2-column: article + action card */}
      <div className="detail-shell">
        <article className="flyer-large">
          <div className="fl-body">
            <p className="fl-lead">{event.summary}</p>
            {event.body && <p className="fl-para">{event.body}</p>}
          </div>

          <div className="fl-tags-row">
            {event.tags && event.tags.map(t => <span key={t} className="tag">{t}</span>)}
            {event.views && <span className="fl-views-sm">{event.views.toLocaleString()}人が閲覧</span>}
          </div>

          {s && (
            <div className="fl-series-note">
              <div className="fls-mark">{s.mark}</div>
              <div className="fls-body">
                <div className="fls-label">このイベントはシリーズの一部です</div>
                <div className="fls-name">{s.name} · <span>{s.eventsCount}回目</span></div>
              </div>
              <button className="btn sm ghost" onClick={() => setView({ name: "series", id: s.id })}>
                シリーズを見る →
              </button>
            </div>
          )}
        </article>

        <aside className="detail-side">
          {/* Action card — all key facts + CTA */}
          <div className="action-card">
            <div className="ac-date-block">
              <div className="ac-date-main">
                <FmtDate d={event.date || event.dateLabel} />
              </div>
              <div className="ac-date-wd">{event.weekday}曜 · {event.time}</div>
            </div>

            <div className="ac-row">
              <div className="ac-row-ico">
                <svg viewBox="0 0 24 24" className="i"><path d="M12 21s-7-6.5-7-12a7 7 0 0114 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>
              </div>
              <div className="ac-row-body">
                {event.online ? (
                  <div className="ac-venue-name" style={{ color: "var(--accent)" }}>オンライン開催</div>
                ) : (
                  <>
                    <div className="ac-venue-name">{event.venue}</div>
                    {event.address && <div className="ac-venue-addr">{event.address}</div>}
                  </>
                )}
                {event.onlineUrl && <a href={event.onlineUrl} target="_blank" rel="noopener" className="ac-link">{event.onlineUrl}</a>}
              </div>
            </div>

            <div className="ac-row">
              <div className="ac-row-ico">
                <svg viewBox="0 0 24 24" className="i"><path d="M12 2v20M6 6c0-1.1.9-2 2-2h8a2 2 0 110 4h-8a2 2 0 000 4h8a2 2 0 110 4h-8a2 2 0 01-2-2"/></svg>
              </div>
              <div className="ac-row-body">
                <div className="ac-venue-name">{event.price}</div>
                <div className="ac-venue-addr">{event.registered}/{event.capacity}名が参加予定</div>
              </div>
            </div>

            {!isPast ? (
              <div className="ac-cta-block">
                <div className="cap-bar"><span style={{ width: capPct + "%" }} /></div>
                <div className="cap-meta">
                  <span>あと {event.capacity - event.registered} 席</span>
                  <span className="small muted">キャンセル前日まで可</span>
                </div>
                <button className="btn primary block ac-cta" onClick={() => onRegister(event.id)}>
                  参加を登録する <Icon.arrow />
                </button>
              </div>
            ) : (
              <div className="ac-cta-block">
                <div className="ac-past-note">{event.attended || event.registered}名が参加しました</div>
                {isOrganizer && (
                  <button className="btn primary block ac-cta" onClick={() => setComposing(true)}>
                    <Icon.plus /> レポートを追記する
                  </button>
                )}
              </div>
            )}

            <div className="ac-actions-row">
              {favs && (
                <button className={"ac-action " + (isFavEvent ? "on" : "")}
                  onClick={() => favs.toggle("event", event.id)}>
                  <span className="heart">♥</span>{isFavEvent ? "済" : "保存"}
                </button>
              )}
              <button className="ac-action"><Icon.share /> 共有</button>
            </div>
          </div>

          {/* Organizer card */}
          {favs && (
            <div className="organizer-card">
              <div className="oc-head">
                <div className="oc-avatar">{event.organizer[0]}</div>
                <div>
                  <div className="oc-label">主催</div>
                  <div className="oc-name">{event.organizer}</div>
                </div>
              </div>
              <button className={"fav-inline " + (isFavOrg ? "on" : "")}
                onClick={() => favs.toggle("organizer", event.organizer)}>
                <span className="heart">♥</span> {isFavOrg ? "お気に入り済み" : "主催者をお気に入り"}
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* Reports section — appended to the event page */}
      <section className="reports-section">
        <div className="reports-head">
          <div>
            <span className="eyebrow">EVENT REPORTS</span>
            <h2>開催のレポート {reports.length > 0 && <span style={{ fontSize: 16, fontWeight: 400, color: "var(--ink-mute)", marginLeft: 10 }}>({reports.length}件)</span>}</h2>
          </div>
          {isPast && isOrganizer && !composing && (
            <button className="btn sm primary" onClick={() => setComposing(true)}>
              <Icon.plus /> レポートを追記
            </button>
          )}
        </div>

        {!isPast && (
          <div className="report-empty upcoming">
            <div className="note">開催後、主催者がこちらにレポートを追記します。</div>
            <div className="small">当日の様子、印象に残った出来事、次回へのご案内などが並んでいきます。</div>
          </div>
        )}

        {reports.map((r, i) => (
          <div key={r.id} className="report-entry">
            <div className="meta">
              <span><span className="author">{r.author}</span> · {r.date}</span>
              <span>レポート #{i + 1}</span>
            </div>
            {r.photos > 0 && (
              <div className="photos">
                {Array.from({ length: r.photos }).map((_, pi) => (
                  <div key={pi} className="photo" />
                ))}
              </div>
            )}
            <p className="body">{r.text}</p>

            {r.recipes && r.recipes.length > 0 && (
              <div className="recipes-inline">
                <div className="recipes-head">
                  <div>
                    <div className="eyebrow" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.24em", fontWeight: 600 }}>RECIPES · 当日のレシピ</div>
                    <h4 className="serif" style={{ fontSize: 18, margin: "4px 0 0", color: "var(--ink)" }}>{r.handoutTitle || "当日お出ししたもの"}</h4>
                  </div>
                  <button className="btn sm primary" onClick={() => openHandout(event, r)}>
                    <Icon.share /> PDFで配布物にする
                  </button>
                </div>
                <div className="recipes-grid">
                  {r.recipes.map(rec => (
                    <div key={rec.id} className="recipe-card">
                      <div className="recipe-photo">
                        <StripePlaceholder label={rec.name} />
                      </div>
                      <div className="recipe-body">
                        <h5 className="serif">{rec.name}</h5>
                        <div className="small muted">材料[{rec.serves}]</div>
                        <ul className="ing">
                          {rec.ingredients.slice(0, 4).map((ing, ii) => <li key={ii}>{ing}</li>)}
                          {rec.ingredients.length > 4 && <li className="muted">ほか {rec.ingredients.length - 4}点…</li>}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {isPast && reports.length === 0 && !composing && (
          <div className="report-empty">まだレポートは投稿されていません。{isOrganizer && "上の「レポートを追記」ボタンから投稿できます。"}</div>
        )}

        {composing && (
          <div className="report-composer">
            <h3>レポートを追記する</h3>
            <div className="field">
              <label>投稿者名<span className="req">必須</span></label>
              <input className="input" value={draft.author} onChange={e => setDraft({ ...draft, author: e.target.value })} placeholder="事務局 山本" />
            </div>
            <div className="field">
              <label>本文<span className="req">必須</span></label>
              <textarea className="textarea" style={{ minHeight: 120 }} value={draft.text}
                onChange={e => setDraft({ ...draft, text: e.target.value })}
                placeholder="当日の様子を、自由にお書きください。写真は後から差し替えられます。" />
            </div>
            <div className="field">
              <label>写真の枚数(プレビュー)</label>
              <div style={{ display: "flex", gap: 6 }}>
                {[0, 1, 2, 3, 4, 5, 6].map(n => (
                  <button key={n} className={"chip " + (draft.photos === n ? "on" : "")} onClick={() => setDraft({ ...draft, photos: n })}>{n}枚</button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 12 }}>
              <button className="btn sm ghost" onClick={() => setComposing(false)}>キャンセル</button>
              <button className="btn sm primary" disabled={!draft.author || !draft.text}
                onClick={() => { onAddReport(event.id, { ...draft, id: "r-" + Date.now(), date: "2026-05-01" }); setComposing(false); setDraft({ author: "", text: "", photos: 3 }); }}>
                追記する <Icon.check />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

window.EventDetail = EventDetail;
