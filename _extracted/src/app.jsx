function App() {
  const [authed, setAuthed] = React.useState(false);
  const [view, setView] = React.useState({ name: "top" });
  const [theme, setTheme] = React.useState(window.INIT_TWEAKS?.theme || "kinari");
  const [tweaksOpen, setTweaksOpen] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const [data, setData] = React.useState(window.APP_DATA);
  const [favEvents, setFavEvents] = React.useState([]); // event ids
  const [favSeries, setFavSeries] = React.useState([]); // series ids
  const [favOrganizers, setFavOrganizers] = React.useState([]); // organizer names

  const toggleFav = (type, id) => {
    const setters = { event: setFavEvents, series: setFavSeries, organizer: setFavOrganizers };
    setters[type](prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try { localStorage.setItem("mc_fav_" + type, JSON.stringify(next)); } catch(e) {}
      return next;
    });
    const added = !{ event: favEvents, series: favSeries, organizer: favOrganizers }[type].includes(id);
    if (added) showToast("♥ お気に入りに追加しました。次回のお知らせが届きます");
    else showToast("お気に入りを解除しました");
  };

  const favs = { events: favEvents, series: favSeries, organizers: favOrganizers, toggle: toggleFav };

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  React.useEffect(() => {
    try {
      const s = localStorage.getItem("mc_view");
      if (s) setView(JSON.parse(s));
      const a = localStorage.getItem("mc_authed");
      if (a) setAuthed(a === "true");
      ["event","series","organizer"].forEach(t => {
        try { const v = localStorage.getItem("mc_fav_"+t); if (v) ({ event: setFavEvents, series: setFavSeries, organizer: setFavOrganizers }[t])(JSON.parse(v)); } catch(e) {}
      });
    } catch (e) {}
  }, []);
  React.useEffect(() => {
    try { localStorage.setItem("mc_view", JSON.stringify(view)); } catch (e) {}
  }, [view]);
  React.useEffect(() => {
    try { localStorage.setItem("mc_authed", String(authed)); } catch (e) {}
  }, [authed]);

  React.useEffect(() => {
    const handler = (ev) => {
      const msg = ev.data || {};
      if (msg.type === "__activate_edit_mode") setTweaksOpen(true);
      if (msg.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);

  const updateTheme = (t) => {
    setTheme(t);
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { theme: t } }, "*");
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const addReport = (eventId, report) => {
    setData(d => {
      const pastEvents = d.pastEvents.map(e =>
        e.id === eventId ? { ...e, reports: [...(e.reports || []), report] } : e
      );
      const events = d.events.map(e =>
        e.id === eventId ? { ...e, reports: [...(e.reports || []), report] } : e
      );
      return { ...d, pastEvents, events };
    });
    showToast("レポートを追記しました");
  };

  // Route rendering
  let page;
  const allEvents = [...data.events, ...data.pastEvents];
  if (view.name === "top") {
    page = <TopView authed={authed} user={data.user} events={data.events} series={data.series}
      setView={setView} anchor={view.anchor} regions={data.regions} favs={favs} />;
  } else if (view.name === "event") {
    const ev = allEvents.find(e => e.id === view.id) || data.events[0];
    const isPast = !!data.pastEvents.find(p => p.id === ev.id);
    const isOrganizer = authed && (ev.organizer === "のみ地域包括支援センター" || ev.organizer === "高田 和夫");
    page = <EventDetail event={ev} series={data.series} setView={setView}
      onRegister={(id) => setView({ name: "register", id })}
      isPast={isPast} onAddReport={addReport}
      authed={authed} isOrganizer={isOrganizer} favs={favs} />;
  } else if (view.name === "register") {
    const ev = data.events.find(e => e.id === view.id) || data.events[0];
    page = <RegistrationForm event={ev} setView={setView} onComplete={() => { setView({ name: "confirm", id: ev.id }); showToast("参加登録を受け付けました"); }} />;
  } else if (view.name === "confirm") {
    const ev = data.events.find(e => e.id === view.id) || data.events[0];
    page = <RegistrationComplete event={ev} setView={setView} />;
  } else if (view.name === "series-list") {
    page = <SeriesListView series={data.series} events={data.events} setView={setView} favs={favs} />;
  } else if (view.name === "series") {
    page = <SeriesDetail seriesId={view.id} series={data.series} events={data.events} pastEvents={data.pastEvents} setView={setView} favs={favs} />;
  } else if (view.name === "mine") {
    page = <MyEventsView user={data.user} events={data.events} pastEvents={data.pastEvents} setView={setView} favs={favs} />;
  } else if (view.name === "dash") {
    page = <Dashboard user={data.user} events={data.events} pastEvents={data.pastEvents} setView={setView} />;
  } else if (view.name === "new-event") {
    page = <NewEventStub setView={setView} />;
  }

  return (
    <div className="app">
      <AppNav view={view} setView={setView} authed={authed} setAuthed={(v) => { setAuthed(v); if (v) { showToast("ログインしました"); setView({ name: "mine" }); } else { showToast("ログアウトしました"); setView({ name: "top" }); } }} user={data.user} />
      <main className="app-main">{page}</main>
      <AppFoot />

      <button className="demo-toggle" onClick={() => {
        const next = !authed;
        setAuthed(next);
        if (next) { showToast("ログインしました"); setView({ name: "mine" }); }
        else { showToast("ログアウトしました"); setView({ name: "top" }); }
      }}>
        {authed ? "◉ ログイン中(デモ切替)" : "○ 未ログイン(デモ切替)"}
      </button>

      {tweaksOpen && (
        <div className="tweaks-panel">
          <h5>T W E A K S — 配色テーマ</h5>
          <div className="theme-opts">
            {[
              { k: "kinari", l: "生成", sw: ["oklch(0.975 0.01 85)", "oklch(0.48 0.09 45)", "oklch(0.25 0.02 60)"] },
              { k: "roast", l: "深煎", sw: ["oklch(0.22 0.015 45)", "oklch(0.78 0.08 70)", "oklch(0.94 0.01 80)"] },
              { k: "matcha", l: "抹茶", sw: ["oklch(0.965 0.018 120)", "oklch(0.48 0.08 145)", "oklch(0.28 0.03 140)"] },
            ].map(t => (
              <div key={t.k} className={"theme-opt " + (theme === t.k ? "on" : "")} onClick={() => updateTheme(t.k)}>
                <div className="theme-swatch">
                  {t.sw.map((c, i) => <span key={i} style={{ background: c }} />)}
                </div>
                {t.l}
              </div>
            ))}
          </div>
        </div>
      )}

      {toast && <div className="toast"><Icon.check /> {toast}</div>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
