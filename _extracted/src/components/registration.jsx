function RegistrationForm({ event, setView, onComplete }) {
  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState({
    name: "", kana: "", email: "", phone: "",
    attendeeType: "初めて", attendeeCount: "1", note: "",
    consent: false,
  });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  if (!event) return null;

  return (
    <div className="form-shell" data-screen-label="03 Registration form">
      <button className="btn sm ghost" onClick={() => setView({ name: "event", id: event.id })} style={{ marginBottom: 24 }}>
        <Icon.arrowBack /> イベント詳細にもどる
      </button>

      <div className="form-head">
        <div className="eyebrow">SIGN UP</div>
        <h1>参加を登録する</h1>
        <div className="small muted" style={{ marginTop: 6 }}>
          {event.title.replace(/ — .*/, "")} / {fmtDate(event.date)} {event.time}
        </div>
      </div>

      <div className="steps">
        <div className={"step " + (step >= 1 ? (step > 1 ? "done" : "on") : "")}><span className="n">1</span>基本情報</div>
        <div className={"step " + (step >= 2 ? (step > 2 ? "done" : "on") : "")}><span className="n">2</span>参加について</div>
        <div className={"step " + (step >= 3 ? "on" : "")}><span className="n">3</span>確認</div>
      </div>

      {step === 1 && (
        <div>
          <div className="cols">
            <div className="field">
              <label>お名前<span className="req">必須</span></label>
              <input className="input" value={form.name} onChange={e => upd("name", e.target.value)} placeholder="高橋 真帆" />
            </div>
            <div className="field">
              <label>ふりがな</label>
              <input className="input" value={form.kana} onChange={e => upd("kana", e.target.value)} placeholder="たかはし まほ" />
            </div>
          </div>
          <div className="field">
            <label>メールアドレス<span className="req">必須</span></label>
            <input className="input" type="email" value={form.email} onChange={e => upd("email", e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="field">
            <label>電話番号(任意)</label>
            <input className="input" value={form.phone} onChange={e => upd("phone", e.target.value)} placeholder="090-0000-0000" />
          </div>
          <div className="form-nav">
            <button className="btn ghost" onClick={() => setView({ name: "event", id: event.id })}>キャンセル</button>
            <button className="btn primary" onClick={() => setStep(2)} disabled={!form.name || !form.email}>次へ <Icon.arrow /></button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="field">
            <label>参加は何度目ですか<span className="req">必須</span></label>
            <div className="radio-group">
              {[
                { t: "初めて参加します", d: "スタッフがご案内します" },
                { t: "何度か参加しています", d: "いつもありがとうございます" },
                { t: "常連です", d: "お席の好みを覚えておきます" },
              ].map(o => (
                <div key={o.t} className={"radio-row " + (form.attendeeType.includes(o.t.slice(0,2)) ? "on" : "")}
                  onClick={() => upd("attendeeType", o.t)}>
                  <div className="marker" />
                  <div>
                    <div className="t">{o.t}</div>
                    <div className="d">{o.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="field">
            <label>参加人数</label>
            <select className="select" value={form.attendeeCount} onChange={e => upd("attendeeCount", e.target.value)}>
              <option value="1">1名（ご本人のみ）</option>
              <option value="2">2名</option>
              <option value="3">3名</option>
              <option value="4">4名以上（備考欄にご記入ください）</option>
            </select>
          </div>
          <div className="field">
            <label>主催者へのメッセージ・配慮事項(任意)</label>
            <textarea className="textarea" value={form.note} onChange={e => upd("note", e.target.value)}
              placeholder="例：車いすで参加します。お茶菓子のアレルギーは◯◯です。など" />
          </div>
          <div className="form-nav">
            <button className="btn ghost" onClick={() => setStep(1)}><Icon.arrowBack /> もどる</button>
            <button className="btn primary" onClick={() => setStep(3)}>確認へ <Icon.arrow /></button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <div style={{ border: "1px solid var(--line)", padding: 20, background: "var(--bg-card)", marginBottom: 20 }}>
            <div className="small muted" style={{ letterSpacing: "0.14em", marginBottom: 10 }}>登録内容</div>
            <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
              <tbody>
                <tr><td style={{ padding: "6px 0", color: "var(--ink-mute)", width: 120 }}>お名前</td><td>{form.name || "—"} {form.kana && <span className="muted small">({form.kana})</span>}</td></tr>
                <tr><td style={{ padding: "6px 0", color: "var(--ink-mute)" }}>メール</td><td>{form.email || "—"}</td></tr>
                <tr><td style={{ padding: "6px 0", color: "var(--ink-mute)" }}>電話</td><td>{form.phone || "—"}</td></tr>
                <tr><td style={{ padding: "6px 0", color: "var(--ink-mute)" }}>参加の頻度</td><td>{form.attendeeType}</td></tr>
                <tr><td style={{ padding: "6px 0", color: "var(--ink-mute)" }}>人数</td><td>{form.attendeeCount}名</td></tr>
                <tr><td style={{ padding: "6px 0", color: "var(--ink-mute)", verticalAlign: "top" }}>メッセージ</td><td>{form.note || "—"}</td></tr>
              </tbody>
            </table>
          </div>
          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 12, cursor: "pointer", padding: 12, border: "1px solid var(--line)" }}>
            <input type="checkbox" checked={form.consent} onChange={e => upd("consent", e.target.checked)} style={{ marginTop: 2 }} />
            <span>いただいた情報は、このイベントの運営連絡のみに利用します。シリーズの次回案内を希望する場合のみメールでお知らせします。</span>
          </label>
          <div className="form-nav">
            <button className="btn ghost" onClick={() => setStep(2)}><Icon.arrowBack /> もどる</button>
            <button className="btn primary" onClick={() => onComplete(form)} disabled={!form.consent}>登録を確定する <Icon.check /></button>
          </div>
        </div>
      )}
    </div>
  );
}

function RegistrationComplete({ event, setView }) {
  return (
    <div className="confirm-shell" data-screen-label="04 Registration complete">
      <div className="tick">✓</div>
      <h1>ご登録ありがとうございました</h1>
      <p>
        イベント当日、お気をつけてお越しください。<br/>
        ご登録のメールアドレスに、ご案内をお送りしました。
      </p>
      <div className="confirm-card">
        <div className="row"><span className="k">イベント</span><span>{event.title.replace(/ — .*/, "")}</span></div>
        <div className="row"><span className="k">日時</span><span><FmtDate d={event.date} /> · {event.time}</span></div>
        <div className="row"><span className="k">会場</span><span>{event.venue}</span></div>
        <div className="row"><span className="k">登録番号</span><span style={{ fontFamily: "ui-monospace, monospace" }}>#MC-{Math.floor(Math.random()*9000+1000)}</span></div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 28 }}>
        <button className="btn ghost" onClick={() => setView({ name: "top" })}>トップへもどる</button>
        <button className="btn primary" onClick={() => setView({ name: "event", id: event.id })}>イベントをもう一度みる</button>
      </div>
    </div>
  );
}

window.RegistrationForm = RegistrationForm;
window.RegistrationComplete = RegistrationComplete;
