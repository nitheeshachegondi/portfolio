"use strict";
/* =====================================================================
   POST /api/narrate   — Groq-written "creative read" of a job description.

   The honesty design:
   1. The browser sends ONLY the job description text.
   2. This function re-runs the strict matcher against js/profile.js itself,
      so the model only ever sees facts + match levels computed here.
   3. The model may rephrase and add voice. It may NOT change a level,
      and it gets nothing for "not demonstrated" requirements.
   4. Output is validated: no new numbers, no inflated wording, no text
      for requirements that are not demonstrated. Anything that fails is
      dropped and the page falls back to the matcher's own sentences.

   The key lives only in the GROQ_API_KEY environment variable.
   ===================================================================== */
global.window = global;                 // profile.js attaches to window
require("../js/profile.js");
const M = require("../js/matcher.js");
const P = global.PROFILE;

const URL_ = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const a = (hits.get(ip) || []).filter((t) => now - t < 3600e3);
  if (a.length >= 15) { hits.set(ip, a); return true; }
  a.push(now); hits.set(ip, a);
  return false;
}

const SYSTEM = [
  "You write short, human, editorial copy for a recruiter-facing portfolio, in the first person as Nitheesha Chegondi.",
  "You are given verified facts, and a list of job requirements that were already classified by a strict matcher: direct, transferable, partial, or none.",
  "HARD RULES:",
  "- Never change a requirement's level. Never upgrade it. Never invent a skill, tool, project, number, employer, result or year that is not in the facts.",
  "- Use the job description's own words (jdTerm) when you explain a match.",
  "- For 'transferable' say plainly that it is a related skill, not the exact one. For 'partial' say plainly it is exposure, not depth.",
  "- For level 'none' return an empty string. Do not soften or bridge a gap.",
  "- Be specific: name the real project and what I actually did. No hype words (passionate, expert, rockstar, ninja, extensive, deep).",
  "- Warm, direct, a little wry. Max 26 words per requirement line.",
  "Return ONLY JSON: {\"headline\": string (max 14 words, a sharp one-line take on the fit), \"overall\": string (2-3 sentences, honest about gaps, mention the best project evidence), \"next\": string (one sentence: the kind of role where I would be strongest), \"cards\": {\"<id>\": \"<one line>\"}}"
].join("\n");

function facts(res) {
  const pn = (id) => (P.projects.find((p) => p.id === id) || {}).name || id;
  return {
    me: { name: P.name, summary: P.summary, education: P.education, formalExperience: P.formalExperience.label, openTo: P.openTo },
    projects: P.projects.map((p) => ({ id: p.id, name: p.name, kind: p.kind, role: p.role, tagline: p.tagline, did: p.did })),
    matcherVerdict: res.verdict,
    counts: res.counts,
    requirements: res.cards.slice(0, 18).map((c) => ({
      id: c.id, level: c.level, jdTerm: c.phrase, matchedSkill: c.label,
      honestStatement: c.text, projects: c.projects.map(pn)
    }))
  };
}

const INFLATED = /\b(expert|extensive|extensively|deep(ly)?|mastered|master of|proficient|advanced|world[- ]class|rockstar|ninja|seasoned|years of)\b/i;

function clean(out, f, res) {
  const allowed = new Set(JSON.stringify(f).match(/\d+/g) || []);
  const ok = (s, max) =>
    typeof s === "string" && s.trim().length > 0 && s.length <= (max || 400) &&
    (s.match(/\d+/g) || []).every((n) => allowed.has(n)) && !INFLATED.test(s);
  const levels = {};
  res.cards.forEach((c) => { levels[c.id] = c.level; });
  const cards = {};
  if (out && out.cards && typeof out.cards === "object") {
    Object.keys(out.cards).forEach((id) => {
      if (!(id in levels) || levels[id] === "none") return;
      if (ok(out.cards[id], 220)) cards[id] = out.cards[id].trim();
    });
  }
  return {
    headline: ok(out && out.headline, 140) ? out.headline.trim() : "",
    overall: ok(out && out.overall, 600) ? out.overall.trim() : "",
    next: ok(out && out.next, 260) ? out.next.trim() : "",
    cards
  };
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "post_only" });

  const key = process.env.GROQ_API_KEY;
  if (!key) return res.status(503).json({ error: "no_key" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};
  const jd = String(body.jd || "").slice(0, 6000);
  if (jd.trim().length < 20) return res.status(400).json({ error: "jd_too_short" });

  const ip = String((req.headers && req.headers["x-forwarded-for"]) || "").split(",")[0].trim() ||
    (req.socket && req.socket.remoteAddress) || "unknown";
  if (limited(ip)) return res.status(429).json({ error: "rate_limited" });

  const result = M.analyze(jd, P, { strict: body.strict !== false });
  if (!result.total) return res.status(422).json({ error: "no_requirements" });
  const f = facts(result);

  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 14000);
  try {
    const r = await fetch(URL_, {
      method: "POST",
      signal: ctl.signal,
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.7,
        max_tokens: 1100,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: JSON.stringify(f) }
        ]
      })
    });
    if (!r.ok) return res.status(502).json({ error: "groq_" + r.status });
    const data = await r.json();
    const raw = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    let out;
    try { out = JSON.parse(raw); } catch (e) { return res.status(502).json({ error: "bad_json" }); }
    const cleaned = clean(out, f, result);
    return res.status(200).json(Object.assign({ model: MODEL }, cleaned));
  } catch (e) {
    return res.status(504).json({ error: "timeout_or_network" });
  } finally {
    clearTimeout(timer);
  }
};
