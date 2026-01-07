const express = require("express");
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const mime = require("mime-types");
const multer = require("multer");
const { spawn } = require("child_process");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5179;
const HOST = process.env.HOST || "0.0.0.0";
const ROOT_DIR = process.cwd();
const CONFIG_PATH = path.join(ROOT_DIR, "media.config.json");
const DATA_DIR = path.join(ROOT_DIR, "data");
const POSTERS_DIR = path.join(DATA_DIR, "posters");
const STATE_PATH = path.join(DATA_DIR, "state.json");
const DEFAULT_LOCAL_PATH = path.join(ROOT_DIR, "media");
const VIDEO_EXTS = new Set([
  ".mp4",
  ".mkv",
  ".webm",
  ".mov",
  ".avi",
  ".m4v",
  ".mpg",
  ".mpeg",
  ".ts",
  ".m2ts"
]);
const POSTER_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const SUBTITLE_EXTS = [".vtt", ".srt"];
const AUTO_POSTER_PREFIX = "auto-";
const AUTO_POSTER_EXT = ".jpg";
const AUTO_POSTER_WIDTH = 480;
const AUTO_POSTER_SEEK = "00:00:05";
const AUTO_POSTER_TIMEOUT_MS = 20000;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/";
const TMDB_CACHE_TTL_MS = 10 * 60 * 1000;

let libraryCache = {
  refreshedAt: null,
  localPath: DEFAULT_LOCAL_PATH,
  items: [],
  byId: new Map()
};
let stateCache = null;
let stateWrite = Promise.resolve();
let ffmpegAvailable = null;
let ffmpegMissingLogged = false;
const tmdbCache = new Map();

function toBase64Url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(input) {
  const pad = input.length % 4 ? "=".repeat(4 - (input.length % 4)) : "";
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return Buffer.from(base64, "base64").toString("utf8");
}

function toTitle(name) {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveLocalPath(configPath) {
  if (!configPath) {
    return DEFAULT_LOCAL_PATH;
  }
  return path.isAbsolute(configPath)
    ? configPath
    : path.join(ROOT_DIR, configPath);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

const PROFILE_COLORS = [
  "#f87171",
  "#fb923c",
  "#facc15",
  "#4ade80",
  "#38bdf8",
  "#60a5fa",
  "#a78bfa",
  "#f472b6"
];
const PROFILE_AVATARS = new Set([
  "nebula",
  "ember",
  "mint",
  "cobalt",
  "orchid",
  "sand",
  "glacier",
  "rose"
]);

function hashString(value) {
  let hash = 0;
  const text = String(value || "");
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function sanitizeColor(value) {
  const text = String(value || "").trim();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(text)) {
    return text;
  }
  return null;
}

function pickProfileColor(seed) {
  return PROFILE_COLORS[hashString(seed) % PROFILE_COLORS.length];
}

function sanitizeAvatar(value) {
  const avatar = String(value || "").trim();
  if (PROFILE_AVATARS.has(avatar)) {
    return avatar;
  }
  return "";
}

function normalizeProfile(profile) {
  const id = String(profile && profile.id ? profile.id : "profile");
  const name = String(profile && profile.name ? profile.name : "Profile");
  const color = sanitizeColor(profile && profile.color)
    || pickProfileColor(id || name);
  const avatar = sanitizeAvatar(profile && profile.avatar);
  return { id, name, color, avatar };
}

function buildSafeFilename(originalName) {
  const ext = path.extname(originalName || "").toLowerCase();
  const base =
    slugify(path.basename(originalName || "movie", ext)) || "movie";
  const stamp = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  return `${base}-${stamp}${ext || ".mp4"}`;
}

function isSubPath(child, parent) {
  const relative = path.relative(parent, child);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function getTmdbApiKey(config) {
  return String(process.env.TMDB_API_KEY || config.tmdbApiKey || "").trim();
}

function getTmdbBearer(config) {
  return String(
    process.env.TMDB_BEARER ||
      process.env.TMDB_ACCESS_TOKEN ||
      process.env.TMDB_TOKEN ||
      config.tmdbBearer ||
      ""
  ).trim();
}

function getTmdbLanguage(config) {
  return String(process.env.TMDB_LANG || config.tmdbLanguage || "en-US").trim();
}

function buildTmdbImage(pathSuffix, size = "w500") {
  if (!pathSuffix) {
    return null;
  }
  return `${TMDB_IMAGE_BASE}${size}${pathSuffix}`;
}

function getCachedTmdb(url) {
  const cached = tmdbCache.get(url);
  if (!cached) {
    return null;
  }
  if (cached.expiresAt <= Date.now()) {
    tmdbCache.delete(url);
    return null;
  }
  return cached.data;
}

function setCachedTmdb(url, data) {
  tmdbCache.set(url, { data, expiresAt: Date.now() + TMDB_CACHE_TTL_MS });
}

async function tmdbRequest(config, endpoint, params = {}) {
  const apiKey = getTmdbApiKey(config);
  const bearer = getTmdbBearer(config);
  if (!apiKey && !bearer) {
    const error = new Error("TMDB API key not configured");
    error.code = "TMDB_KEY_MISSING";
    throw error;
  }
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  if (apiKey) {
    url.searchParams.set("api_key", apiKey);
  }
  const language = getTmdbLanguage(config);
  if (language) {
    url.searchParams.set("language", language);
  }
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    url.searchParams.set(key, String(value));
  });
  const cached = getCachedTmdb(url.toString());
  if (cached) {
    return cached;
  }
  const headers = bearer
    ? { accept: "application/json", Authorization: `Bearer ${bearer}` }
    : { accept: "application/json" };
  const response = await fetch(url, { headers });
  if (!response.ok) {
    const error = new Error(`TMDB request failed (${response.status})`);
    error.code = "TMDB_ERROR";
    throw error;
  }
  const data = await response.json();
  setCachedTmdb(url.toString(), data);
  return data;
}

const TMDB_DROP_TOKENS = new Set([
  "1080p",
  "720p",
  "2160p",
  "4k",
  "8k",
  "hdr",
  "uhd",
  "bluray",
  "brrip",
  "webrip",
  "web",
  "webdl",
  "dvdrip",
  "xvid",
  "x264",
  "x265",
  "h264",
  "h265",
  "hevc",
  "aac",
  "dts",
  "atmos",
  "remux",
  "proper",
  "repack",
  "extended",
  "unrated",
  "cam",
  "ts",
  "tc",
  "dv",
  "hdr10"
]);

function normalizeSearchText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function extractYearFromText(value) {
  const match = String(value || "").match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : "";
}

function cleanTitleForSearch(rawValue) {
  if (!rawValue) {
    return "";
  }
  let value = String(rawValue);
  value = value.replace(/\.[^.]+$/, "");
  value = value.replace(/[\[\(][^\]\)]+[\]\)]/g, " ");
  value = value.replace(/[._-]+/g, " ");
  value = value.replace(/\s+/g, " ").trim();
  const parts = value.split(" ").filter(Boolean);
  const filtered = parts.filter((part) => {
    const lower = part.toLowerCase();
    if (extractYearFromText(lower)) {
      return false;
    }
    if (TMDB_DROP_TOKENS.has(lower)) {
      return false;
    }
    return true;
  });
  return filtered.join(" ").trim() || value;
}

function scoreTmdbResult(query, year, result) {
  const queryNorm = normalizeSearchText(query);
  const titleNorm = normalizeSearchText(
    result.title || result.original_title || ""
  );
  if (!titleNorm) {
    return -1;
  }
  let score = 0;
  if (titleNorm === queryNorm) {
    score += 5;
  } else if (titleNorm.includes(queryNorm) || queryNorm.includes(titleNorm)) {
    score += 3;
  }
  if (year && result.release_date && result.release_date.startsWith(year)) {
    score += 2;
  }
  if (typeof result.popularity === "number") {
    score += Math.min(2, result.popularity / 50);
  }
  return score;
}

function pickBestTmdbResult(query, year, results) {
  let best = null;
  let bestScore = -1;
  results.forEach((result) => {
    const score = scoreTmdbResult(query, year, result);
    if (score > bestScore) {
      bestScore = score;
      best = result;
    }
  });
  return best;
}

function extFromContentType(type) {
  if (!type) {
    return "";
  }
  if (type.includes("png")) {
    return ".png";
  }
  if (type.includes("webp")) {
    return ".webp";
  }
  if (type.includes("jpeg") || type.includes("jpg")) {
    return ".jpg";
  }
  return "";
}

async function downloadPosterImage(url, filenameBase, overwrite = false) {
  if (!url) {
    return null;
  }
  await ensureDirs();
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Poster download failed");
  }
  const contentType = response.headers.get("content-type") || "";
  const urlExt = path.extname(new URL(url).pathname) || "";
  const ext =
    extFromContentType(contentType.toLowerCase()) ||
    (POSTER_EXTS.has(urlExt.toLowerCase()) ? urlExt.toLowerCase() : ".jpg");
  const filename = `${filenameBase}${ext}`;
  const outputPath = path.join(POSTERS_DIR, filename);
  if (!overwrite && (await fileExists(outputPath))) {
    return filename;
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await fsp.writeFile(outputPath, buffer);
  return filename;
}

function cleanupStateForId(state, id) {
  if (!state) {
    return;
  }
  if (state.metadataOverrides && state.metadataOverrides[id]) {
    delete state.metadataOverrides[id];
  }
  if (state.posters && state.posters[id]) {
    delete state.posters[id];
  }
  if (state.progress) {
    Object.values(state.progress).forEach((profile) => {
      if (profile && profile[id]) {
        delete profile[id];
      }
    });
  }
  if (state.ratings) {
    Object.values(state.ratings).forEach((profile) => {
      if (profile && profile[id]) {
        delete profile[id];
      }
    });
  }
  if (state.favorites) {
    Object.values(state.favorites).forEach((profile) => {
      if (profile && profile[id]) {
        delete profile[id];
      }
    });
  }
  if (state.reactions) {
    Object.values(state.reactions).forEach((profile) => {
      if (profile && profile[id]) {
        delete profile[id];
      }
    });
  }
}

async function safeUnlink(filePath) {
  try {
    await fsp.unlink(filePath);
  } catch {
    // Ignore.
  }
}

async function deleteLocalItem(item, localPath, state, removeFile = true) {
  const fullPath = path.join(localPath, item.path);
  if (removeFile) {
    await safeUnlink(fullPath);
  }
  const base = fullPath.replace(/\.[^.]+$/, "");
  await safeUnlink(`${base}.json`);
  await safeUnlink(`${base}.meta.json`);
  const posterFile = await findPosterForFile(fullPath);
  if (posterFile) {
    await safeUnlink(posterFile);
  }
  await safeUnlink(autoPosterPath(item.id));
  if (state.posters && state.posters[item.id]) {
    const posterName = state.posters[item.id].file;
    await safeUnlink(path.join(POSTERS_DIR, posterName));
  }
  cleanupStateForId(state, item.id);
}

async function deleteUrlItem(item, config, state) {
  config.urls = config.urls.filter(
    (entry) => toBase64Url(entry.url) !== item.id
  );
  await safeUnlink(autoPosterPath(item.id));
  if (state.posters && state.posters[item.id]) {
    const posterName = state.posters[item.id].file;
    await safeUnlink(path.join(POSTERS_DIR, posterName));
  }
  cleanupStateForId(state, item.id);
}

function normalizeRating(value) {
  const rating = Number(value);
  if (!Number.isFinite(rating) || rating <= 0) {
    return null;
  }
  if (rating > 5 && rating <= 10) {
    return Math.round((rating / 2) * 10) / 10;
  }
  return Math.min(5, Math.round(rating * 10) / 10);
}

function normalizeYear(value) {
  const year = Number(value);
  if (!Number.isFinite(year) || year <= 0) {
    return null;
  }
  return Math.floor(year);
}

function normalizeTags(tags) {
  if (!tags) {
    return [];
  }
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean);
  }
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
}

function sanitizeMetadata(input) {
  const meta = {
    title:
      input && typeof input.title === "string" ? input.title.trim() : null,
    group:
      input && typeof input.group === "string" ? input.group.trim() : null,
    synopsis:
      input && typeof input.synopsis === "string"
        ? input.synopsis.trim()
        : null,
    year: normalizeYear(input && input.year),
    rating: normalizeRating(input && input.rating),
    tags: normalizeTags(
      input && (input.tags || input.genres || input.genre)
    )
  };
  return meta;
}

function hasMetadata(meta) {
  if (!meta) {
    return false;
  }
  return Boolean(
    (meta.title && meta.title.length) ||
      (meta.group && meta.group.length) ||
      (meta.synopsis && meta.synopsis.length) ||
      meta.year ||
      meta.rating ||
      (meta.tags && meta.tags.length)
  );
}

async function fileExists(filePath) {
  try {
    await fsp.access(filePath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

async function getMetadataWritePath(filePath) {
  const base = filePath.replace(/\.[^.]+$/, "");
  const primary = `${base}.json`;
  const fallback = `${base}.meta.json`;
  if (await fileExists(primary)) {
    return primary;
  }
  if (await fileExists(fallback)) {
    return fallback;
  }
  return fallback;
}

async function ensureDirs() {
  await fsp.mkdir(DATA_DIR, { recursive: true });
  await fsp.mkdir(POSTERS_DIR, { recursive: true });
}

ensureDirs().catch((err) => {
  console.error("Failed to initialize data directories:", err.message);
});

function autoPosterFilename(id) {
  return `${AUTO_POSTER_PREFIX}${id}${AUTO_POSTER_EXT}`;
}

function autoPosterPath(id) {
  return path.join(POSTERS_DIR, autoPosterFilename(id));
}

function autoPosterUrl(id) {
  return `/posters/${autoPosterFilename(id)}`;
}

function markFfmpegMissing() {
  ffmpegAvailable = false;
  if (!ffmpegMissingLogged) {
    ffmpegMissingLogged = true;
    console.warn(
      "ffmpeg not found in PATH. Auto posters for streams/local files disabled."
    );
  }
}

function runFfmpeg(args, timeoutMs = AUTO_POSTER_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const proc = spawn("ffmpeg", args, {
      windowsHide: true,
      stdio: ["ignore", "ignore", "pipe"]
    });
    let done = false;
    const timer = setTimeout(() => {
      if (!done) {
        proc.kill("SIGKILL");
      }
    }, timeoutMs);
    proc.on("error", (err) => {
      clearTimeout(timer);
      done = true;
      if (err && err.code === "ENOENT") {
        markFfmpegMissing();
      }
      reject(err);
    });
    proc.on("close", (code) => {
      clearTimeout(timer);
      done = true;
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`ffmpeg failed (${code})`));
      }
    });
  });
}

async function generatePosterFromUrl(url, outputPath) {
  await ensureDirs();
  const args = [
    "-y",
    "-loglevel",
    "error",
    "-ss",
    AUTO_POSTER_SEEK,
    "-i",
    url,
    "-frames:v",
    "1",
    "-vf",
    `scale=${AUTO_POSTER_WIDTH}:-1`,
    "-q:v",
    "3",
    outputPath
  ];
  await runFfmpeg(args);
  return fileExists(outputPath);
}

async function generatePosterFromFile(filePath, outputPath) {
  await ensureDirs();
  const args = [
    "-y",
    "-loglevel",
    "error",
    "-ss",
    AUTO_POSTER_SEEK,
    "-i",
    filePath,
    "-frames:v",
    "1",
    "-vf",
    `scale=${AUTO_POSTER_WIDTH}:-1`,
    "-q:v",
    "3",
    outputPath
  ];
  await runFfmpeg(args);
  return fileExists(outputPath);
}

async function ensureUrlPoster(item) {
  if (!item || item.type !== "url" || item.poster) {
    return item && item.poster ? item.poster : null;
  }
  if (ffmpegAvailable === false) {
    return null;
  }
  const outputPath = autoPosterPath(item.id);
  if (await fileExists(outputPath)) {
    return autoPosterUrl(item.id);
  }
  try {
    const ok = await generatePosterFromUrl(item.url, outputPath);
    if (ok) {
      ffmpegAvailable = true;
      return autoPosterUrl(item.id);
    }
  } catch (err) {
    if (err && err.code === "ENOENT") {
      markFfmpegMissing();
    }
  }
  return null;
}

async function ensureLocalPoster(item, localPath) {
  if (!item || item.type !== "local") {
    return null;
  }
  if (ffmpegAvailable === false) {
    return null;
  }
  const outputPath = autoPosterPath(item.id);
  if (await fileExists(outputPath)) {
    return autoPosterUrl(item.id);
  }
  const fullPath = path.join(localPath, item.path);
  try {
    const ok = await generatePosterFromFile(fullPath, outputPath);
    if (ok) {
      ffmpegAvailable = true;
      return autoPosterUrl(item.id);
    }
  } catch (err) {
    if (err && err.code === "ENOENT") {
      markFfmpegMissing();
    }
  }
  return null;
}

function defaultState() {
  return {
    activeProfileId: "default",
    profiles: [normalizeProfile({ id: "default", name: "Default" })],
    progress: {},
    posters: {},
    ratings: {},
    favorites: {},
    reactions: {},
    metadataOverrides: {}
  };
}

async function loadState() {
  await ensureDirs();
  try {
    const raw = await fsp.readFile(STATE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    const state = {
      activeProfileId: parsed.activeProfileId || "default",
      profiles: Array.isArray(parsed.profiles)
        ? parsed.profiles.map((profile) => normalizeProfile(profile))
        : [],
      progress: parsed.progress || {},
      posters: parsed.posters || {},
      ratings: parsed.ratings || {},
      favorites: parsed.favorites || {},
      reactions: parsed.reactions || {},
      metadataOverrides: parsed.metadataOverrides || {}
    };
    if (state.profiles.length === 0) {
      state.profiles = [normalizeProfile({ id: "default", name: "Default" })];
    }
    const ids = new Set(state.profiles.map((profile) => profile.id));
    if (!ids.has(state.activeProfileId)) {
      state.activeProfileId = state.profiles[0].id;
    }
    return state;
  } catch (err) {
    if (err.code === "ENOENT") {
      return defaultState();
    }
    throw err;
  }
}

async function saveState(state) {
  await ensureDirs();
  const tempPath = `${STATE_PATH}.${process.pid}.${Date.now()}.${Math.random()
    .toString(16)
    .slice(2)}.tmp`;
  await fsp.writeFile(tempPath, JSON.stringify(state, null, 2), "utf8");
  await fsp.rename(tempPath, STATE_PATH);
}

async function getState() {
  if (!stateCache) {
    stateCache = await loadState();
  }
  return stateCache;
}

async function persistState(state) {
  stateCache = state;
  const write = stateWrite.then(() => saveState(state));
  stateWrite = write.catch(() => {});
  return write;
}

function ensureProfile(state, profileId) {
  if (!state.progress[profileId]) {
    state.progress[profileId] = {};
  }
  if (!state.ratings[profileId]) {
    state.ratings[profileId] = {};
  }
  if (!state.favorites[profileId]) {
    state.favorites[profileId] = {};
  }
  if (!state.reactions[profileId]) {
    state.reactions[profileId] = {};
  }
}

async function loadConfig() {
  try {
    const raw = await fsp.readFile(CONFIG_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return {
      localPath: parsed.localPath || DEFAULT_LOCAL_PATH,
      urls: Array.isArray(parsed.urls) ? parsed.urls : [],
      autoPosters: parsed.autoPosters !== false,
      tmdbApiKey: parsed.tmdbApiKey || "",
      tmdbBearer: parsed.tmdbBearer || "",
      tmdbLanguage: parsed.tmdbLanguage || ""
    };
  } catch (err) {
    if (err.code === "ENOENT") {
      return {
        localPath: DEFAULT_LOCAL_PATH,
        urls: [],
        autoPosters: true,
        tmdbApiKey: "",
        tmdbBearer: "",
        tmdbLanguage: ""
      };
    }
    throw err;
  }
}

async function saveConfig(config) {
  const payload = {
    localPath: config.localPath || DEFAULT_LOCAL_PATH,
    autoPosters: config.autoPosters !== false,
    urls: Array.isArray(config.urls) ? config.urls : [],
    tmdbApiKey: config.tmdbApiKey || "",
    tmdbBearer: config.tmdbBearer || "",
    tmdbLanguage: config.tmdbLanguage || ""
  };
  await fsp.writeFile(CONFIG_PATH, JSON.stringify(payload, null, 2), "utf8");
}

async function ensureLocalLibraryPath() {
  const config = await loadConfig();
  const localPath = resolveLocalPath(config.localPath);
  await fsp.mkdir(localPath, { recursive: true });
  return { config, localPath };
}

async function walkDir(dir, baseDir, results) {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkDir(fullPath, baseDir, results);
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (!VIDEO_EXTS.has(ext)) {
      continue;
    }
    const relPath = path.relative(baseDir, fullPath);
    const segments = relPath.split(path.sep).filter(Boolean);
    const folderGroup = segments.length > 1 ? segments[0] : "Library";
    const metadata = await findMetadataForFile(fullPath);
    const group = metadata && metadata.group ? metadata.group : folderGroup;
    const title = metadata && metadata.title ? metadata.title : toTitle(entry.name);
    const stats = await fsp.stat(fullPath);
    const id = toBase64Url(relPath);
    const posterFile = await findPosterForFile(fullPath);
    const subtitle = await findSubtitleForFile(fullPath);
    results.push({
      id,
      type: "local",
      title,
      group,
      path: relPath,
      size: stats.size,
      ext,
      updatedAt: stats.mtime.toISOString(),
      posterFile,
      hasSubtitle: Boolean(subtitle),
      tags: metadata ? metadata.tags : [],
      synopsis: metadata ? metadata.synopsis : null,
      year: metadata ? metadata.year : null,
      rating: metadata ? metadata.rating : null
    });
  }
}

async function findPosterForFile(filePath) {
  const base = filePath.replace(/\.[^.]+$/, "");
  const extensions = [".jpg", ".jpeg", ".png", ".webp"];
  for (const ext of extensions) {
    const candidate = `${base}${ext}`;
    try {
      await fsp.access(candidate, fs.constants.R_OK);
      return candidate;
    } catch {
      // Continue.
    }
  }
  return null;
}

async function findSubtitleForFile(filePath) {
  const base = filePath.replace(/\.[^.]+$/, "");
  for (const ext of SUBTITLE_EXTS) {
    const candidate = `${base}${ext}`;
    try {
      await fsp.access(candidate, fs.constants.R_OK);
      return { path: candidate, format: ext.slice(1) };
    } catch {
      // Continue.
    }
  }
  return null;
}

async function findMetadataForFile(filePath) {
  const base = filePath.replace(/\.[^.]+$/, "");
  const candidates = [`${base}.json`, `${base}.meta.json`];
  for (const candidate of candidates) {
    try {
      const raw = await fsp.readFile(candidate, "utf8");
      const parsed = JSON.parse(raw);
      return {
        title: typeof parsed.title === "string" ? parsed.title.trim() : null,
        group: typeof parsed.group === "string" ? parsed.group.trim() : null,
        synopsis:
          typeof parsed.synopsis === "string" ? parsed.synopsis.trim() : null,
        year: normalizeYear(parsed.year),
        rating: normalizeRating(parsed.rating),
        tags: normalizeTags(parsed.tags || parsed.genres || parsed.genre)
      };
    } catch (err) {
      if (err.code === "ENOENT") {
        continue;
      }
      return null;
    }
  }
  return null;
}

function srtToVtt(srt) {
  const cleaned = srt.replace(/\r+/g, "");
  const converted = cleaned.replace(
    /(\d{2}:\d{2}:\d{2}),(\d{3})/g,
    "$1.$2"
  );
  return `WEBVTT\n\n${converted.trim()}\n`;
}

async function scanLocalMedia(localPath) {
  const items = [];
  try {
    await fsp.access(localPath, fs.constants.R_OK);
  } catch {
    return items;
  }
  await walkDir(localPath, localPath, items);
  return items;
}

function normalizeUrlItems(urls) {
  return urls
    .filter((item) => item && item.url)
    .map((item) => {
      const cleanUrl = String(item.url).split(/[?#]/)[0];
      const title = item.title || toTitle(path.basename(cleanUrl));
      return {
        id: toBase64Url(item.url),
        type: "url",
        title,
        group: item.group || "Streams",
        url: item.url,
        poster: item.poster || null,
        subtitle: item.subtitle || null,
        ext: path.extname(cleanUrl).toLowerCase() || "stream",
        tags: normalizeTags(item.tags || item.genres || item.genre),
        synopsis: typeof item.synopsis === "string" ? item.synopsis.trim() : null,
        year: normalizeYear(item.year),
        rating: normalizeRating(item.rating)
      };
    });
}

function decorateItems(items, state) {
  return items.map((item) => {
    const override = state.metadataOverrides
      ? state.metadataOverrides[item.id]
      : null;
    if (item.type === "local") {
      const { posterFile, hasSubtitle, ...rest } = item;
      const customPoster = state.posters[item.id];
      const base = {
        ...rest,
        ...(override || {}),
        poster: customPoster
          ? `/posters/${customPoster.file}`
          : posterFile
            ? `/poster/${item.id}`
            : item.poster || null,
        subtitle: hasSubtitle ? `/subtitle/${item.id}` : null
      };
      if (override && Array.isArray(override.tags)) {
        base.tags = override.tags;
      }
      return base;
    }
    const merged = {
      ...item,
      ...(override || {}),
      subtitle: item.subtitle || null
    };
    const customPoster = state.posters[item.id];
    if (customPoster) {
      merged.poster = `/posters/${customPoster.file}`;
    }
    if (override && Array.isArray(override.tags)) {
      merged.tags = override.tags;
    }
    return merged;
  });
}

async function refreshLibrary() {
  const config = await loadConfig();
  const localPath = resolveLocalPath(config.localPath);
  const localItems = await scanLocalMedia(localPath);
  const urlItems = normalizeUrlItems(config.urls);
  if (config.autoPosters) {
    for (const item of localItems) {
      if (!item.posterFile) {
        const autoPoster = await ensureLocalPoster(item, localPath);
        if (autoPoster) {
          item.poster = autoPoster;
        }
      }
    }
    for (const item of urlItems) {
      const autoPoster = await ensureUrlPoster(item);
      if (autoPoster) {
        item.poster = autoPoster;
      }
    }
  }
  const combined = [...localItems, ...urlItems].sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  libraryCache = {
    refreshedAt: new Date().toISOString(),
    localPath,
    items: combined,
    byId: new Map()
  };
  for (const item of combined) {
    libraryCache.byId.set(item.id, item);
  }
  return libraryCache;
}

const movieStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureLocalLibraryPath()
      .then(({ localPath }) => cb(null, localPath))
      .catch((err) => cb(err));
  },
  filename: (req, file, cb) => {
    cb(null, buildSafeFilename(file.originalname));
  }
});
const uploadMovie = multer({ storage: movieStorage });

function resolveLocalFile(id) {
  const relPath = fromBase64Url(id);
  const localRoot = path.resolve(libraryCache.localPath);
  const filePath = path.resolve(libraryCache.localPath, relPath);
  if (!filePath.startsWith(localRoot)) {
    return null;
  }
  return filePath;
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, POSTERS_DIR);
    },
    filename: (req, file, cb) => {
      const id = String(req.query.id || "");
      const ext = path.extname(file.originalname).toLowerCase();
      const safeExt = POSTER_EXTS.has(ext) ? ext : ".jpg";
      cb(null, `poster-${id}${safeExt}`);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (POSTER_EXTS.has(ext)) {
      cb(null, true);
      return;
    }
    cb(new Error("Unsupported poster type"));
  }
});

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(ROOT_DIR, "public")));
app.use("/posters", express.static(POSTERS_DIR));

app.get("/api/library", async (req, res) => {
  if (!libraryCache.refreshedAt) {
    await refreshLibrary();
  }
  const state = await getState();
  res.json({
    refreshedAt: libraryCache.refreshedAt,
    localPath: libraryCache.localPath,
    items: decorateItems(libraryCache.items, state)
  });
});

app.get("/api/state", async (req, res) => {
  const state = await getState();
  res.json({
    activeProfileId: state.activeProfileId,
    profiles: state.profiles,
    progress: state.progress,
    posters: state.posters,
    ratings: state.ratings,
    favorites: state.favorites,
    reactions: state.reactions,
    metadataOverrides: state.metadataOverrides
  });
});

app.post("/api/profile", async (req, res) => {
  const state = await getState();
  const name = String(req.body && req.body.name ? req.body.name : "").trim();
  if (!name) {
    res.status(400).json({ error: "Name required" });
    return;
  }
  const baseId = slugify(name) || "profile";
  let id = baseId;
  let count = 1;
  const ids = new Set(state.profiles.map((profile) => profile.id));
  while (ids.has(id)) {
    count += 1;
    id = `${baseId}-${count}`;
  }
  const color =
    sanitizeColor(req.body && req.body.color)
    || pickProfileColor(id || name);
  const avatar = sanitizeAvatar(req.body && req.body.avatar);
  const profile = normalizeProfile({ id, name, color, avatar });
  state.profiles.push(profile);
  state.activeProfileId = id;
  ensureProfile(state, id);
  await persistState(state);
  res.json({ profile, activeProfileId: id });
});

app.post("/api/profile/active", async (req, res) => {
  const state = await getState();
  const id = String(req.body && req.body.id ? req.body.id : "");
  const exists = state.profiles.some((profile) => profile.id === id);
  if (!exists) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  state.activeProfileId = id;
  ensureProfile(state, id);
  await persistState(state);
  res.json({ activeProfileId: id });
});

app.post("/api/profile/update", async (req, res) => {
  const state = await getState();
  const id = String(req.body && req.body.id ? req.body.id : "");
  const profile = state.profiles.find((entry) => entry.id === id);
  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  const name = String(req.body && req.body.name ? req.body.name : profile.name)
    .trim() || profile.name;
  const color =
    sanitizeColor(req.body && req.body.color)
    || profile.color
    || pickProfileColor(id || name);
  const avatarProvided = Object.prototype.hasOwnProperty.call(
    req.body || {},
    "avatar"
  );
  const avatar = avatarProvided ? sanitizeAvatar(req.body.avatar) : null;
  profile.name = name;
  profile.color = color;
  if (avatarProvided) {
    profile.avatar = avatar || "";
  }
  await persistState(state);
  res.json({ profile });
});

app.post("/api/profile/delete", async (req, res) => {
  const state = await getState();
  const id = String(req.body && req.body.id ? req.body.id : "");
  if (!id) {
    res.status(400).json({ error: "Profile id required" });
    return;
  }
  if (state.profiles.length <= 1) {
    res.status(400).json({ error: "At least one profile must remain" });
    return;
  }
  const index = state.profiles.findIndex((profile) => profile.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  state.profiles.splice(index, 1);
  delete state.progress[id];
  delete state.ratings[id];
  delete state.favorites[id];
  delete state.reactions[id];
  if (state.activeProfileId === id) {
    state.activeProfileId = state.profiles[0].id;
  }
  await persistState(state);
  res.json({ ok: true, activeProfileId: state.activeProfileId });
});

app.post("/api/progress", async (req, res) => {
  const state = await getState();
  const id = String(req.body && req.body.id ? req.body.id : "");
  const position = Number(req.body && req.body.position ? req.body.position : 0);
  const duration = Number(req.body && req.body.duration ? req.body.duration : 0);
  if (!id) {
    res.status(400).json({ error: "Missing media id" });
    return;
  }
  const profileId = String(
    req.body && req.body.profileId ? req.body.profileId : state.activeProfileId
  );
  ensureProfile(state, profileId);
  state.progress[profileId][id] = {
    id,
    position: Math.max(0, position),
    duration: Math.max(0, duration),
    lastPlayedAt: new Date().toISOString()
  };
  await persistState(state);
  res.json({ ok: true });
});

app.post("/api/rating", async (req, res) => {
  const state = await getState();
  const id = String(req.body && req.body.id ? req.body.id : "");
  if (!id) {
    res.status(400).json({ error: "Missing media id" });
    return;
  }
  const profileId = String(
    req.body && req.body.profileId ? req.body.profileId : state.activeProfileId
  );
  ensureProfile(state, profileId);
  const rating = normalizeRating(req.body && req.body.rating);
  if (!rating) {
    delete state.ratings[profileId][id];
  } else {
    state.ratings[profileId][id] = rating;
  }
  await persistState(state);
  res.json({ ok: true, rating });
});

app.post("/api/favorite", async (req, res) => {
  const state = await getState();
  const id = String(req.body && req.body.id ? req.body.id : "");
  if (!id) {
    res.status(400).json({ error: "Missing media id" });
    return;
  }
  const profileId = String(
    req.body && req.body.profileId ? req.body.profileId : state.activeProfileId
  );
  const favorite = Boolean(req.body && req.body.favorite);
  ensureProfile(state, profileId);
  if (!favorite) {
    delete state.favorites[profileId][id];
  } else {
    state.favorites[profileId][id] = true;
  }
  await persistState(state);
  res.json({ ok: true, favorite });
});

app.post("/api/reaction", async (req, res) => {
  const state = await getState();
  const id = String(req.body && req.body.id ? req.body.id : "");
  if (!id) {
    res.status(400).json({ error: "Missing media id" });
    return;
  }
  const profileId = String(
    req.body && req.body.profileId ? req.body.profileId : state.activeProfileId
  );
  ensureProfile(state, profileId);
  const raw = req.body && req.body.reaction;
  const reaction = Number(raw);
  if (!reaction || ![-1, 1].includes(reaction)) {
    delete state.reactions[profileId][id];
    await persistState(state);
    res.json({ ok: true, reaction: 0 });
    return;
  }
  state.reactions[profileId][id] = reaction;
  await persistState(state);
  res.json({ ok: true, reaction });
});

app.post("/api/metadata", async (req, res) => {
  if (!libraryCache.refreshedAt) {
    await refreshLibrary();
  }
  const id = String(req.body && req.body.id ? req.body.id : "");
  if (!id) {
    res.status(400).json({ error: "Missing media id" });
    return;
  }
  const item = libraryCache.byId.get(id);
  if (!item) {
    res.status(404).json({ error: "Media not found" });
    return;
  }
  const meta = sanitizeMetadata(req.body || {});
  if (item.type === "url") {
    const state = await getState();
    if (!hasMetadata(meta)) {
      delete state.metadataOverrides[id];
    } else {
      state.metadataOverrides[id] = meta;
    }
    await persistState(state);
    res.json({ ok: true, item: decorateItems([item], state)[0] });
    return;
  }
  const filePath = resolveLocalFile(id);
  if (!filePath) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const base = filePath.replace(/\.[^.]+$/, "");
  if (!hasMetadata(meta)) {
    const primary = `${base}.json`;
    const fallback = `${base}.meta.json`;
    if (await fileExists(primary)) {
      await fsp.unlink(primary);
    }
    if (await fileExists(fallback)) {
      await fsp.unlink(fallback);
    }
  } else {
    const writePath = await getMetadataWritePath(filePath);
    await fsp.writeFile(writePath, JSON.stringify(meta, null, 2), "utf8");
  }
  await refreshLibrary();
  const state = await getState();
  const updated = libraryCache.byId.get(id);
  res.json({
    ok: true,
    item: updated ? decorateItems([updated], state)[0] : null
  });
});

app.post("/api/metadata/bulk", async (req, res) => {
  try {
    if (!libraryCache.refreshedAt) {
      await refreshLibrary();
    }
    const ids = Array.isArray(req.body && req.body.ids) ? req.body.ids : [];
    if (!ids.length) {
      res.status(400).json({ error: "Missing ids" });
      return;
    }
    const clear = Boolean(req.body && req.body.clear);
    const tagMode = String(req.body && req.body.tagMode ? req.body.tagMode : "append");
    const meta = sanitizeMetadata(req.body && req.body.meta ? req.body.meta : {});
    const state = await getState();
    const localPath = libraryCache.localPath;

    for (const id of ids) {
      const item = libraryCache.byId.get(id);
      if (!item) {
        continue;
      }
      if (clear) {
        if (item.type === "local") {
          const filePath = path.join(localPath, item.path);
          const base = filePath.replace(/\.[^.]+$/, "");
          await safeUnlink(`${base}.json`);
          await safeUnlink(`${base}.meta.json`);
        }
        if (state.metadataOverrides && state.metadataOverrides[id]) {
          delete state.metadataOverrides[id];
        }
        continue;
      }

      const override = state.metadataOverrides
        ? state.metadataOverrides[id] || {}
        : {};
      const current = {
        title: override.title || item.title || "",
        group: override.group || item.group || "",
        year: override.year || item.year || null,
        rating:
          typeof override.rating === "number"
            ? override.rating
            : item.rating || null,
        synopsis: override.synopsis || item.synopsis || "",
        tags: Array.isArray(override.tags)
          ? override.tags
          : Array.isArray(item.tags)
            ? item.tags
            : []
      };
      const next = { ...current };
      if (meta.title) {
        next.title = meta.title;
      }
      if (meta.group) {
        next.group = meta.group;
      }
      if (meta.year) {
        next.year = meta.year;
      }
      if (meta.rating) {
        next.rating = meta.rating;
      }
      if (meta.synopsis) {
        next.synopsis = meta.synopsis;
      }
      if (meta.tags && meta.tags.length) {
        if (tagMode === "replace") {
          next.tags = meta.tags;
        } else {
          const merged = new Set([
            ...normalizeTags(current.tags),
            ...normalizeTags(meta.tags)
          ]);
          next.tags = Array.from(merged);
        }
      }
      if (item.type === "local") {
        const filePath = path.join(localPath, item.path);
        if (hasMetadata(next)) {
          const writePath = await getMetadataWritePath(filePath);
          await fsp.writeFile(writePath, JSON.stringify(next, null, 2), "utf8");
        } else {
          const base = filePath.replace(/\.[^.]+$/, "");
          await safeUnlink(`${base}.json`);
          await safeUnlink(`${base}.meta.json`);
        }
        if (state.metadataOverrides && state.metadataOverrides[id]) {
          delete state.metadataOverrides[id];
        }
      } else {
        state.metadataOverrides[id] = next;
      }
    }

    await persistState(state);
    await refreshLibrary();
    res.json({ ok: true });
  } catch (err) {
    console.error("Bulk metadata failed:", err.message);
    res.status(500).json({ error: "Bulk metadata failed" });
  }
});

app.post("/api/refresh", async (req, res) => {
  const data = await refreshLibrary();
  res.json({
    refreshedAt: data.refreshedAt,
    count: data.items.length
  });
});

app.delete("/api/media/:id", async (req, res) => {
  try {
    const id = String(req.params.id || "");
    if (!id) {
      res.status(400).json({ error: "Missing id" });
      return;
    }
    const removeFile = req.query.removeFile !== "false";
    const config = await loadConfig();
    const state = await getState();
    if (!libraryCache.refreshedAt) {
      await refreshLibrary();
    }
    const item = libraryCache.byId.get(id);
    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    if (item.type === "local") {
      await deleteLocalItem(item, libraryCache.localPath, state, removeFile);
    } else {
      await deleteUrlItem(item, config, state);
      await saveConfig(config);
    }
    await persistState(state);
    await refreshLibrary();
    res.json({ ok: true });
  } catch (err) {
    console.error("Delete media failed:", err.message);
    res.status(500).json({ error: "Delete media failed" });
  }
});

app.post("/api/media/bulk-delete", async (req, res) => {
  try {
    const ids = Array.isArray(req.body && req.body.ids) ? req.body.ids : [];
    if (!ids.length) {
      res.status(400).json({ error: "Missing ids" });
      return;
    }
    const config = await loadConfig();
    const state = await getState();
    if (!libraryCache.refreshedAt) {
      await refreshLibrary();
    }
    for (const id of ids) {
      const item = libraryCache.byId.get(id);
      if (!item) {
        continue;
      }
      if (item.type === "local") {
        await deleteLocalItem(item, libraryCache.localPath, state, true);
      } else {
        await deleteUrlItem(item, config, state);
      }
    }
    await saveConfig(config);
    await persistState(state);
    await refreshLibrary();
    res.json({ ok: true });
  } catch (err) {
    console.error("Bulk delete failed:", err.message);
    res.status(500).json({ error: "Bulk delete failed" });
  }
});

app.get("/api/tmdb/search", async (req, res) => {
  try {
    const query = String(req.query.query || "").trim();
    if (!query) {
      res.status(400).json({ error: "Missing query" });
      return;
    }
    const year = String(req.query.year || "").trim();
    const config = await loadConfig();
    const data = await tmdbRequest(config, "/search/movie", {
      query,
      year,
      include_adult: "false"
    });
    const results = (data.results || []).slice(0, 8).map((item) => ({
      id: item.id,
      title: item.title || item.original_title || "Untitled",
      year: item.release_date ? item.release_date.slice(0, 4) : "",
      rating: normalizeRating(item.vote_average),
      overview: item.overview || "",
      poster: buildTmdbImage(item.poster_path, "w342")
    }));
    res.json({ results });
  } catch (err) {
    if (err.code === "TMDB_KEY_MISSING") {
      res.status(400).json({ error: "TMDB API key not configured" });
      return;
    }
    console.error("TMDB search failed:", err.message);
    res.status(502).json({ error: "TMDB search failed" });
  }
});

app.get("/api/tmdb/details/:id", async (req, res) => {
  try {
    const id = String(req.params.id || "").trim();
    if (!id) {
      res.status(400).json({ error: "Missing TMDB id" });
      return;
    }
    const config = await loadConfig();
    const item = await tmdbRequest(config, `/movie/${id}`, {});
    res.json({
      id: item.id,
      title: item.title || item.original_title || "Untitled",
      year: item.release_date ? item.release_date.slice(0, 4) : "",
      rating: normalizeRating(item.vote_average),
      synopsis: item.overview || "",
      tags: Array.isArray(item.genres)
        ? item.genres.map((genre) => genre.name).filter(Boolean)
        : [],
      poster: buildTmdbImage(item.poster_path, "w500")
    });
  } catch (err) {
    if (err.code === "TMDB_KEY_MISSING") {
      res.status(400).json({ error: "TMDB API key not configured" });
      return;
    }
    console.error("TMDB details failed:", err.message);
    res.status(502).json({ error: "TMDB details failed" });
  }
});

app.post("/api/tmdb/enrich", async (req, res) => {
  try {
    const config = await loadConfig();
    const overwrite = Boolean(req.body && req.body.overwrite);
    const applyPosters =
      req.body && typeof req.body.applyPosters === "boolean"
        ? req.body.applyPosters
        : false;
    const limitRaw = Number(req.body && req.body.limit ? req.body.limit : 0);
    const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? limitRaw : null;

    const library = await refreshLibrary();
    const state = await getState();
    const localItems = library.items.filter((item) => item.type === "local");

    let processed = 0;
    let enriched = 0;
    let skipped = 0;
    let posters = 0;
    const errors = [];

    for (const item of localItems) {
      if (limit && processed >= limit) {
        break;
      }
      const override = state.metadataOverrides
        ? state.metadataOverrides[item.id] || {}
        : {};
      const currentTags = Array.isArray(override.tags)
        ? override.tags
        : Array.isArray(item.tags)
          ? item.tags
          : [];
      const currentYear = override.year || item.year || "";
      const currentRating =
        typeof override.rating === "number" ? override.rating : item.rating;
      const currentSynopsis = override.synopsis || item.synopsis || "";

      const needsMetadata =
        overwrite ||
        !currentYear ||
        !currentTags.length ||
        !currentRating ||
        !currentSynopsis;

      const hasCustomPoster = Boolean(state.posters && state.posters[item.id]);
      const hasLocalPoster = Boolean(item.posterFile);
      const needsPoster =
        applyPosters && (overwrite || (!hasCustomPoster && !hasLocalPoster));

      if (!needsMetadata && !needsPoster) {
        skipped += 1;
        continue;
      }

      processed += 1;
      const rawTitle = item.title || path.basename(item.path || "");
      const query = cleanTitleForSearch(rawTitle);
      if (!query) {
        skipped += 1;
        continue;
      }
      const year =
        currentYear ||
        extractYearFromText(rawTitle) ||
        extractYearFromText(item.path);
      try {
        const search = await tmdbRequest(config, "/search/movie", {
          query,
          year,
          include_adult: "false"
        });
        const results = Array.isArray(search.results) ? search.results : [];
        const match = pickBestTmdbResult(query, year, results);
        if (!match || !match.id) {
          skipped += 1;
          continue;
        }
        const details = await tmdbRequest(config, `/movie/${match.id}`, {});
        const nextOverride = { ...override };
        if (overwrite && details.title) {
          nextOverride.title = details.title;
        }
        if (overwrite || !currentYear) {
          nextOverride.year = normalizeYear(
            details.release_date ? details.release_date.slice(0, 4) : ""
          );
        }
        if (overwrite || !currentRating) {
          nextOverride.rating = normalizeRating(details.vote_average);
        }
        if (overwrite || !currentSynopsis) {
          nextOverride.synopsis = details.overview || "";
        }
        if (overwrite || !currentTags.length) {
          const tmdbTags = Array.isArray(details.genres)
            ? details.genres.map((genre) => genre.name).filter(Boolean)
            : [];
          nextOverride.tags = normalizeTags(tmdbTags);
        }
        state.metadataOverrides[item.id] = nextOverride;
        enriched += 1;

        if (needsPoster && details.poster_path) {
          const posterUrl = buildTmdbImage(details.poster_path, "w500");
          if (posterUrl) {
            const filename = await downloadPosterImage(
              posterUrl,
              `tmdb-${item.id}`,
              overwrite
            );
            if (filename) {
              state.posters[item.id] = {
                file: filename,
                updatedAt: new Date().toISOString()
              };
              posters += 1;
            }
          }
        }
      } catch (err) {
        errors.push({
          id: item.id,
          title: item.title,
          message: err.message || "TMDB lookup failed"
        });
      }
    }

    await persistState(state);
    res.json({
      ok: true,
      processed,
      enriched,
      skipped,
      posters,
      errors
    });
  } catch (err) {
    if (err.code === "TMDB_KEY_MISSING") {
      res.status(400).json({ error: "TMDB API key not configured" });
      return;
    }
    console.error("TMDB enrich failed:", err.message);
    res.status(500).json({ error: "TMDB enrich failed" });
  }
});

app.post("/api/media/url", async (req, res) => {
  try {
    const url = String(req.body && req.body.url ? req.body.url : "").trim();
    if (!url) {
      res.status(400).json({ error: "Missing URL" });
      return;
    }
    const config = await loadConfig();
    const exists = config.urls.some(
      (entry) => entry && entry.url && String(entry.url).trim() === url
    );
    if (exists) {
      res.status(409).json({ error: "URL already exists" });
      return;
    }
    const meta = sanitizeMetadata(req.body || {});
    const cleanUrl = url.split(/[?#]/)[0];
    const group = String(req.body.group || "").trim() || "Streams";
    const entry = {
      title: meta.title || req.body.title || toTitle(path.basename(cleanUrl)),
      url,
      group,
      poster: String(req.body.poster || "").trim() || null,
      subtitle: String(req.body.subtitle || "").trim() || null,
      year: meta.year,
      rating: meta.rating,
      tags: meta.tags,
      synopsis: meta.synopsis
    };
    config.urls.push(entry);
    await saveConfig(config);
    await refreshLibrary();
    res.json({ ok: true });
  } catch (err) {
    console.error("Failed to add URL media:", err.message);
    res.status(500).json({ error: "Failed to add URL" });
  }
});

app.post("/api/media/local", uploadMovie.single("movie"), async (req, res) => {
  try {
    const { localPath } = await ensureLocalLibraryPath();
    let filePath = req.file ? req.file.path : null;
    if (!filePath) {
      const sourcePath = String(
        req.body && req.body.sourcePath ? req.body.sourcePath : ""
      ).trim();
      if (!sourcePath) {
        res.status(400).json({ error: "Missing file or sourcePath" });
        return;
      }
      const ext = path.extname(sourcePath).toLowerCase();
      if (!VIDEO_EXTS.has(ext)) {
        res.status(400).json({ error: "Unsupported video type" });
        return;
      }
      const destFile = path.join(
        localPath,
        buildSafeFilename(path.basename(sourcePath))
      );
      await fsp.copyFile(sourcePath, destFile);
      filePath = destFile;
    }
    const ext = path.extname(filePath).toLowerCase();
    if (!VIDEO_EXTS.has(ext)) {
      res.status(400).json({ error: "Unsupported video type" });
      return;
    }
    const meta = sanitizeMetadata(req.body || {});
    if (hasMetadata(meta)) {
      const writePath = await getMetadataWritePath(filePath);
      await fsp.writeFile(writePath, JSON.stringify(meta, null, 2), "utf8");
    }
    await refreshLibrary();
    res.json({ ok: true });
  } catch (err) {
    console.error("Failed to add local media:", err.message);
    res.status(500).json({ error: "Failed to add local file" });
  }
});

app.post("/api/media/bulk", async (req, res) => {
  try {
    const items = Array.isArray(req.body && req.body.items)
      ? req.body.items
      : [];
    if (!items.length) {
      res.status(400).json({ error: "Missing items" });
      return;
    }
    const { config, localPath } = await ensureLocalLibraryPath();
    let updatedConfig = false;
    let added = 0;
    let skipped = 0;
    const errors = [];
    const localRoot = path.resolve(localPath);

    for (const entry of items) {
      const source = String(
        (entry && (entry.url || entry.path || entry.source)) || ""
      ).trim();
      if (!source) {
        skipped += 1;
        continue;
      }
      const isUrl = /^https?:\/\//i.test(source);
      if (isUrl || entry.type === "url") {
        const url = source;
        const exists = config.urls.some(
          (item) => item && item.url && String(item.url).trim() === url
        );
        if (exists) {
          skipped += 1;
          continue;
        }
        const cleanUrl = url.split(/[?#]/)[0];
        const meta = sanitizeMetadata(entry || {});
        const group = String(entry.group || "").trim() || "Streams";
        config.urls.push({
          title: meta.title || entry.title || toTitle(path.basename(cleanUrl)),
          url,
          group,
          poster: String(entry.poster || "").trim() || null,
          subtitle: String(entry.subtitle || "").trim() || null,
          year: meta.year,
          rating: meta.rating,
          tags: meta.tags,
          synopsis: meta.synopsis
        });
        updatedConfig = true;
        added += 1;
        continue;
      }

      const sourcePath = path.resolve(source);
      const ext = path.extname(sourcePath).toLowerCase();
      if (!VIDEO_EXTS.has(ext)) {
        skipped += 1;
        continue;
      }
      let targetPath = sourcePath;
      if (!isSubPath(sourcePath, localRoot)) {
        const destFile = path.join(
          localRoot,
          buildSafeFilename(path.basename(sourcePath))
        );
        await fsp.copyFile(sourcePath, destFile);
        targetPath = destFile;
      }
      const meta = sanitizeMetadata(entry || {});
      if (hasMetadata(meta)) {
        const writePath = await getMetadataWritePath(targetPath);
        await fsp.writeFile(writePath, JSON.stringify(meta, null, 2), "utf8");
      }
      added += 1;
    }

    if (updatedConfig) {
      await saveConfig(config);
    }
    await refreshLibrary();
    res.json({ ok: true, added, skipped, errors });
  } catch (err) {
    console.error("Bulk import failed:", err.message);
    res.status(500).json({ error: "Bulk import failed" });
  }
});

app.post("/api/poster", upload.single("poster"), async (req, res) => {
  if (!libraryCache.refreshedAt) {
    await refreshLibrary();
  }
  const id = String(req.query.id || "");
  if (!id || !libraryCache.byId.has(id)) {
    if (req.file) {
      try {
        await fsp.unlink(req.file.path);
      } catch {
        // Ignore.
      }
    }
    res.status(400).json({ error: "Invalid media id" });
    return;
  }
  if (!req.file) {
    res.status(400).json({ error: "Missing poster" });
    return;
  }
  const state = await getState();
  state.posters[id] = {
    file: req.file.filename,
    updatedAt: new Date().toISOString()
  };
  await persistState(state);
  res.json({ ok: true, poster: `/posters/${req.file.filename}` });
});

app.delete("/api/poster/:id", async (req, res) => {
  const id = String(req.params.id || "");
  const state = await getState();
  const existing = state.posters[id];
  if (!existing) {
    res.json({ ok: true });
    return;
  }
  const filePath = path.join(POSTERS_DIR, existing.file);
  try {
    await fsp.unlink(filePath);
  } catch {
    // Ignore.
  }
  delete state.posters[id];
  await persistState(state);
  res.json({ ok: true });
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/media/:id", async (req, res) => {
  if (!libraryCache.refreshedAt) {
    await refreshLibrary();
  }
  const id = req.params.id;
  const item = libraryCache.byId.get(id);
  if (!item || item.type !== "local") {
    res.status(404).send("Not found");
    return;
  }
  const filePath = resolveLocalFile(id);
  if (!filePath) {
    res.status(403).send("Forbidden");
    return;
  }
  let stat;
  try {
    stat = await fsp.stat(filePath);
  } catch {
    res.status(404).send("Not found");
    return;
  }
  const mimeType = mime.lookup(filePath) || "application/octet-stream";
  const range = req.headers.range;
  if (!range) {
    res.writeHead(200, {
      "Content-Length": stat.size,
      "Content-Type": mimeType,
      "Accept-Ranges": "bytes"
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  const match = /^bytes=(\d+)-(\d*)$/.exec(range);
  if (!match) {
    res.status(416).send("Invalid range");
    return;
  }
  const start = Number(match[1]);
  const end = match[2] ? Number(match[2]) : stat.size - 1;
  if (start >= stat.size || end >= stat.size || start > end) {
    res.status(416).send("Range not satisfiable");
    return;
  }
  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${stat.size}`,
    "Accept-Ranges": "bytes",
    "Content-Length": end - start + 1,
    "Content-Type": mimeType
  });
  fs.createReadStream(filePath, { start, end }).pipe(res);
});

app.get("/poster/:id", async (req, res) => {
  if (!libraryCache.refreshedAt) {
    await refreshLibrary();
  }
  const id = req.params.id;
  const item = libraryCache.byId.get(id);
  if (!item || item.type !== "local") {
    res.status(404).send("Not found");
    return;
  }
  const filePath = resolveLocalFile(id);
  if (!filePath) {
    res.status(403).send("Forbidden");
    return;
  }
  const posterPath = await findPosterForFile(filePath);
  if (!posterPath) {
    res.status(404).send("No poster");
    return;
  }
  res.sendFile(posterPath);
});

app.get("/subtitle/:id", async (req, res) => {
  if (!libraryCache.refreshedAt) {
    await refreshLibrary();
  }
  const id = req.params.id;
  const item = libraryCache.byId.get(id);
  if (!item || item.type !== "local") {
    res.status(404).send("Not found");
    return;
  }
  const filePath = resolveLocalFile(id);
  if (!filePath) {
    res.status(403).send("Forbidden");
    return;
  }
  const subtitle = await findSubtitleForFile(filePath);
  if (!subtitle) {
    res.status(404).send("No subtitles");
    return;
  }
  if (subtitle.format === "vtt") {
    res.type("text/vtt");
    res.sendFile(subtitle.path);
    return;
  }
  try {
    const raw = await fsp.readFile(subtitle.path, "utf8");
    const vtt = srtToVtt(raw);
    res.type("text/vtt");
    res.send(vtt);
  } catch {
    res.status(500).send("Subtitle error");
  }
});

app.use((err, req, res, next) => {
  if (!err) {
    next();
    return;
  }
  res.status(400).json({ error: err.message || "Request error" });
});

app.listen(PORT, HOST, () => {
  console.log(`Cinema running on http://${HOST}:${PORT}`);
});
