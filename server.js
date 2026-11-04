"use strict";
/* Tiny local dev server (no dependencies):  node server.js
   Serves the site and /api/narrate. Reads GROQ_API_KEY from .env or the shell. */
const http = require("http");
const fs = require("fs");
const path = require("path");

try {
  fs.readFileSync(path.join(__dirname, ".env"), "utf8").split(/\r?\n/).forEach((line) => {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (m && !line.trim().startsWith("#") && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  });
} catch (e) { /* no .env — fine */ }

const handler = require("./api/narrate.js");
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon" };

http.createServer((req, res) => {
  const url = req.url.split("?")[0];
  if (url === "/api/narrate") {
    let raw = "";
    req.on("data", (c) => { raw += c; if (raw.length > 50000) req.destroy(); });
    req.on("end", () => {
      let body = {};
      try { body = JSON.parse(raw || "{}"); } catch (e) { /* ignore */ }
      req.body = body;
      const shim = {
        setHeader: (k, v) => res.setHeader(k, v),
        status(code) { res.statusCode = code; return shim; },
        json(obj) { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(obj)); }
      };
      handler(req, shim);
    });
    return;
  }
  const safe = path.normalize(url === "/" ? "/index.html" : url).replace(/^(\.\.[\/\\])+/, "");
  const file = path.join(__dirname, safe);
  if (!file.startsWith(__dirname) || /[\/\\]\.env|api[\/\\]|server\.js/.test(safe)) { res.statusCode = 404; return res.end("Not found"); }
  fs.readFile(file, (err, data) => {
    if (err) { res.statusCode = 404; return res.end("Not found"); }
    res.setHeader("Content-Type", TYPES[path.extname(file)] || "application/octet-stream");
    res.end(data);
  });
}).listen(process.env.PORT || 3000, () => console.log("Portfolio on http://localhost:" + (process.env.PORT || 3000) +
  (process.env.GROQ_API_KEY ? "  (Groq key loaded)" : "  (no GROQ_API_KEY — using the matcher's own words)")));
