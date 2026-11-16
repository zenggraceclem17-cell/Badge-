"use strict";
const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const COLLECTIONS = ["inscriptions", "presences", "envois", "config"];

if (!ADMIN_PASSWORD) {
  console.warn("ADMIN_PASSWORD n'est pas défini : la connexion organisateur est désactivée.");
}

/* ---------- stockage (fichier JSON) ---------- */
let db = { inscriptions: {}, presences: {}, envois: {}, config: {} };
try {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (fs.existsSync(DB_FILE)) db = Object.assign(db, JSON.parse(fs.readFileSync(DB_FILE, "utf8")));
} catch (e) { console.error("Lecture de la base impossible :", e.message); }

let saving = false, dirty = false;
function save() {
  dirty = true;
  if (saving) return;
  saving = true;
  (function loop() {
    if (!dirty) { saving = false; return; }
    dirty = false;
    const tmp = DB_FILE + ".tmp";
    fs.writeFile(tmp, JSON.stringify(db), (err) => {
      if (err) console.error("Écriture impossible :", err.message);
      else fs.rename(tmp, DB_FILE, () => loop());
      if (err) loop();
    });
  })();
}

/* ---------- authentification ---------- */
function adminToken() {
  return crypto.createHmac("sha256", ADMIN_PASSWORD).update("badge-admin-v1").digest("hex");
}
function safeEqual(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
function requireAdmin(req, res, next) {
  const h = req.get("authorization") || "";
  const t = h.startsWith("Bearer ") ? h.slice(7) : "";
  if (ADMIN_PASSWORD && t && safeEqual(t, adminToken())) return next();
  res.status(401).json({ error: "unauthorized" });
}
const attempts = new Map();
function loginLimiter(req, res, next) {
  const ip = req.ip, now = Date.now();
  const list = (attempts.get(ip) || []).filter((t) => now - t < 60000);
  if (list.length >= 8) return res.status(429).json({ error: "too_many" });
  list.push(now); attempts.set(ip, list);
  next();
}

/* ---------- application ---------- */
const app = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "20kb" }));

app.post("/api/login", loginLimiter, (req, res) => {
  const pw = (req.body && req.body.password) || "";
  if (ADMIN_PASSWORD && typeof pw === "string" && safeEqual(pw, ADMIN_PASSWORD)) return res.json({ token: adminToken() });
  res.status(401).json({ error: "bad_password" });
});

/* Informations publiques pour la page invité */
app.get("/api/public", (req, res) => {
  const c = db.config.event || {};
  res.json({
    name: c.name || "", date: c.date || "", place: c.place || "",
    whatsapp: (process.env.ORGANIZER_WHATSAPP || "").replace(/\D/g, ""),
    email: process.env.ORGANIZER_EMAIL || ""
  });
});

/* Données organisateur */
const ID_RE = /^[A-Za-z0-9_-]{1,40}$/;
function col(req, res, next) {
  if (!COLLECTIONS.includes(req.params.col) || (req.params.id && !ID_RE.test(req.params.id))) return res.status(404).json({ error: "not_found" });
  next();
}
app.get("/api/:col", requireAdmin, col, (req, res) => {
  const c = db[req.params.col];
  res.json(Object.keys(c).map((id) => ({ id, data: c[id] })));
});
app.get("/api/:col/:id", requireAdmin, col, (req, res) => {
  res.json(db[req.params.col][req.params.id] || null);
});
app.put("/api/:col/:id", requireAdmin, col, (req, res) => {
  const b = req.body;
  if (!b || typeof b !== "object" || Array.isArray(b)) return res.status(400).json({ error: "bad_body" });
  if (req.params.col === "inscriptions") {
    const ok = ["nom", "postnom", "prenom", "email", "tel", "badge"].every((k) => typeof b[k] === "string" && b[k].length > 0 && b[k].length < 120);
    if (!ok || b.badge !== req.params.id) return res.status(400).json({ error: "bad_inscription" });
  }
  db[req.params.col][req.params.id] = b;
  save();
  res.json({ ok: true });
});
app.delete("/api/:col/:id", requireAdmin, col, (req, res) => {
  delete db[req.params.col][req.params.id];
  save();
  res.status(204).end();
});

/* Pages */
const pub = path.join(__dirname, "public");
app.get("/", (req, res) => res.sendFile(path.join(pub, "index.html")));
app.get("/admin", (req, res) => res.sendFile(path.join(pub, "admin.html")));
app.get("/healthz", (req, res) => res.send("ok"));

app.listen(PORT, () => console.log("Serveur démarré sur le port " + PORT));
