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
    var top = el("div", "rc-top"); top.appendChild(el("span", "badge", LV[c.level])); a.appendChild(top);
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
    rec.onend = function () { var was = listening; listening = false; btn.setAttribute("aria-pressed", "false"); btn.lastChild.textContent = " Speak the role"; if (was === false && $("#jd").value.trim().length >= 20) run(); };
    listening = true; btn.setAttribute("aria-pressed", "true"); btn.lastChild.textContent = " Listening… tap to finish";
    hint("Read the role out loud. Tap again when you're done."); rec.start();
  }

  /* ---------------------------------- init ---------------------------------- */
  function init() {
    renderStory(); renderGaps(); renderContact();
    $("#year").textContent = new Date().getFullYear();
    T.init($("#map"));
    $("#thinkBtn").addEventListener("click", run);
    $("#micBtn").addEventListener("click", mic);
    $("#jd").addEventListener("keydown", function (e) { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") run(); });
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
