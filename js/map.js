/* =====================================================================
   Connection map — the "thinking" animation.
   Requirement chips sit on the left, projects on the right.
   Lines draw themselves one by one and resolve to a status colour.
   ===================================================================== */
(function () {
  "use strict";

  var COLORS = {
    direct: "#044f45",
    transferable: "#8a5cf0",
    partial: "#ff9a2e",
    none: "#ff6b4d"
  };

  var cvs, ctx, W, H, dpr, raf, state = null, reduce = false;

  function css(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }

  function size() {
    if (!cvs) return;
    var rect = cvs.parentNode.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(280, rect.width);
    H = Math.max(260, Math.min(520, 70 + Math.max(state ? state.left.length : 6, state ? state.right.length : 4) * 38));
    cvs.width = W * dpr; cvs.height = H * dpr;
    cvs.style.width = W + "px"; cvs.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    layout();
  }

  function layout() {
    if (!state) return;
    var narrow = W < 560;
    var padX = narrow ? 8 : 18;
    var lw = narrow ? W * 0.44 : Math.min(260, W * 0.34);
    var rw = narrow ? W * 0.34 : Math.min(190, W * 0.26);
    state.left.forEach(function (n, i) {
      n.w = lw; n.h = 26;
      n.x = padX; n.y = 28 + (H - 56) * (state.left.length === 1 ? 0.5 : i / (state.left.length - 1));
    });
    state.right.forEach(function (n, i) {
      n.w = rw; n.h = 28;
      n.x = W - padX - rw; n.y = 28 + (H - 56) * (state.right.length === 1 ? 0.5 : i / (state.right.length - 1));
    });
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  function trunc(s, maxW) {
    if (ctx.measureText(s).width <= maxW) return s;
    while (s.length > 1 && ctx.measureText(s + "…").width > maxW) s = s.slice(0, -1);
    return s + "…";
  }

  function frame(t) {
    ctx.clearRect(0, 0, W, H);
    var ink = css("--ink") || "#1a1a1a";
    var dim = css("--dim") || "#5d5e53";
    var elapsed = state.static ? 1e9 : t - state.t0;

    // links
    state.links.forEach(function (l) {
      var p = reduce || state.static ? 1 : Math.max(0, Math.min(1, (elapsed - l.start) / l.dur));
      l.p = p;
      if (p <= 0) return;
      var a = l.a, b = l.b;
      var x1 = a.x + a.w, y1 = a.y, x2 = b.x, y2 = b.y;
      var cx = (x1 + x2) / 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      // draw partial bezier by sampling
      var steps = 28, n = Math.max(1, Math.round(steps * p));
      for (var i = 1; i <= n; i++) {
        var u = (i / steps), v = 1 - u;
        var px = v*v*v*x1 + 3*v*v*u*cx + 3*v*u*u*cx + u*u*u*x2;
        var py = v*v*v*y1 + 3*v*v*u*y1 + 3*v*u*u*y2 + u*u*u*y2;
        ctx.lineTo(px, py);
      }
      ctx.strokeStyle = COLORS[l.level];
      ctx.globalAlpha = p >= 1 ? 0.55 : 0.9;
      ctx.lineWidth = l.level === "direct" ? 1.8 : 1.2;
      if (l.level === "partial") ctx.setLineDash([5, 4]); else if (l.level === "transferable") ctx.setLineDash([2, 3]); else ctx.setLineDash([]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      if (p >= 1 && !l.snapped) { l.snapped = elapsed; a.pulse = elapsed; b.pulse = elapsed; }
      if (l.snapped && elapsed - l.snapped < 420) {
        var k = (elapsed - l.snapped) / 420;
        ctx.beginPath(); ctx.arc(x2, y2, 4 + 10 * k, 0, 6.283);
        ctx.strokeStyle = COLORS[l.level]; ctx.globalAlpha = 1 - k; ctx.lineWidth = 1.5; ctx.stroke(); ctx.globalAlpha = 1;
      }
    });

    // right nodes (projects)
    ctx.font = "600 12px Inter, system-ui, sans-serif";
    ctx.textBaseline = "middle";
    state.right.forEach(function (n) {
      var visible = state.static || reduce || elapsed > n.appear;
      if (!visible) return;
      var glow = n.pulse && elapsed - n.pulse < 500 ? 1 - (elapsed - n.pulse) / 500 : 0;
      roundRect(n.x, n.y - n.h / 2, n.w, n.h, 14);
      ctx.fillStyle = glow ? "rgba(235,216,251," + (0.5 + glow * 0.5) + ")" : "#ffffff";
      ctx.fill();
      ctx.strokeStyle = glow ? "rgba(4,79,69," + (0.5 + glow * 0.5) + ")" : "rgba(4,79,69,0.35)";
      ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = ink; ctx.textAlign = "left";
      ctx.fillText(trunc(n.label, n.w - 18), n.x + 10, n.y + 1);
    });

    // left nodes (requirements)
    ctx.font = "500 12px Inter, system-ui, sans-serif";
    state.left.forEach(function (n) {
      var visible = state.static || reduce || elapsed > n.appear;
      if (!visible) return;
      var lvl = n.settled || (state.static || reduce || elapsed > n.resolve) ? n.level : null;
      var col = lvl ? COLORS[lvl] : "rgba(26,26,26,0.28)";
      roundRect(n.x, n.y - n.h / 2, n.w, n.h, 13);
      ctx.fillStyle = lvl ? hexA(col, 0.12) : "#fffef5";
      ctx.fill();
      ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = lvl ? ink : dim; ctx.textAlign = "left";
      ctx.fillText(trunc(n.label, n.w - 16), n.x + 10, n.y + 1);
      if (lvl) { ctx.beginPath(); ctx.arc(n.x + n.w, n.y, 3.2, 0, 6.283); ctx.fillStyle = col; ctx.fill(); }
    });

    var done = state.static || reduce || elapsed > state.total + 450;
    if (!done) raf = requestAnimationFrame(frame);
    else if (state.onDone && !state.fired) { state.fired = true; state.onDone(); }
  }

  function hexA(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
  }

  window.ThinkMap = {
    init: function (canvas) {
      cvs = canvas; ctx = cvs.getContext("2d");
      reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.addEventListener("resize", function () {
        if (!state) return; size(); cancelAnimationFrame(raf); state.static = true; frame(0);
      });
    },
    /* result: matcher result, profile: PROFILE, opts: {duration, onDone} */
    play: function (result, profile, opts) {
      opts = opts || {};
      cancelAnimationFrame(raf);
      // pick the most informative cards (cap for legibility)
      var order = { direct: 0, transferable: 1, partial: 2, none: 3 };
      var cards = result.cards.slice(0, 40);
      var capped = cards.length > 14
        ? cards.slice().sort(function (a, b) { return order[a.level] - order[b.level]; }).slice(0, 14).sort(function (a, b) { return a.order - b.order; })
        : cards;
      var used = {};
      capped.forEach(function (c) { c.projects.forEach(function (p) { used[p] = 1; }); });
      var right = profile.projects.filter(function (p) { return used[p.id]; })
        .map(function (p) { return { id: p.id, label: p.name, appear: 0 }; });
      if (!right.length) right = profile.projects.slice(0, 3).map(function (p) { return { id: p.id, label: p.name, appear: 0 }; });
      var total = Math.min(opts.duration || 3200, 4000);
      var step = Math.max(80, (total - 700) / Math.max(1, capped.length));
      var left = capped.map(function (c, i) {
        return { id: c.id, label: c.label === "Stated requirement" ? c.phrase : c.phrase.length > 26 ? c.label : c.phrase,
          level: c.level, appear: 200 + i * step * 0.55, resolve: 500 + i * step, projects: c.projects };
      });
      right.forEach(function (n, i) { n.appear = 150 + i * 60; });
      var links = [];
      left.forEach(function (n) {
        if (n.level === "none") return;
        n.projects.forEach(function (pid) {
          var target = right.filter(function (r) { return r.id === pid; })[0];
          if (target) links.push({ a: n, b: target, level: n.level, start: n.resolve - 120, dur: 380 });
        });
      });
      state = { left: left, right: right, links: links, t0: performance.now(), total: total, static: false, onDone: opts.onDone, fired: false };
      size();
      raf = requestAnimationFrame(function (t) { state.t0 = t; frame(t); });
    },
    stop: function () { cancelAnimationFrame(raf); }
  };
})();
