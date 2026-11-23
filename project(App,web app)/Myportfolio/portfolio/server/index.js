import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import multer from "multer";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "secrets.env") });

const DATA_DIR = process.env.DATA_DIR || __dirname;
const DATA_FILE = path.join(DATA_DIR, "data", "projects.json");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
const CLIENT_DIST = path.join(__dirname, "..", "client", "dist");

const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "123Soleil";

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";
const TOKEN_SECRET =
  process.env.TOKEN_SECRET || crypto.randomBytes(32).toString("hex");
const TOKEN_TTL_MS = 1000 * 60 * 60 * 12;

fs.mkdirSync(UPLOAD_DIR, { recursive: true });
fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");

// ---------- Stockage JSON ----------
const readProjects = () =>
  JSON.parse(fs.readFileSync(DATA_FILE, "utf8") || "[]");
const writeProjects = (list) =>
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));

// ---------- Auth (token signé HMAC, sans dépendance) ----------
const sign = (payload) => {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(body)
    .digest("base64url");
  return `${body}.${sig}`;
};
const verify = (token = "") => {
  const [body, sig] = token.split(".");
  if (!body || !sig) return false;
  const expected = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(body)
    .digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    return (
      JSON.parse(Buffer.from(body, "base64url").toString()).exp > Date.now()
    );
  } catch {
    return false;
  }
};
const requireAdmin = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!verify(token)) return res.status(401).json({ error: "Non autorisé" });
  next();
};

const checkPassword = (input) => {
  if (ADMIN_PASSWORD_HASH) {
    const [alg, salt, hash] = ADMIN_PASSWORD_HASH.split(":");
    if (alg !== "scrypt" || !salt || !hash) return false;
    const expected = Buffer.from(hash, "hex");
    const actual = crypto.scryptSync(input, salt, expected.length);
    return crypto.timingSafeEqual(actual, expected);
  }
  const given = Buffer.from(input);
  const real = Buffer.from(ADMIN_PASSWORD);
  return given.length === real.length && crypto.timingSafeEqual(given, real);
};

// Limite basique contre le brute-force sur /login
const attempts = new Map();
const loginLimiter = (req, res, next) => {
  const now = Date.now();
  const rec = attempts.get(req.ip) || { count: 0, reset: now + 15 * 60 * 1000 };
  if (now > rec.reset) {
    rec.count = 0;
    rec.reset = now + 15 * 60 * 1000;
  }
  if (rec.count >= 10)
    return res
      .status(429)
      .json({ error: "Trop de tentatives, réessayez plus tard" });
  rec.count++;
  attempts.set(req.ip, rec);
  next();
};

// ---------- Upload d'images ----------
const ALLOWED = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
};
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) =>
      cb(
        null,
        `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ALLOWED[file.mimetype]}`,
      ),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) =>
    ALLOWED[file.mimetype]
      ? cb(null, true)
      : cb(new Error("Format d'image non supporté (png, jpg, webp, gif)")),
});
const removeImage = (image) => {
  if (!image || !image.startsWith("/uploads/")) return;
  fs.unlink(path.join(UPLOAD_DIR, path.basename(image)), () => {});
};

// ---------- App ----------
const app = express();
app.set("trust proxy", 1); // derrière le proxy Railway (IP réelle pour la limite de connexions)
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json());
app.use("/uploads", express.static(UPLOAD_DIR, { maxAge: "7d" }));

app.post("/api/login", loginLimiter, (req, res) => {
  if (!checkPassword(String(req.body?.password ?? "")))
    return res.status(401).json({ error: "Mot de passe incorrect" });
  res.json({ token: sign({ exp: Date.now() + TOKEN_TTL_MS }) });
});

app.get("/api/me", requireAdmin, (_req, res) => res.json({ admin: true }));

app.get("/api/projects", (_req, res) => {
  res.json(readProjects().sort((a, b) => a.order - b.order));
});

const clean = (body) => ({
  title: String(body.title || "")
    .trim()
    .slice(0, 120),
  description: String(body.description || "")
    .trim()
    .slice(0, 2000),
  link: String(body.link || "")
    .trim()
    .slice(0, 500),
  repo: String(body.repo || "")
    .trim()
    .slice(0, 500),
  tags: String(body.tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 12),
});
const validUrl = (u) => !u || /^https?:\/\//i.test(u);

app.post("/api/projects", requireAdmin, upload.single("image"), (req, res) => {
  const data = clean(req.body);
  if (!data.title)
    return res.status(400).json({ error: "Le titre est obligatoire" });
  if (!validUrl(data.link) || !validUrl(data.repo))
    return res
      .status(400)
      .json({ error: "Les liens doivent commencer par http(s)://" });

  const list = readProjects();
  const project = {
    id: crypto.randomUUID(),
    ...data,
    image: req.file ? `/uploads/${req.file.filename}` : "",
    order: list.length ? Math.max(...list.map((p) => p.order)) + 1 : 0,
    createdAt: new Date().toISOString(),
  };
  list.push(project);
  writeProjects(list);
  res.status(201).json(project);
});


app.put("/api/projects/reorder", requireAdmin, (req, res) => {
  const ids = req.body?.ids;
  if (!Array.isArray(ids)) return res.status(400).json({ error: "ids requis" });
  const list = readProjects();
  ids.forEach((id, i) => {
    const p = list.find((x) => x.id === id);
    if (p) p.order = i;
  });
  writeProjects(list);
  res.json({ ok: true });
});

app.put(
  "/api/projects/:id",
  requireAdmin,
  upload.single("image"),
  (req, res) => {
    const list = readProjects();
    const project = list.find((p) => p.id === req.params.id);
    if (!project) return res.status(404).json({ error: "Projet introuvable" });

    const data = clean({
      ...project,
      tags: project.tags.join(","),
      ...req.body,
    });
    if (!data.title)
      return res.status(400).json({ error: "Le titre est obligatoire" });
    if (!validUrl(data.link) || !validUrl(data.repo))
      return res
        .status(400)
        .json({ error: "Les liens doivent commencer par http(s)://" });

    Object.assign(project, data);
    if (req.file) {
      removeImage(project.image);
      project.image = `/uploads/${req.file.filename}`;
    } else if (req.body.removeImage === "true") {
      removeImage(project.image);
      project.image = "";
    }
    writeProjects(list);
    res.json(project);
  },
);

app.delete("/api/projects/:id", requireAdmin, (req, res) => {
  const list = readProjects();
  const project = list.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: "Projet introuvable" });
  removeImage(project.image);
  writeProjects(list.filter((p) => p.id !== req.params.id));
  res.json({ ok: true });
});


if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get(/^\/(?!api|uploads).*/, (_req, res) =>
    res.sendFile(path.join(CLIENT_DIST, "index.html")),
  );
}


app.use((err, _req, res, _next) => {
  const status = err instanceof multer.MulterError ? 400 : 500;
  res.status(status).json({
    error:
      err.code === "LIMIT_FILE_SIZE"
        ? "Image trop lourde (5 Mo max)"
        : err.message,
  });
});

app.listen(PORT, () =>
  console.log(
    `API portfolio Monterose Hollen Paul sur  http://127.0.0.1:${PORT}`,
  ),
);
