(function () {
  "use strict";
  var P = window.PROFILE, M = window.Matcher, T = window.ThinkMap, S = window.SAMPLES;

  function $(s, r) { return (r || document).querySelector(s); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  var LV = { direct: "Strong match", transferable: "Transferable match", partial: "Partial match", none: "Not demonstrated" };
  var ORDER = ["direct", "transferable", "partial", "none"];

  function project(id) {
    for (var i = 0; i < P.projects.length; i++) if (P.projects[i].id === id) return P.projects[i];
    return null;
  }

  /* ----------------------------- static sections ----------------------------- */
  function renderStory() {
    var tabs = $("#tabs");
    P.projects.forEach(function (p, i) {
      var b = el("button", "tab", p.name);
      b.type = "button"; b.setAttribute("role", "tab"); b.dataset.id = p.id;
      b.setAttribute("aria-selected", i === 0 ? "true" : "false");
      b.addEventListener("click", function () { selectProject(p.id); });
      tabs.appendChild(b);
    });
    selectProject(P.projects[0].id);
  }

  function skillsFor(id) {
    var out = [];
    [["direct", P.skills], ["transferable", P.bridges], ["partial", P.partials]].forEach(function (g) {
      g[1].forEach(function (s) { if ((s.projects || []).indexOf(id) > -1) out.push({ level: g[0], label: s.label }); });
    });
    return out;
  }

  function selectProject(id) {
    var p = project(id), body = $("#storyBody");
    Array.prototype.forEach.call(document.querySelectorAll(".tab"), function (t) {
      t.setAttribute("aria-selected", t.dataset.id === id ? "true" : "false");
    });
    body.textContent = "";
    var left = el("div"), right = el("div");
    left.appendChild(el("h3", null, p.name));
    left.appendChild(el("p", "kind", p.kind + " · " + p.role));
    left.appendChild(el("p", "tag", p.tagline));
    if (p.note) left.appendChild(el("span", "note", p.note));
    var tl = el("ol", "timeline");
    left.appendChild(el("p", "sub", "How it unfolded"));
    p.story.forEach(function (s) {
      var li = el("li"); li.appendChild(el("b", null, s.label)); li.appendChild(el("span", null, s.text)); tl.appendChild(li);
    });
    left.appendChild(tl);

    right.appendChild(el("p", "sub", "What I personally did"));
    var ul = el("ul", "did");
    p.did.forEach(function (d) { ul.appendChild(el("li", null, d)); });
    right.appendChild(ul);

    var sk = skillsFor(id);
    if (sk.length) {
      right.appendChild(el("p", "sub", "Skills this project connects to"));
      var wrap = el("div", "skillchips");
      sk.forEach(function (s) { wrap.appendChild(el("span", "lvl-" + s.level, s.label)); });
      right.appendChild(wrap);
    }
    (p.evidence || []).forEach(function (ev) {
      if (ev.type === "link") { var a = el("a", "visit", ev.label); a.href = ev.href; a.target = "_blank"; a.rel = "noopener"; right.appendChild(a); right.appendChild(el("br")); }
      if (ev.type === "image") { var im = document.createElement("img"); im.src = ev.src; im.alt = ev.label || p.name; im.style.cssText = "max-width:100%;border-radius:10px;margin-top:12px"; right.appendChild(im); }
    });
    if (p.url) { var v = el("a", "visit", "Visit " + p.url.replace(/^https?:\/\//, "") + " ↗"); v.href = p.url; v.target = "_blank"; v.rel = "noopener"; right.appendChild(v); }
    body.appendChild(left); body.appendChild(right);
  }

  function renderGaps() {
    var groups = {}, grid = $("#gapGrid");
    P.gaps.forEach(function (g) { (groups[g.group] = groups[g.group] || []).push(g); });
    Object.keys(groups).forEach(function (name) {
      var box = el("div", "gg"); box.appendChild(el("h4", null, name));
      var ul = el("ul");
      groups[name].forEach(function (g) {
        var li = el("li", null, g.label);
        if (g.near) { li.appendChild(document.createElement("br")); li.appendChild(el("em", null, g.near)); }
        ul.appendChild(li);
      });
      box.appendChild(ul); grid.appendChild(box);
    });
  }

  function renderContact() {
    $("#openTo").textContent = P.openTo;
    var L = P.links, box = $("#links");
    [["email", "Email", function (v) { return "mailto:" + v; }], ["linkedin", "LinkedIn"], ["github", "GitHub"], ["portfolio", "Portfolio"], ["kaizoi", "Kaizoi"], ["promptpocket", "PromptPocket"]]
      .forEach(function (x) {
        if (!L[x[0]]) return;
        var a = el("a", null, x[1] + " ↗"); a.href = x[2] ? x[2](L[x[0]]) : L[x[0]];
        if (!x[2]) { a.target = "_blank"; a.rel = "noopener"; }
        box.appendChild(a);
      });
  }

  /* ------------------- reference letter, receipts, full resume ------------------- */
  // Lights up exact phrases (each once). Mutates `phrases` so a phrase is only marked once overall.
  function mark(parent, text, phrases) {
    while (text) {
      var best = null, bi = -1;
      phrases.forEach(function (ph) {
        var i = text.indexOf(ph);
        if (i > -1 && (bi < 0 || i < bi || (i === bi && ph.length > best.length))) { best = ph; bi = i; }
      });
      if (!best) { parent.appendChild(document.createTextNode(text)); return; }
      if (bi) parent.appendChild(document.createTextNode(text.slice(0, bi)));
      parent.appendChild(el("mark", null, best));
      text = text.slice(bi + best.length);
      phrases.splice(phrases.indexOf(best), 1);
    }
  }

  var STAT = { same: ["same", "Same on my resume"], rel: ["rel", "Related on my resume"], only: ["only", "Only in the reference"] };

  function renderVoices() {
    var R = P.reference; if (!R) return;
    var q = $("#quote"); q.textContent = "";
    var left = R.highlights.slice();
    R.paragraphs.forEach(function (t) { var p = el("p"); mark(p, t, left); q.appendChild(p); });
    $("#quoteBy").textContent = "— " + R.from + ", " + R.org + " (reference letter)";

    var tells = $("#tells"); tells.textContent = "";
    R.tells.forEach(function (t) {
      var d = el("div", "tell"); d.appendChild(el("h4", null, t.h)); d.appendChild(el("p", null, t.t)); d.appendChild(el("small", null, t.s)); tells.appendChild(d);
    });

    var rc = $("#receipts"); rc.textContent = "";
    R.receipts.forEach(function (r) {
      var row = el("div", "rcp"), a = el("div", "said"), b = el("div", "mine");
      a.appendChild(el("h5", null, "The reference says")); a.appendChild(el("p", null, "“" + r.said + "”"));
      b.appendChild(el("h5", null, "My resume says")); b.appendChild(el("p", null, r.mine));
      var s = STAT[r.status] || STAT.only;
      b.appendChild(el("span", "stat " + s[0], s[1]));
      if (r.note) b.appendChild(el("p", "rnote", r.note));
      row.appendChild(a); row.appendChild(b); rc.appendChild(row);
    });
  }

  function renderResume() {
    var R = P.resume, body = $("#resumeBody"); if (!R) return;
    body.textContent = "";
    body.appendChild(el("h3", "r-name", R.name));
    body.appendChild(el("p", "r-headline", R.headline));
    var c = el("p", "r-contact"); c.appendChild(document.createTextNode(R.contact.location));
    R.contact.labels.forEach(function (lab) {
      c.appendChild(document.createTextNode(" | "));
      var url = P.links[lab.toLowerCase()];
      if (url) { var a = el("a", null, lab); a.href = lab === "Email" ? "mailto:" + url : url; if (lab !== "Email") { a.target = "_blank"; a.rel = "noopener"; } c.appendChild(a); }
      else c.appendChild(el("span", null, lab));
    });
    body.appendChild(c);

    function sec(title) { var s = el("div", "r-sec"); s.appendChild(el("h4", null, title)); body.appendChild(s); return s; }
    function bullets(parent, arr) { var ul = el("ul"); arr.forEach(function (t) { ul.appendChild(el("li", null, t)); }); parent.appendChild(ul); }

    var s = sec("SUMMARY"); bullets(s, R.summary);
    s = sec("SKILLS");
    R.skills.forEach(function (k) { var p = el("p", "r-skill"); p.appendChild(el("b", null, k[0] + ": ")); p.appendChild(document.createTextNode(k[1])); s.appendChild(p); });
    s = sec("EXPERIENCE");
    R.experience.forEach(function (x) {
      var it = el("div", "r-item"), row = el("div", "r-row");
      row.appendChild(el("span", null, x.org + " | " + x.role)); row.appendChild(el("span", "r-sub", x.dates));
      it.appendChild(row); bullets(it, x.bullets); s.appendChild(it);
    });
    s = sec("PROJECTS");
    R.projects.forEach(function (p) {
      var it = el("div", "r-item"), row = el("div", "r-row");
      row.appendChild(el("span", null, p.title + (p.role ? " | " + p.role : "")));
      it.appendChild(row);
      var ul = el("ul"); p.bullets.forEach(function (t) { ul.appendChild(el("li", null, t)); });
      if (p.website) { var li = el("li"); li.appendChild(document.createTextNode("Website: ")); var a = el("a", null, p.website); a.href = "https://" + p.website; a.target = "_blank"; a.rel = "noopener"; li.appendChild(a); ul.appendChild(li); }
      it.appendChild(ul); s.appendChild(it);
    });
    s = sec("EDUCATION");
    R.education.forEach(function (e) {
      var it = el("div", "r-item"); it.appendChild(el("div", "r-row", e.degree));
      var r2 = el("div", "r-row"); r2.appendChild(el("span", "r-sub", e.school + " | " + e.years)); it.appendChild(r2); s.appendChild(it);
    });
    s = sec("CERTIFICATIONS"); bullets(s, R.certifications);
  }

  /* -------------------------------- thinking -------------------------------- */
  var timers = [], lastRes = null, lastText = "", lastStrict = true, filter = "all";

  function say(lines) {
    timers.forEach(clearTimeout); timers = [];
    var t = $("#thoughts"); t.textContent = lines[0];
    lines.slice(1).forEach(function (l, i) { timers.push(setTimeout(function () { t.textContent = l; }, (i + 1) * 850)); });
  }

  function hint(msg) { $("#hint").textContent = msg || ""; }

  function run() {
    var text = $("#jd").value.trim();
    if (text.length < 20) { hint("Paste a few lines of the job description first (or speak it)."); return; }
    hint("");
    var strict = $("#strict").checked;
    var res = M.analyze(text, P, { strict: strict });
    if (!res.total) { hint(res.verdict); return; }
    lastRes = res; lastText = text; lastStrict = strict; filter = "all";
    $("#voiceNudge").hidden = true;
    var fx = $("#fixes");
    if (res.fixes && res.fixes.length) {
      fx.textContent = "Voice clean-up: " + res.fixes.map(function (f) { return "“" + f[0] + "” → " + f[1]; }).join("  ·  ") + ". If anything still sounds off, edit the text above and run it again.";
      fx.hidden = false;
    } else { fx.hidden = true; }
    $("#stage").hidden = false; $("#report").hidden = true; $("#replay").hidden = true;
    $("#stage").scrollIntoView({ behavior: "smooth", block: "start" });
    say(["Reading the role…", "Spotted " + res.total + " things it asks for…", "Checking each one against my work…", "Being strict — no stretching…"]);
    T.play(res, P, { duration: 3200, onDone: function () {
      $("#thoughts").textContent = "Here is the honest answer.";
      renderReport(res); $("#replay").hidden = false;
      narrate(text, strict);
    } });
  }

  /* --------------------------------- report --------------------------------- */
  function names(ids) { return ids.map(function (id) { var p = project(id); return p ? p.name : id; }); }
  function join(a) { return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }

  function renderReport(res) {
    $("#verdict").textContent = res.verdict;
    ORDER.forEach(function (k) {
      var m = $(".m-" + k); m.style.flexGrow = res.counts[k]; m.style.display = res.counts[k] ? "" : "none";
    });
    var counts = $("#counts"); counts.textContent = "";
    ORDER.forEach(function (k) {
      var li = el("li"); li.appendChild(el("b", null, String(res.counts[k]))); li.appendChild(document.createTextNode(LV[k].toLowerCase())); counts.appendChild(li);
    });
    $("#modeNote").textContent = res.strict
      ? "Strict mode is on — skills I list without project proof count as partial."
      : "Strict mode is off — resume-listed skills count as strong. Switch it on for the honest view.";
    $("#aiRead").hidden = true; $("#aiStat").hidden = true;

    var sum = $("#summary"); sum.textContent = "";
    function block(cls, title, text) {
      if (!text) return;
      var d = el("div", "sum " + cls); d.appendChild(el("h4", null, title)); d.appendChild(el("p", null, text)); sum.appendChild(d);
    }
    block("best", "Best evidence", res.best.length ? join(names(res.best.map(function (b) { return b.id; }))) + " — where most of the matches come from." : "");
    block("direct", "Strong areas", join(res.strong));
    block("transferable", "Transferable areas", join(res.transferable));
    block("partial", "Partial exposure", join(res.partial));
    block("none", "Not demonstrated", join(res.missing));

    var f = $("#filters"); f.textContent = "";
    [["all", "All (" + res.total + ")"]].concat(ORDER.filter(function (k) { return res.counts[k]; }).map(function (k) { return [k, LV[k] + " (" + res.counts[k] + ")"]; }))
      .forEach(function (x) {
        var b = el("button", "chip", x[1]); b.type = "button"; b.setAttribute("aria-pressed", x[0] === filter ? "true" : "false");
        b.addEventListener("click", function () { filter = x[0]; Array.prototype.forEach.call(f.children, function (c) { c.setAttribute("aria-pressed", "false"); }); b.setAttribute("aria-pressed", "true"); applyFilter(); });
        f.appendChild(b);
      });

    var cards = $("#cards"); cards.textContent = "";
    res.cards.forEach(function (c, i) { var a = card(c); a.style.animationDelay = Math.min(i * 40, 400) + "ms"; cards.appendChild(a); });
    $("#report").hidden = false;
  }

  function applyFilter() {
    Array.prototype.forEach.call(document.querySelectorAll(".rc"), function (c) { c.hidden = !(filter === "all" || c.dataset.level === filter); });
  }

  function card(c) {
    var a = el("article", "rc lvl-" + c.level); a.dataset.level = c.level; a.dataset.id = c.id;
    var top = el("div", "rc-top"); top.appendChild(el("span", "badge", LV[c.level]));
    if (c.ref) top.appendChild(el("span", "refbadge", "Backed by my CIO’s reference"));
    a.appendChild(top);
    a.appendChild(el("p", "rc-q", "“" + c.phrase + "”"));
    a.appendChild(el("p", "rc-t", c.text));
    a.appendChild(el("p", "rc-ai")); $(".rc-ai", a).hidden = true;
    if (c.projects.length) {
      var btn = el("button", "ev", "Evidence ▾"); btn.type = "button"; btn.setAttribute("aria-expanded", "false");
      var dr = el("div", "drawer"); dr.hidden = true;
      c.projects.forEach(function (id) {
        var p = project(id); if (!p) return;
        var d = el("div"); var b = el("b", null, p.name); d.appendChild(b); d.appendChild(document.createTextNode(" — " + p.role));
        var ul = el("ul"); p.did.slice(0, 2).forEach(function (x) { ul.appendChild(el("li", null, x)); }); d.appendChild(ul);
        if (p.url) { var l = el("a", null, p.url.replace(/^https?:\/\//, "") + " ↗"); l.href = p.url; l.target = "_blank"; l.rel = "noopener"; d.appendChild(l); }
        dr.appendChild(d);
      });
      btn.addEventListener("click", function () {
        var open = dr.hidden; dr.hidden = !open; btn.setAttribute("aria-expanded", String(open)); btn.textContent = open ? "Evidence ▴" : "Evidence ▾";
      });
      a.appendChild(btn); a.appendChild(dr);
    }
    return a;
  }

  /* ------------------------ Groq: the creative voice ------------------------ */
  var narrateToken = 0;
  function narrate(text, strict) {
    var token = ++narrateToken, stat = $("#aiStat");
    stat.hidden = false; stat.className = "aistat"; stat.textContent = "Groq is writing my read of this role…";
    fetch("/api/narrate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jd: text, strict: strict }) })
      .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(function (d) {
        if (token !== narrateToken) return;
        var any = false;
        if (d.headline || d.overall || d.next) {
          $("#aiHead").textContent = d.headline || ""; $("#aiHead").hidden = !d.headline;
          $("#aiOverall").textContent = d.overall || ""; $("#aiOverall").hidden = !d.overall;
          $("#aiNext").textContent = d.next || ""; $("#aiNext").hidden = !d.next;
          $("#aiNote").textContent = "Written live by Groq (" + (d.model || "LLM") + ") from my profile. Match levels are fixed by the strict matcher — the AI cannot upgrade them.";
          $("#aiRead").hidden = false; any = true;
        }
        Object.keys(d.cards || {}).forEach(function (id) {
          var c = document.querySelector('.rc[data-id="' + id.replace(/"/g, "") + '"] .rc-ai');
          if (c) { c.textContent = "↳ " + d.cards[id]; c.hidden = false; any = true; }
        });
        stat.hidden = true;
        if (!any) { stat.hidden = false; stat.className = "aistat off"; stat.textContent = "The AI voice returned nothing usable — showing the matcher's own words."; }
      })
      .catch(function () {
        if (token !== narrateToken) return;
        stat.hidden = false; stat.className = "aistat off";
        stat.textContent = "Live AI voice is offline — showing the matcher's own words, which are the strict version anyway.";
      });
  }

  /* ------------------------------- voice input ------------------------------- */
  var rec = null, listening = false;
  function mic() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition, btn = $("#micBtn");
    if (!SR) { hint("Voice input isn't supported in this browser — try Chrome, or paste the text."); return; }
    if (listening) { listening = false; rec.stop(); return; }
    var base = $("#jd").value ? $("#jd").value.trim() + "\n" : "";
    rec = new SR(); rec.lang = "en-US"; rec.continuous = true; rec.interimResults = true;
    var finalText = "";
    rec.onresult = function (e) {
      var interim = "";
      for (var i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript + ". "; else interim += e.results[i][0].transcript;
      }
      $("#jd").value = base + finalText + interim;
    };
    rec.onerror = function () { hint("Couldn't hear that — check mic permission."); };
    rec.onend = function () { var was = listening; listening = false; btn.setAttribute("aria-pressed", "false"); btn.lastChild.textContent = " Browser mic"; if (was === false && $("#jd").value.trim().length >= 20) run(); };
    listening = true; btn.setAttribute("aria-pressed", "true"); btn.lastChild.textContent = " Listening… tap to finish";
    hint("Read the role out loud. Tap again when you're done."); rec.start();
  }

  /* ---------------------------------- init ---------------------------------- */
  function init() {
    renderStory(); renderGaps(); renderVoices(); renderResume(); renderContact();
    $("#printBtn").addEventListener("click", function () { window.print(); });
    $("#year").textContent = new Date().getFullYear();
    T.init($("#map"));
    $("#thinkBtn").addEventListener("click", run);
    $("#micBtn").addEventListener("click", mic);
    $("#jd").addEventListener("keydown", function (e) { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") run(); });
    // Dictation (Wispr Flow types into any text box): nudge after a big insert, and run on the spoken phrase "let it think".
    var prevLen = 0, nudgeT = 0;
    $("#jd").addEventListener("input", function () {
      var ta = this, v = ta.value;
      var m = /(?:^|[\s.,!?])let it think(?: about it)?[\s.!?]*$/i.exec(v);
      if (m && v.slice(0, m.index).trim().length >= 20) {
        ta.value = v.slice(0, m.index).replace(/\s+$/, ""); prevLen = ta.value.length; run(); return;
      }
      var grew = v.length - prevLen; prevLen = v.length;
      if (grew >= 40) {
        var n = $("#voiceNudge"); n.hidden = false; clearTimeout(nudgeT);
        nudgeT = setTimeout(function () { n.hidden = true; }, 14000);
      }
    });
    $("#replay").addEventListener("click", function () {
      if (!lastRes) return; $("#report").hidden = true; $("#replay").hidden = true; say(["Thinking again…", "Re-checking every requirement…"]);
      T.play(lastRes, P, { duration: 3200, onDone: function () { $("#thoughts").textContent = "Here is the honest answer."; renderReport(lastRes); $("#replay").hidden = false; narrate(lastText, lastStrict); } });
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-sample]"), function (b) {
      b.addEventListener("click", function () { $("#jd").value = S[b.dataset.sample]; hint(""); $("#jd").focus(); });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
