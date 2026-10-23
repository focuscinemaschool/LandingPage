/* =====================================================================
   FOCUS CINEMA SCHOOL — LOGICA DELLA PAGINA
   I contenuti arrivano da data/contenuti.js (window.FOCUS).
   ===================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  var D = window.FOCUS || {};
  var C = D.contatti || {};
  var registi = D.registi || [];
  var STATI = {
    aperte:    "Iscrizioni aperte",
    soldout:   "Sold out",
    programma: "In programma",
    concluso:  "Concluso"
  };
  var MESI = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];

  /* ---------- utilità ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function waLink(msg) {
    return "https://wa.me/" + (C.whatsapp || "") + (msg ? "?text=" + encodeURIComponent(msg) : "");
  }
  function mailLink(subject, body) {
    var q = [];
    if (subject) q.push("subject=" + encodeURIComponent(subject));
    if (body) q.push("body=" + encodeURIComponent(body));
    return "mailto:" + (C.email || "") + (q.length ? "?" + q.join("&") : "");
  }
  // "AAAA-MM-GG" → Date locale a mezzanotte (evita gli sfasamenti di fuso orario)
  function parseDate(s) {
    if (!s) return null;
    var p = String(s).split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function today() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function formatRange(a, b) {
    if (!a) return "";
    if (!b || a.getTime() === b.getTime()) return a.getDate() + " " + MESI[a.getMonth()] + " " + a.getFullYear();
    if (a.getFullYear() !== b.getFullYear())
      return a.getDate() + " " + MESI[a.getMonth()] + " " + a.getFullYear() + " – " + b.getDate() + " " + MESI[b.getMonth()] + " " + b.getFullYear();
    if (a.getMonth() !== b.getMonth())
      return a.getDate() + " " + MESI[a.getMonth()] + " – " + b.getDate() + " " + MESI[b.getMonth()] + " " + b.getFullYear();
    return a.getDate() + "–" + b.getDate() + " " + MESI[a.getMonth()] + " " + a.getFullYear();
  }
  function daysLabel(a, b) {
    if (!a) return "";
    var n = Math.round(((b || a) - a) / 86400000) + 1;
    return n === 1 ? "1 giorno" : n + " giorni";
  }
  function registaById(id) {
    for (var i = 0; i < registi.length; i++) if (registi[i].id === id) return registi[i];
    return null;
  }
  function placeholder(label, tipo) {
    return '<div class="frame-ph"><span class="cross"></span><span class="ph-text"><strong>' + esc(label || "Immagine dal set") +
      "</strong>" + (tipo === "video" ? "Video autorizzato da inserire" : "Fotografia autorizzata da inserire") + "</span></div>";
  }

  /* ---------- classificazione workshop ---------- */
  var oggi = today();
  var tutti = (D.workshop || []).map(function (w) {
    var inizio = parseDate(w.inizio), fine = parseDate(w.fine) || inizio;
    var stato = w.stato || "programma";
    if (fine && fine < oggi && stato !== "annullato") stato = "concluso";
    return Object.assign({}, w, { _inizio: inizio, _fine: fine, _stato: stato, _regista: registaById(w.regista) });
  }).filter(function (w) { return w._stato !== "annullato"; });

  var prossimi = tutti.filter(function (w) { return w._stato !== "concluso"; })
    .sort(function (a, b) { return (a._inizio || 0) - (b._inizio || 0); });
  var conclusi = tutti.filter(function (w) { return w._stato === "concluso"; })
    .sort(function (a, b) { return (b._inizio || 0) - (a._inizio || 0); });

  function wsName(w) { return w._regista ? w._regista.nome : (w.titolo || "Workshop"); }
  function wsMessage(w) {
    var base = "Ciao Focus Cinema School, vorrei ricevere informazioni sul " + (w.titolo || "workshop").toLowerCase() +
      " con " + wsName(w) + (w._inizio ? " (" + formatRange(w._inizio, w._fine) + ")" : "") + ".";
    if (w._stato === "soldout") base += " So che è sold out: vorrei sapere se si liberano posti o se sono previste nuove date.";
    return base;
  }

  /* ---------- HERO ---------- */
  (function hero() {
    var h = D.hero || {}, box = $("#hero-media");
    if (box && (h.video || h.immagine)) {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (h.video && !reduce) {
        box.innerHTML = '<video autoplay muted loop playsinline preload="metadata"' + (h.immagine ? ' poster="' + esc(h.immagine) + '"' : "") +
          '><source src="' + esc(h.video) + '" type="video/mp4"></video>';
      } else if (h.immagine) {
        box.innerHTML = '<img src="' + esc(h.immagine) + '" alt="" fetchpriority="high">';
      }
      box.classList.add("has-media");
    }
    var next = prossimi.filter(function (w) { return w._stato === "aperte"; })[0] || prossimi[0];
    var p = $("#hero-next");
    if (p && next) {
      p.innerHTML = "Prossimo workshop — <a href=\"#ws-" + esc(next.id) + "\">" + esc(wsName(next)) + " · " +
        esc(formatRange(next._inizio, next._fine)) + "</a>";
      p.hidden = false;
    }
  })();

  /* ---------- LA SCUOLA: immagine ---------- */
  (function scuola() {
    var fig = $("#scuola-figure"), img = D.scuolaImmagine || {};
    if (!fig) return;
    fig.innerHTML = img.src
      ? '<img src="' + esc(img.src) + '" alt="' + esc(img.alt) + '" loading="lazy" decoding="async">'
      : placeholder("Focus Cinema School · sul set");
  })();

  /* ---------- REGISTI ---------- */
  (function directors() {
    var box = $("#directors-list");
    if (!box) return;
    box.innerHTML = registi.map(function (r) {
      var ws = prossimi.filter(function (w) { return w.regista === r.id; })[0];
      var works = (r.lavori || []).length
        ? '<dl class="director-works"><dt>Lavori</dt><dd>' + r.lavori.map(esc).join(" · ") + "</dd></dl>" : "";
      var link = ws
        ? '<a class="director-link" href="#ws-' + esc(ws.id) + '">Workshop · ' + esc(formatRange(ws._inizio, ws._fine)) + " →</a>" : "";
      return '<article class="director reveal">' +
        '<div class="director-photo">' + (r.foto
          ? '<img src="' + esc(r.foto) + '" alt="Ritratto di ' + esc(r.nome) + '" width="480" height="600" loading="lazy" decoding="async">'
          : placeholder("Ritratto")) + "</div>" +
        '<p class="director-role">' + esc(r.ruolo) + "</p>" +
        '<h3 class="director-name">' + esc(r.nome) + "</h3>" +
        (r.bio ? '<p class="director-bio">' + esc(r.bio) + "</p>" : "") +
        works + link + "</article>";
    }).join("");
  })();

  /* ---------- WORKSHOP ---------- */
  (function workshops() {
    var box = $("#workshops-list");
    if (!box) return;

    if (!prossimi.length) {
      box.innerHTML = '<div class="empty-state reveal"><p class="subtitle">Nuove date in arrivo.</p>' +
        "<p>Scrivici per ricevere informazioni sui prossimi workshop.</p>" +
        '<div class="btn-row" style="justify-content:center">' +
        '<a class="btn btn-solid" href="' + waLink("Ciao Focus Cinema School, vorrei essere aggiornato/a sui prossimi workshop.") + '" target="_blank" rel="noopener">Scrivici su WhatsApp</a>' +
        '<a class="btn btn-ghost" href="' + mailLink("Prossimi workshop", "Ciao Focus Cinema School, vorrei essere aggiornato/a sui prossimi workshop.") + '">Invia un\'email</a></div></div>';
      return;
    }

    function meta(label, value, pendingText) {
      var v = value ? esc(value) : esc(pendingText);
      return "<div><dt>" + label + '</dt><dd class="' + (value ? "" : "is-pending") + '">' + v + "</dd></div>";
    }

    box.innerHTML = prossimi.map(function (w) {
      var r = w._regista || {};
      var luogo = [w.citta, w.sede].filter(Boolean).join(" · ");
      if (w.citta && !w.sede) luogo = w.citta + " · sede da comunicare";
      var actions = "";
      if (w.linkIscrizione && w._stato === "aperte") {
        actions += '<a class="btn btn-solid" href="' + esc(w.linkIscrizione) + '">Iscriviti</a>';
      }
      actions += '<button class="btn ' + (w.linkIscrizione && w._stato === "aperte" ? "btn-ghost" : "btn-solid") +
        '" type="button" data-info="' + esc(w.id) + '">Richiedi informazioni</button>';

      return '<article class="ws reveal' + (w._stato === "soldout" ? " is-soldout" : "") + '" id="ws-' + esc(w.id) + '">' +
        '<div class="ws-body">' +
          '<div class="ws-top"><p class="ws-kicker">' + esc(w.titolo || "Workshop") + "</p>" +
          '<span class="status status-' + esc(w._stato) + '">' + esc(STATI[w._stato] || w._stato) + "</span></div>" +
          '<h3 class="ws-name">' + esc(wsName(w)) + "</h3>" +
          '<span class="rule" aria-hidden="true"></span>' +
          (w.descrizione ? '<p class="ws-desc">' + esc(w.descrizione) + "</p>" : "") +
          '<dl class="ws-meta">' +
            meta("Date", formatRange(w._inizio, w._fine), "Da comunicare") +
            meta("Durata", w.durata || daysLabel(w._inizio, w._fine), "Da comunicare") +
            meta("Luogo", luogo, "Da comunicare") +
            meta("Posti", w.posti, "Da comunicare") +
            meta("Costo", w.costo, "Su richiesta") +
          "</dl>" +
          '<div class="ws-actions">' + actions + "</div>" +
        "</div>" +
        '<div class="ws-photo">' + (r.foto
          ? '<img src="' + esc(r.foto) + '" alt="" loading="lazy" decoding="async">' : "") + "</div>" +
      "</article>";
    }).join("");

    // workshop conclusi (in un elenco discreto, mai mostrati come futuri)
    var past = $("#workshops-past");
    if (past && D.mostraConclusi && conclusi.length) {
      past.innerHTML = "<h3>Workshop conclusi</h3><ul>" + conclusi.map(function (w) {
        return "<li><span>" + esc(wsName(w)) + "</span><span>" + esc(formatRange(w._inizio, w._fine)) + "</span></li>";
      }).join("") + "</ul>";
      past.hidden = false;
    }

    // dati strutturati per i motori di ricerca
    var events = prossimi.filter(function (w) { return w._inizio; }).map(function (w) {
      var ev = {
        "@context": "https://schema.org", "@type": "Event",
        name: (w.titolo || "Workshop di recitazione") + " con " + wsName(w),
        description: w.descrizione || "",
        startDate: w.inizio, endDate: w.fine || w.inizio,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: { "@type": "Place", name: w.sede || "Focus Cinema School", address: { "@type": "PostalAddress", addressLocality: w.citta || C.citta || "Roma", addressCountry: "IT" } },
        organizer: { "@type": "Organization", name: "Focus Cinema School", email: C.email },
        performer: w._regista ? { "@type": "Person", name: w._regista.nome } : undefined
      };
      if (w._regista && w._regista.foto) ev.image = new URL(w._regista.foto, location.href).href;
      return ev;
    });
    if (events.length) {
      var s = document.createElement("script");
      s.type = "application/ld+json";
      s.textContent = JSON.stringify(events);
      document.head.appendChild(s);
    }
  })();

  /* ---------- GALLERIA ---------- */
  (function gallery() {
    var box = $("#gallery");
    if (!box) return;
    box.innerHTML = (D.galleria || []).map(function (g) {
      var inner;
      if (g.src && g.tipo === "video") {
        inner = '<video src="' + esc(g.src) + '" controls muted playsinline preload="none"' + (g.poster ? ' poster="' + esc(g.poster) + '"' : "") + "></video>";
      } else if (g.src) {
        inner = '<img src="' + esc(g.src) + '" alt="' + esc(g.alt || g.didascalia) + '" loading="lazy" decoding="async">';
      } else {
        return '<figure class="g-item reveal">' + placeholder(g.didascalia, g.tipo) + "</figure>";
      }
      return '<figure class="g-item reveal">' + inner + (g.didascalia ? "<figcaption>" + esc(g.didascalia) + "</figcaption>" : "") + "</figure>";
    }).join("");
  })();

  /* ---------- FAQ ---------- */
  (function faq() {
    var box = $("#faq-list");
    if (!box) return;
    // le risposte sono scritte dalla scuola in data/contenuti.js e possono contenere semplice HTML
    box.innerHTML = (D.faq || []).map(function (f) {
      return '<details class="faq-item reveal"><summary>' + esc(f.d) + '</summary><div class="faq-answer"><p>' + f.r + "</p></div></details>";
    }).join("");
  })();

  /* ---------- Dati legali nel footer ---------- */
  (function legal() {
    var p = $("#legal-data"), L = D.legale || {};
    if (!p) return;
    var parts = [L.titolare, L.sede, L.piva ? "P. IVA / C.F. " + L.piva : "", L.altro].filter(Boolean);
    var year = new Date().getFullYear();
    p.innerHTML = "© " + year + " Focus Cinema School" + (parts.length
      ? " · " + parts.map(esc).join(" · ")
      : ' · <span class="legal-missing">[Dati legali da completare in data/contenuti.js]</span>');
  })();

  /* ---------- Link WhatsApp / email precompilati ---------- */
  $all("[data-contact]").forEach(function (a) {
    var type = a.getAttribute("data-contact"), msg = a.getAttribute("data-message") || "";
    if (type === "whatsapp") a.href = waLink(msg);
    else if (type === "email") a.href = mailLink(a.getAttribute("data-subject") || "", msg);
    else if (type === "instagram" && C.instagram) a.href = C.instagram;
  });

  /* ---------- Dialog "Richiedi informazioni" ---------- */
  (function infoDialog() {
    var dlg = $("#info-dialog");
    if (!dlg) return;
    var title = $("#dialog-title"), metaEl = $("#dialog-meta"), ta = $("#dialog-message"),
        wa = $("#dialog-wa"), mail = $("#dialog-mail"), current = null, opener = null;

    function sync() {
      var msg = ta.value.trim();
      wa.href = waLink(msg);
      mail.href = mailLink("Informazioni workshop — " + (current ? wsName(current) : ""), msg);
    }
    ta.addEventListener("input", sync);

    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-info]");
      if (!btn) return;
      var id = btn.getAttribute("data-info");
      current = tutti.filter(function (w) { return w.id === id; })[0];
      if (!current) return;
      opener = btn;
      title.textContent = wsName(current);
      metaEl.textContent = [current.titolo, formatRange(current._inizio, current._fine)].filter(Boolean).join(" · ");
      ta.value = wsMessage(current);
      sync();
      if (typeof dlg.showModal === "function") dlg.showModal();
      else window.open(waLink(ta.value), "_blank", "noopener");
    });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("close", function () { if (opener) opener.focus(); });
  })();

  /* ---------- Cortometraggi: approfondimento ---------- */
  (function corti() {
    var btn = $("#corti-toggle"), panel = $("#corti-details");
    if (!btn || !panel) return;
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
      btn.textContent = open ? "Scopri il progetto" : "Chiudi";
      if (!open) {
        var h = panel.querySelector("h3");
        h.setAttribute("tabindex", "-1");
        h.focus({ preventScroll: true });
      }
    });
  })();

  /* ---------- Header e menu mobile ---------- */
  (function nav() {
    var header = $(".site-header"), toggle = $(".menu-toggle"), menu = $("#mobile-menu");
    function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 24); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    function setMenu(open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector(".menu-toggle-label").textContent = open ? "Chiudi" : "Menu";
      menu.hidden = !open;
      document.body.classList.toggle("menu-open", open);
      if (open) { var first = menu.querySelector("a"); if (first) first.focus(); }
    }
    toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setMenu(false); toggle.focus(); }
    });
    window.addEventListener("resize", function () { if (window.innerWidth > 1080 && !menu.hidden) setMenu(false); });

    // voce di menu attiva
    if ("IntersectionObserver" in window) {
      var links = $all(".main-nav a");
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (l) { l.setAttribute("aria-current", String(l.getAttribute("href") === "#" + en.target.id)); });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      links.forEach(function (l) { var s = $(l.getAttribute("href")); if (s) io.observe(s); });
    }
  })();

  /* ---------- Apparizioni allo scorrimento ---------- */
  (function reveal() {
    var items = $all(".reveal");
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- Modulo contatti ---------- */
  (function form() {
    var f = $("#contact-form"), status = $("#form-status");
    if (!f) return;
    function setStatus(msg, err) { status.textContent = msg; status.classList.toggle("is-error", !!err); }

    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (f.sito.value) return; // spam
      var invalid = null;
      ["nome", "email", "messaggio"].forEach(function (n) {
        var el = f[n], ok = el.value.trim() && (n !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()));
        el.setAttribute("aria-invalid", String(!ok));
        if (!ok && !invalid) invalid = el;
      });
      if (invalid) { setStatus("Controlla i campi evidenziati.", true); invalid.focus(); return; }
      if (!f.privacy.checked) { setStatus("Per inviare il messaggio è necessario prendere visione dell'informativa privacy.", true); f.privacy.focus(); return; }

      var data = { nome: f.nome.value.trim(), email: f.email.value.trim(), oggetto: f.oggetto.value, messaggio: f.messaggio.value.trim() };

      if (D.moduloEndpoint) {
        setStatus("Invio in corso…");
        fetch(D.moduloEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(data)
        }).then(function (r) {
          if (!r.ok) throw new Error(r.status);
          f.reset();
          setStatus("Grazie, abbiamo ricevuto il tuo messaggio. Ti risponderemo il prima possibile.");
        }).catch(function () {
          setStatus("Non è stato possibile inviare il messaggio. Scrivici a " + C.email + " o su WhatsApp.", true);
        });
      } else {
        // senza endpoint: apre il programma di posta con il messaggio già compilato
        var body = data.messaggio + "\n\n— " + data.nome + " (" + data.email + ")";
        window.location.href = mailLink(data.oggetto, body);
        setStatus("Si sta aprendo il tuo programma di posta con il messaggio già compilato.");
      }
    });
  })();
})();
