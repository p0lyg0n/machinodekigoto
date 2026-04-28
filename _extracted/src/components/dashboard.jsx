function Dashboard({ user, events, pastEvents, setView }) {
  const [tab, setTab] = React.useState("overview");
  const myEvents = events.filter(e => e.organizer === "のみ地域包括支援センター");
  const myPast = pastEvents;

  return (
    <div data-screen-label="08 Dashboard" className="dash-shell">
      <nav className="dash-nav">
        <h4>主催者メニュー</h4>
        <a className={"item " + (tab === "overview" ? "on" : "")} onClick={() => setTab("overview")}>概要</a>
        <a className={"item " + (tab === "events" ? "on" : "")} onClick={() => setTab("events")}>イベント管理</a>
        <a className={"item " + (tab === "report" ? "on" : "")} onClick={() => setTab("report")}>レポート投稿</a>
        <a className={"item"} onClick={() => setView({ name: "new-event" })}>+ 新規イベント</a>
        <a className={"item"}>シリーズ設定</a>
        <a className={"item"}>参加者リスト</a>
      </nav>

      <div>
        {tab === "overview" && <DashOverview user={user} myEvents={myEvents} myPast={myPast} setView={setView} setTab={setTab} />}
        {tab === "events" && <DashEvents myEvents={myEvents} myPast={myPast} setView={setView} setTab={setTab} />}
        {tab === "report" && <DashReport myPast={myPast} />}
      </div>
    </div>
  );
}

function DashOverview({ user, myEvents, myPast, setView, setTab }) {
  return (
    <>
      <div className="section-head" style={{ marginBottom: 20 }}>
        <h2>{user.name}さんの主催中シリーズ</h2>
        <span className="meta">DASHBOARD · 概要</span>
      </div>

      <div className="dash-stats">
        <div className="dash-stat">
          <div className="l">公開中のイベント</div>
          <div className="n">{myEvents.length}<small>件</small></div>
          <div className="trend">+1 先週</div>
        </div>
        <div className="dash-stat">
          <div className="l">今月の参加予約</div>
          <div className="n">25<small>名</small></div>
          <div className="trend">+6 昨月比</div>
        </div>
        <div className="dash-stat">
          <div className="l">シリーズ累計</div>
          <div className="n">326<small>名</small></div>
          <div className="trend">18回開催</div>
        </div>
        <div className="dash-stat">
          <div className="l">レポート未投稿</div>
          <div className="n" style={{ color: "var(--accent)" }}>1<small>件</small></div>
          <a className="trend" style={{ cursor: "pointer" }} onClick={() => setTab("report")}>投稿する →</a>
        </div>
      </div>

      <div className="section-head">
        <h2>次回のイベント</h2>
        <a className="muted small" onClick={() => setTab("events")} style={{ cursor: "pointer" }}>一覧 →</a>
      </div>
      <table className="dash-table">
        <thead><tr><th>イベント</th><th>日時</th><th>会場</th><th>予約</th><th>ステータス</th><th></th></tr></thead>
        <tbody>
          {myEvents.map(e => (
            <tr key={e.id}>
              <td><div className="t">{e.title.replace(/ — .*/, "")}</div><div className="small muted">{e.subtitle}</div></td>
              <td><FmtDate d={e.date} /><br/><span className="small muted">{e.time}</span></td>
              <td className="small">{e.venue}</td>
              <td>{e.registered}/{e.capacity}</td>
              <td><span className="status live">公開中</span></td>
              <td><a className="small" style={{ color: "var(--accent)", cursor: "pointer" }} onClick={() => setView({ name: "event", id: e.id })}>詳細</a></td>
            </tr>
          ))}
          <tr>
            <td><div className="t">草案中のイベント</div><div className="small muted">タイトル未設定</div></td>
            <td className="small muted">—</td><td className="small muted">—</td><td>—</td>
            <td><span className="status draft">下書き</span></td>
            <td><a className="small" style={{ color: "var(--accent)", cursor: "pointer" }}>編集</a></td>
          </tr>
        </tbody>
      </table>

      <div className="section-head" style={{ marginTop: 36 }}>
        <h2>最近の開催</h2>
        <a className="muted small" onClick={() => setView({ name: "series", id: "ninchisho-cafe" })} style={{ cursor: "pointer" }}>シリーズページ →</a>
      </div>
      <table className="dash-table">
        <thead><tr><th>イベント</th><th>日時</th><th>参加</th><th>レポート</th></tr></thead>
        <tbody>
          {myPast.slice(0, 3).map(e => (
            <tr key={e.id}>
              <td><div className="t">{e.title.replace(/ — .*/, "")}</div><div className="small muted">{e.subtitle}</div></td>
              <td><FmtDate d={e.date || e.dateLabel} /></td>
              <td>{e.attended}名</td>
              <td>{e.report ? <span className="status done">投稿済</span> : <span className="status" style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>未投稿</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function DashEvents({ myEvents, myPast, setView }) {
  return (
    <>
      <div className="section-head"><h2>イベント管理</h2><button className="btn sm primary" onClick={() => setView({ name: "new-event" })}><Icon.plus /> 新規</button></div>
      <table className="dash-table">
        <thead><tr><th>タイトル</th><th>日時</th><th>予約</th><th>状態</th><th></th></tr></thead>
        <tbody>
          {myEvents.map(e => (
            <tr key={e.id}><td className="t">{e.title.replace(/ — .*/, "")}</td><td><FmtDate d={e.date} /></td><td>{e.registered}/{e.capacity}</td><td><span className="status live">公開中</span></td><td><a className="small" style={{ cursor: "pointer", color: "var(--accent)" }}>編集</a></td></tr>
          ))}
          {myPast.map(e => (
            <tr key={e.id}><td className="t">{e.title.replace(/ — .*/, "")}</td><td><FmtDate d={e.date || e.dateLabel} /></td><td>{e.attended}名</td><td><span className="status done">終了</span></td><td><a className="small" style={{ cursor: "pointer", color: "var(--accent)" }}>レポート</a></td></tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function DashReport({ myPast }) {
  const target = myPast[0];
  const [photos, setPhotos] = React.useState([true, true, true, false, false, false, false, false]);
  const [body, setBody] = React.useState("");

  return (
    <>
      <div className="section-head"><h2>開催レポートを投稿する</h2><span className="meta">{target.title.replace(/ — .*/, "")} · {fmtDate(target.date || target.dateLabel)}</span></div>
      <div className="editor">
        <div>
          <div className="field">
            <label>開催の様子(写真 最大8枚)</label>
            <div className="photo-grid">
              {photos.map((h, i) => (
                <div key={i} className={"photo-slot " + (h ? "has" : "")} onClick={() => setPhotos(p => p.map((v, j) => j === i ? !v : v))}>
                  {!h && <Icon.cam />}
                </div>
              ))}
            </div>
          </div>
          <div className="field">
            <label>開催のレポート<span className="req">必須</span></label>
            <textarea className="textarea" style={{ minHeight: 160 }} value={body} onChange={e => setBody(e.target.value)}
              placeholder="今回の会の様子、印象に残ったこと、次回につなげたいことなど、自由にお書きください。"/>
          </div>
          <div className="cols">
            <div className="field">
              <label>参加人数</label>
              <input className="input" defaultValue={target.attended} />
            </div>
            <div className="field">
              <label>投稿者名</label>
              <input className="input" defaultValue={target.reportAuthor} />
            </div>
          </div>
          <div className="form-nav">
            <button className="btn ghost">下書き保存</button>
            <button className="btn primary">シリーズページに公開する <Icon.check /></button>
          </div>
        </div>
        <aside>
          <div className="detail-card">
            <h4>公開プレビュー</h4>
            <div className="small muted" style={{ marginBottom: 8, letterSpacing: "0.08em" }}><FmtDate d={target.date || target.dateLabel} /></div>
            <div style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 15, marginBottom: 8 }}>{target.title.replace(/ — .*/, "")}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4, marginBottom: 10 }}>
              {photos.filter(Boolean).slice(0,3).map((_, i) => (
                <div key={i} style={{ aspectRatio: 1, backgroundImage: "repeating-linear-gradient(45deg, var(--stripe) 0 6px, var(--bg-card) 6px 8px)", border: "1px solid var(--line-soft)" }}/>
              ))}
            </div>
            <div className="small muted" style={{ lineHeight: 1.7 }}>
              {body || "（レポート本文がここに表示されます）"}
            </div>
          </div>
          <div className="detail-card">
            <h4>投稿のヒント</h4>
            <ul style={{ paddingLeft: 16, margin: 0, fontSize: 12, color: "var(--ink-soft)", lineHeight: 2 }}>
              <li>写真は3〜6枚が読みやすいです</li>
              <li>参加者の顔が特定できる写真は避けましょう</li>
              <li>次回の告知を最後に添えると、継続参加につながります</li>
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}

function NewEventStub({ setView }) {
  return (
    <div className="form-shell" data-screen-label="09 New event">
      <button className="btn sm ghost" onClick={() => setView({ name: "dash" })} style={{ marginBottom: 24 }}><Icon.arrowBack /> ダッシュボードにもどる</button>
      <div className="form-head">
        <div className="eyebrow">CREATE EVENT</div>
        <h1>新しいイベントを登録</h1>
      </div>
      <div className="field"><label>イベント名<span className="req">必須</span></label><input className="input" placeholder="例：認知症カフェ in のみ — 第十九回"/></div>
      <div className="field"><label>シリーズに紐づける(任意)</label>
        <select className="select"><option>— 紐づけない —</option><option>認知症カフェ in のみ</option><option>+ 新しいシリーズを作る</option></select>
      </div>
      <div className="cols">
        <div className="field"><label>開催日<span className="req">必須</span></label><input className="input" type="date" defaultValue="2026-06-12"/></div>
        <div className="field"><label>時間</label><input className="input" placeholder="13:30 – 15:30"/></div>
      </div>
      <div className="field">
        <label>開催形式<span className="req">必須</span></label>
        <div className="radio-group">
          <div className="radio-row on"><div className="marker on" /> 対面（会場あり）</div>
          <div className="radio-row"><div className="marker" /> オンライン（URL共有）</div>
          <div className="radio-row"><div className="marker" /> 対面＋オンライン（ハイブリッド）</div>
        </div>
      </div>
      <div className="cols">
        <div className="field"><label>会場名</label><input className="input" placeholder="つだうの町家カフェ"/></div>
        <div className="field"><label>定員</label><input className="input" placeholder="20" type="number"/></div>
      </div>
      <div className="field"><label>住所</label><input className="input" placeholder="ギフト県のみ市..."/></div>
      <div className="field"><label>オンラインURL（任意）</label><input className="input" type="url" placeholder="https://zoom.us/j/..."/></div>
      <div className="field"><label>接続方法の案内（任意）</label><input className="input" placeholder="例：前日にメールでURLをお送りします"/></div>
      <div className="field"><label>参加費</label><input className="input" placeholder="500円（お茶菓子付き）"/></div>
      <div className="field"><label>イベント説明</label><textarea className="textarea" style={{ minHeight: 120 }} placeholder="チラシに書くつもりで、どんな場か教えてください。"/></div>
      <div className="field"><label>チラシ画像(任意)</label>
        <div style={{ padding: 28, border: "1px dashed var(--line)", textAlign: "center", color: "var(--ink-mute)", fontSize: 12 }}>
          画像をドロップ、またはクリックしてアップロード<br/>
          <span className="small">画像がない場合、テキストから自動でチラシ風に組版します</span>
        </div>
      </div>
      <div className="form-nav">
        <button className="btn ghost">下書き保存</button>
        <button className="btn primary">公開する <Icon.arrow /></button>
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;
window.NewEventStub = NewEventStub;
