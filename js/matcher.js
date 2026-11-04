/* =====================================================================
   Strict matcher.
   Reads a job description, finds requirements, and classifies each one
   against js/profile.js. It never adds a claim that is not in the profile.

   Levels:  direct | transferable | partial | none
   ===================================================================== */
(function (root) {
  "use strict";

  var NONE_SENTENCE = "This requirement is not currently demonstrated in my work.";
  var LABELS = {
    direct: "Strong match",
    transferable: "Transferable match",
    partial: "Partial match",
    none: "Not demonstrated"
  };

  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&"); }

  function toRe(alias) {
    var a = esc(alias.toLowerCase());
    a = a.replace(/-/g, "[\\s\\-]?").replace(/ /g, "[\\s\\-]+");
    if (/[a-z0-9]$/.test(alias)) a += "(?:s|es)?";
    return new RegExp("(^|[^a-z0-9+#])(" + a + ")(?=$|[^a-z0-9+#])", "i");
  }

  function compile(profile) {
    var groups = [
      ["direct", profile.skills],
      ["transferable", profile.bridges],
      ["partial", profile.partials],
      ["none", profile.gaps]
    ];
    var list = [];
    groups.forEach(function (g) {
      g[1].forEach(function (e) {
        var copy = {};
        for (var k in e) copy[k] = e[k];
        copy.level = g[0];
        copy.res = (e.aliases || []).map(toRe);
        list.push(copy);
      });
    });
    return list;
  }

  function splitLines(text) {
    return text
      .replace(/\r/g, "")
      .split(/\n|[•·▪●◦]|\s[-–—]\s(?=[A-Z])|;\s+|\.\s+(?=[A-Z])/)
      .map(function (s) { return s.replace(/^(?:[\s\-*–—]+|\d+[.)]\s)+/, "").trim(); })
      .filter(function (s) { return s.length > 2; });
  }

  var CUE = /(experience|proficien|knowledge|understanding|ability|able to|familiar|skills?\b|responsible|build|design|manage|lead\b|strong|expertise|must|required|requirement|years?|capable|hands-on|demonstrated|track record)/i;
  var FLUFF = /(salary|benefit|insurance|vacation|equal opportunity|we offer|perks|about us|apply|compensation|paid time|holiday|who we are|our mission|stock options|401k)/i;

  function shorten(s, n) {
    s = s.replace(/\s+/g, " ").trim();
    return s.length > n ? s.slice(0, n - 1).replace(/[\s,;:]+\S*$/, "") + "…" : s;
  }

  function names(profile, ids) {
    return ids.map(function (id) {
      for (var i = 0; i < profile.projects.length; i++) if (profile.projects[i].id === id) return profile.projects[i].name;
      return id;
    });
  }

  function joinList(a) {
    if (a.length <= 1) return a.join("");
    return a.slice(0, -1).join(", ") + " and " + a[a.length - 1];
  }

  function explain(profile, hit, level, downgraded) {
    var e = hit.entry;
    var p = hit.phrase;
    var projs = e.projects && e.projects.length ? joinList(names(profile, e.projects)) : "";
    if (level === "direct") {
      return "I have directly done this" + (projs ? " — in " + projs : "") + ". " + (e.note || "");
    }
    if (level === "transferable") {
      return "I have not held “" + p + "” as a title or tool, but " + (e.bridge || "") ;
    }
    if (level === "partial") {
      if (downgraded) {
        return "It is on my resume (" + e.label + "), but I have not attached project proof here yet, so I count it as partial rather than strong. " + (e.note || "");
      }
      return "I have some exposure, but not depth yet. " + (e.note || "") + (e.growth ? " " + e.growth : "");
    }
    return NONE_SENTENCE + (e.near ? " Closest thing: " + e.near : "");
  }

  function analyze(text, profile, opts) {
    opts = opts || {};
    var strict = opts.strict !== false;
    var list = compile(profile);
    var lines = splitLines(text || "");
    var hits = new Map();
    var covered = {};

    lines.forEach(function (line, li) {
      list.forEach(function (e) {
        if (hits.has(e.id)) return;
        if (e.notIf && e.notIf.test(line)) return;
        for (var r = 0; r < e.res.length; r++) {
          var m = e.res[r].exec(line);
          if (m) {
            hits.set(e.id, { entry: e, phrase: m[2].trim(), line: line, li: li });
            covered[li] = true;
            break;
          }
        }
      });
    });

    var cards = [];
    hits.forEach(function (h) {
      var e = h.entry;
      var level = e.level;
      var downgraded = false;
      if (level === "direct" && e.unlinked && strict) { level = "partial"; downgraded = true; }
      cards.push({
        id: e.id, order: h.li, level: level, phrase: h.phrase, label: e.label,
        line: shorten(h.line, 200),
        projects: (e.projects || []).slice(),
        text: explain(profile, h, level, downgraded),
        near: e.near || "", downgraded: downgraded
      });
    });

    // Requirement-like lines with no known term: honest default is "not demonstrated"
    lines.forEach(function (line, li) {
      if (covered[li]) return;
      if (line.length < 28 || line.length > 260) return;
      if (!CUE.test(line) || FLUFF.test(line)) return;
      cards.push({
        id: "line-" + li, order: li, level: "none", phrase: shorten(line, 90), label: "Stated requirement",
        line: shorten(line, 200), projects: [], text: NONE_SENTENCE, near: "", downgraded: false
      });
    });

    // Years of experience
    var ym = /(\d+)\s*\+?\s*(?:-\s*\d+\s*)?(?:years?|yrs?)/i.exec(text || "");
    var years = ym ? parseInt(ym[1], 10) : 0;
    if (years >= 2) {
      var lvl = years >= 3 ? "none" : "partial";
      cards.push({
        id: "years", order: -1, level: lvl, phrase: ym[0].trim() + " of experience", label: "Years of experience",
        line: shorten(ym[0], 100), projects: ["nexsphere"],
        text: lvl === "none"
          ? NONE_SENTENCE + " My formal role ran " + profile.formalExperience.from + " – " + profile.formalExperience.to + "; the rest is project work."
          : "I have some exposure, but not depth yet. My formal role ran " + profile.formalExperience.from + " – " + profile.formalExperience.to + ", plus project work.",
        near: "", downgraded: false
      });
    }

    cards.sort(function (a, b) { return a.order - b.order; });

    var counts = { direct: 0, transferable: 0, partial: 0, none: 0 };
    cards.forEach(function (c) { counts[c.level]++; });
    var total = cards.length;
    var score = total ? (counts.direct + 0.6 * counts.transferable + 0.3 * counts.partial) / total : 0;

    var senior = /\b(senior|sr\.|principal|staff engineer|head of|director|vp of|vice president)\b/i.test(text || "") || years >= 5;

    // Best evidence: weight project references
    var weight = {};
    cards.forEach(function (c) {
      var w = c.level === "direct" ? 3 : c.level === "transferable" ? 2 : c.level === "partial" ? 1 : 0;
      c.projects.forEach(function (id) { weight[id] = (weight[id] || 0) + w; });
    });
    var best = Object.keys(weight).filter(function (k) { return weight[k] > 0; })
      .sort(function (a, b) { return weight[b] - weight[a]; }).slice(0, 3);

    function lab(level) {
      var seen = {}, out = [];
      cards.forEach(function (c) { if (c.level === level && !seen[c.label]) { seen[c.label] = 1; out.push(c.label === "Stated requirement" ? c.phrase : c.label); } });
      return out;
    }

    var verdict;
    if (!total) {
      verdict = "I could not find clear requirements in that text. Paste the responsibilities and requirements sections and I will think again.";
    } else if (score >= 0.7 && counts.none <= 1) {
      verdict = "A strong overall fit. Most requirements are things I have directly done, and the few gaps are listed below.";
    } else if (score >= 0.45) {
      verdict = "A promising fit with real gaps. My strongest evidence is concentrated in a few projects; the not-demonstrated list is the honest boundary.";
    } else if (score >= 0.25) {
      verdict = "A partial fit. I can contribute where the role overlaps with my AI product and full-stack work, but a lot of this role asks for things I have not demonstrated.";
    } else {
      verdict = "Not a direct match. Most of what this role asks for is outside my demonstrated work, and I would rather say so than stretch.";
    }
    if (senior) {
      verdict += " The role reads as senior; my formal experience is " + profile.formalExperience.label + ", so treat it as a stretch.";
    }

    return {
      cards: cards, counts: counts, total: total, score: score, verdict: verdict,
      strong: lab("direct"), transferable: lab("transferable"), partial: lab("partial"), missing: lab("none"),
      best: best.map(function (id) { return { id: id, weight: weight[id] }; }),
      senior: senior, strict: strict
    };
  }

  var api = { analyze: analyze, LABELS: LABELS, NONE_SENTENCE: NONE_SENTENCE };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Matcher = api;
})(typeof window !== "undefined" ? window : globalThis);
