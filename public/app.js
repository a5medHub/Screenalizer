const state = {
  items: [],
  filtered: [],
  selected: null,
  localPath: null,
  refreshedAt: null,
  profiles: [],
  activeProfileId: null,
  progress: {},
  ratings: {},
  favorites: {},
  reactions: {},
  posters: {},
  itemsById: new Map(),
  autoplayEnabled: true
};

const ui = {
  searchInput: document.getElementById("searchInput"),
  searchBtn: document.getElementById("searchBtn"),
  searchSuggest: document.getElementById("searchSuggest"),
  refreshBtn: document.getElementById("refreshBtn"),
  profileToggle: document.getElementById("profileToggle"),
  profileAvatar: document.getElementById("profileAvatar"),
  profileDropdown: document.getElementById("profileDropdown"),
  profileList: document.getElementById("profileList"),
  profileManageBtn: document.getElementById("profileManageBtn"),
  profileAddBtn: document.getElementById("profileAddBtn"),
  profileDialog: document.getElementById("profileDialog"),
  addProfileDialog: document.getElementById("addProfileDialog"),
  profileEditList: document.getElementById("profileEditList"),
  profileAddName: document.getElementById("profileAddName"),
  profileAddColor: document.getElementById("profileAddColor"),
  profileAddConfirm: document.getElementById("profileAddConfirm"),
  profileDialogClose: document.getElementById("profileDialogClose"),
  addProfileClose: document.getElementById("addProfileClose"),
  profileSave: document.getElementById("profileSave"),
  profileAddAvatar: document.getElementById("profileAddAvatar"),
  profileAvatarGrid: document.getElementById("profileAvatarGrid"),
  mobileMenuToggle: document.getElementById("mobileMenuToggle"),
  mobileNav: document.getElementById("mobileNav"),
  mobileNavScrim: document.getElementById("mobileNavScrim"),
  mobileNavClose: document.getElementById("mobileNavClose"),
  mobileSearchInput: document.getElementById("mobileSearchInput"),
  mobileNavLinks: document.querySelectorAll(".mobile-nav-link[data-nav]"),
  mobileProfileAvatar: document.getElementById("mobileProfileAvatar"),
  mobileProfileName: document.getElementById("mobileProfileName"),
  mobileManageProfiles: document.getElementById("mobileManageProfiles"),
  mobileAddProfile: document.getElementById("mobileAddProfile"),
  filtersToggle: document.getElementById("filtersToggle"),
  filtersPanel: document.getElementById("filtersPanel"),
  typeFilter: document.getElementById("typeFilter"),
  groupFilter: document.getElementById("groupFilter"),
  extFilter: document.getElementById("extFilter"),
  sortFilter: document.getElementById("sortFilter"),
  hero: document.getElementById("hero"),
  heroTitle: document.getElementById("heroTitle"),
  heroMeta: document.getElementById("heroMeta"),
  heroRating: document.getElementById("heroRating"),
  heroTags: document.getElementById("heroTags"),
  heroSynopsis: document.getElementById("heroSynopsis"),
  heroCard: document.getElementById("heroCard"),
  playHero: document.getElementById("playHero"),
  detailsHero: document.getElementById("detailsHero"),
  heroFavorite: document.getElementById("heroFavorite"),
  heroLike: document.getElementById("heroLike"),
  heroDislike: document.getElementById("heroDislike"),
  uploadPosterBtn: document.getElementById("uploadPosterBtn"),
  playerShell: document.getElementById("playerShell"),
  player: document.getElementById("player"),
  loadingOverlay: document.getElementById("loadingOverlay"),
  loadingText: document.getElementById("loadingText"),
  centerPlay: document.getElementById("centerPlay"),
  progressBar: document.getElementById("progressBar"),
  prevBtn: document.getElementById("prevBtn"),
  playToggle: document.getElementById("playToggle"),
  stopBtn: document.getElementById("stopBtn"),
  nextBtn: document.getElementById("nextBtn"),
  skipBack: document.getElementById("skipBack"),
  skipForward: document.getElementById("skipForward"),
  timeDisplay: document.getElementById("timeDisplay"),
  muteBtn: document.getElementById("muteBtn"),
  volumeSlider: document.getElementById("volumeSlider"),
  speedSelect: document.getElementById("speedSelect"),
  subsToggle: document.getElementById("subsToggle"),
  pipBtn: document.getElementById("pipBtn"),
  autoplayToggle: document.getElementById("autoplayToggle"),
  controlsToggle: document.getElementById("controlsToggle"),
  settingsToggle: document.getElementById("settingsToggle"),
  advancedControls: document.getElementById("advancedControls"),
  qualityLabel: document.getElementById("qualityLabel"),
  qualitySelect: document.getElementById("qualitySelect"),
  theaterBtn: document.getElementById("theaterBtn"),
  fullscreenBtn: document.getElementById("fullscreenBtn"),
  playerStatus: document.getElementById("playerStatus"),
  networkStatus: document.getElementById("networkStatus"),
  bufferStatus: document.getElementById("bufferStatus"),
  seekPreview: document.getElementById("seekPreview"),
  seekPreviewImg: document.getElementById("seekPreviewImg"),
  seekPreviewTime: document.getElementById("seekPreviewTime"),
  upNextRow: document.getElementById("upNextRow"),
  upNextMeta: document.getElementById("upNextMeta"),
  shelfContainer: document.getElementById("shelfContainer"),
  libraryMeta: document.getElementById("libraryMeta"),
  configPath: document.getElementById("configPath"),
  refreshMeta: document.getElementById("refreshMeta"),
  detailsDialog: document.getElementById("detailsDialog"),
  dialogTitle: document.getElementById("dialogTitle"),
  dialogBody: document.getElementById("dialogBody"),
  ratingStars: document.getElementById("ratingStars"),
  metadataDrop: document.getElementById("metadataDrop"),
  metaTitle: document.getElementById("metaTitle"),
  metaYear: document.getElementById("metaYear"),
  metaRating: document.getElementById("metaRating"),
  metaTags: document.getElementById("metaTags"),
  metaSynopsis: document.getElementById("metaSynopsis"),
  saveMetaBtn: document.getElementById("saveMetaBtn"),
  clearMetaBtn: document.getElementById("clearMetaBtn"),
  dialogClose: document.getElementById("dialogClose"),
  clearPosterBtn: document.getElementById("clearPosterBtn"),
  posterInput: document.getElementById("posterInput"),
  utilityControls: document.querySelector(".utility-controls"),
  addMovieBtn: document.getElementById("addMovieBtn"),
  addDialog: document.getElementById("addDialog"),
  addForm: document.getElementById("addForm"),
  addSource: document.getElementById("addSource"),
  addFile: document.getElementById("addFile"),
  addPath: document.getElementById("addPath"),
  addUrl: document.getElementById("addUrl"),
  addPosterUrl: document.getElementById("addPosterUrl"),
  addSubtitleUrl: document.getElementById("addSubtitleUrl"),
  addTitle: document.getElementById("addTitle"),
  addGroup: document.getElementById("addGroup"),
  addTags: document.getElementById("addTags"),
  addYear: document.getElementById("addYear"),
  addRating: document.getElementById("addRating"),
  addSynopsis: document.getElementById("addSynopsis"),
  addStatus: document.getElementById("addStatus"),
  addStepIndicator: document.getElementById("addStepIndicator"),
  addStepTitle: document.getElementById("addStepTitle"),
  addBack: document.getElementById("addBack"),
  addNext: document.getElementById("addNext"),
  addAllowDuplicate: document.getElementById("addAllowDuplicate"),
  addValidation: document.getElementById("addValidation"),
  tmdbLookupBtn: document.getElementById("tmdbLookupBtn"),
  tmdbStatus: document.getElementById("tmdbStatus"),
  tmdbResults: document.getElementById("tmdbResults"),
  addCancel: document.getElementById("addCancel"),
  localFields: document.getElementById("localFields"),
  urlFields: document.getElementById("urlFields"),
  bulkImportBtn: document.getElementById("bulkImportBtn"),
  bulkDialog: document.getElementById("bulkDialog"),
  bulkMode: document.getElementById("bulkMode"),
  bulkInput: document.getElementById("bulkInput"),
  bulkSubmit: document.getElementById("bulkSubmit"),
  bulkCancel: document.getElementById("bulkCancel"),
  bulkStatus: document.getElementById("bulkStatus"),
  enrichTmdbBtn: document.getElementById("enrichTmdbBtn"),
  enrichDialog: document.getElementById("enrichDialog"),
  enrichLimit: document.getElementById("enrichLimit"),
  enrichOverwrite: document.getElementById("enrichOverwrite"),
  enrichPosters: document.getElementById("enrichPosters"),
  enrichStatus: document.getElementById("enrichStatus"),
  enrichRun: document.getElementById("enrichRun"),
  enrichCancel: document.getElementById("enrichCancel"),
  navLinks: document.querySelectorAll(".nav-link[data-nav]")
};

const AVATAR_PRESETS = [
  {
    id: "nebula",
    label: "Nebula",
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0f172a"/><circle cx="20" cy="22" r="10" fill="#38bdf8"/><circle cx="42" cy="40" r="16" fill="#a78bfa"/><circle cx="36" cy="18" r="6" fill="#f472b6"/></svg>'
  },
  {
    id: "ember",
    label: "Ember",
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#1f0a0a"/><path d="M32 10c7 8 14 14 14 22a14 14 0 1 1-28 0c0-8 7-14 14-22z" fill="#fb923c"/><circle cx="32" cy="36" r="9" fill="#facc15"/></svg>'
  },
  {
    id: "mint",
    label: "Mint",
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#052e2b"/><path d="M18 42c10-14 20-18 28-20-4 10-8 20-20 28-4 3-10-2-8-8z" fill="#4ade80"/><circle cx="44" cy="20" r="6" fill="#34d399"/></svg>'
  },
  {
    id: "cobalt",
    label: "Cobalt",
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0b1120"/><rect x="14" y="16" width="36" height="32" rx="10" fill="#60a5fa"/><path d="M22 44c6-6 14-10 24-10" fill="none" stroke="#1e3a8a" stroke-width="4" stroke-linecap="round"/></svg>'
  },
  {
    id: "orchid",
    label: "Orchid",
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#1b1029"/><circle cx="32" cy="32" r="18" fill="#c084fc"/><circle cx="32" cy="32" r="8" fill="#f5d0fe"/></svg>'
  },
  {
    id: "sand",
    label: "Sand",
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#2b2014"/><path d="M12 40c8-10 20-16 40-18-4 12-12 24-28 28-6 2-12-2-12-10z" fill="#fbbf24"/><circle cx="46" cy="20" r="6" fill="#f97316"/></svg>'
  },
  {
    id: "glacier",
    label: "Glacier",
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0b1c2c"/><path d="M12 42l12-18 10 12 8-10 10 16z" fill="#38bdf8"/><path d="M22 46h24" stroke="#bae6fd" stroke-width="4" stroke-linecap="round"/></svg>'
  },
  {
    id: "rose",
    label: "Rose",
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#2a0b16"/><circle cx="24" cy="24" r="10" fill="#f472b6"/><circle cx="40" cy="40" r="14" fill="#fb7185"/><circle cx="44" cy="20" r="6" fill="#f9a8d4"/></svg>'
  }
];

const avatarUrlMap = new Map(
  AVATAR_PRESETS.map((preset) => [
    preset.id,
    `data:image/svg+xml;utf8,${encodeURIComponent(preset.svg)}`
  ])
);

const ICONS = {
  play: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <polygon points="8,5 19,12 8,19" fill="currentColor"></polygon>
  </svg>`,
  pause: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="6" y="5" width="4" height="14" fill="currentColor"></rect>
    <rect x="14" y="5" width="4" height="14" fill="currentColor"></rect>
  </svg>`,
  stop: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="7" y="7" width="10" height="10" fill="currentColor"></rect>
  </svg>`,
  prev: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 6h2v12H6zM9.5 12L18 18V6z" fill="currentColor"></path>
  </svg>`,
  next: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 6v12l8.5-6L6 6zm9 0h2v12h-2z" fill="currentColor"></path>
  </svg>`,
  back: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M18 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>`,
  forward: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M6 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>`,
  volume: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"></path>
    <path d="M16 8c1.5 1.3 1.5 6.7 0 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
    <path d="M18 6c2.5 2.3 2.5 9.7 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
  </svg>`,
  volumeLow: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"></path>
    <path d="M16 10c1 0.8 1 3.2 0 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
  </svg>`,
  volumeMed: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"></path>
    <path d="M16 9c1.3 1 1.3 4 0 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
    <path d="M18 8c1.6 1.3 1.6 5.4 0 6.7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
  </svg>`,
  volumeHigh: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"></path>
    <path d="M16 8c1.5 1.3 1.5 6.7 0 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
    <path d="M18 6c2.5 2.3 2.5 9.7 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
  </svg>`,
  mute: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"></path>
    <path d="M16 9l4 4M20 9l-4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
  </svg>`,
  settings: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 7h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
    <circle cx="9" cy="7" r="2" fill="currentColor"></circle>
    <path d="M4 12h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
    <circle cx="15" cy="12" r="2" fill="currentColor"></circle>
    <path d="M4 17h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
    <circle cx="7" cy="17" r="2" fill="currentColor"></circle>
  </svg>`,
  subs: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="6" width="18" height="12" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"></rect>
    <path d="M7 10h4M7 14h6M13 10h4M13 14h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
  </svg>`,
  subsOff: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="6" width="18" height="12" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"></rect>
    <path d="M6 8l12 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
  </svg>`,
  pip: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"></rect>
    <rect x="12" y="11" width="7" height="5" fill="currentColor"></rect>
  </svg>`,
  autoplay: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 8a7 7 0 0 1 11 1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
    <path d="M18 5v4h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
    <path d="M18 16a7 7 0 0 1-11-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
    <path d="M6 19v-4h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
  </svg>`,
  theater: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="6" width="18" height="12" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"></rect>
    <path d="M3 16h18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
  </svg>`,
  fullscreen: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 3H3v4M17 3h4v4M3 17v4h4M21 17v4h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
  </svg>`,
  exitFullscreen: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 3H3v6M15 3h6v6M3 15v6h6M21 15v6h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
  </svg>`,
  shuffle: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 7h4l4 5-4 5H3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M13 7h4l4 5-4 5h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M9 7l6 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
  </svg>`,
  heart: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 20s-6.5-4.3-8.5-7.4C1.6 9.8 3 6.2 6.5 6c1.6 0 3.1 0.7 4.1 1.9C11.6 6.7 13.1 6 14.7 6c3.5 0.2 4.9 3.8 3 6.6C18.5 15.7 12 20 12 20z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></path>
  </svg>`,
  heartFilled: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 20s-6.5-4.3-8.5-7.4C1.6 9.8 3 6.2 6.5 6c1.6 0 3.1 0.7 4.1 1.9C11.6 6.7 13.1 6 14.7 6c3.5 0.2 4.9 3.8 3 6.6C18.5 15.7 12 20 12 20z" fill="currentColor"></path>
  </svg>`,
  like: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 11v8H4v-8h3zm4-6l-1 4h7a2 2 0 0 1 2 2l-1 6a2 2 0 0 1-2 2H9V9l2-4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></path>
  </svg>`,
  likeFilled: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 11v8H4v-8h3zm4-6l-1 4h7a2 2 0 0 1 2 2l-1 6a2 2 0 0 1-2 2H9V9l2-4z" fill="currentColor"></path>
  </svg>`,
  dislike: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 13V5H4v8h3zm4 6l-1-4h7a2 2 0 0 0 2-2l-1-6a2 2 0 0 0-2-2H9v8l2 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></path>
  </svg>`,
  dislikeFilled: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 13V5H4v8h3zm4 6l-1-4h7a2 2 0 0 0 2-2l-1-6a2 2 0 0 0-2-2H9v8l2 4z" fill="currentColor"></path>
  </svg>`
};

const thumbnailCache = new Map();
let thumbnailToken = 0;
let lastProgressSentAt = 0;
let subtitlesEnabled = true;
let renderTimer = null;
let lastUiUpdate = 0;
const UI_UPDATE_INTERVAL = 200;
const HLS_MIME = "application/vnd.apple.mpegurl";
let hlsInstance = null;
let hasAutoPicked = false;
let scrollHandle = null;
let controlsHideTimer = null;
let scrollPlayerHandle = null;
let playbackStatus = "";
let loadingState = "";
let suggestedSeed = Date.now();
const STORAGE_SELECTED_KEY = "cinema.selectedId";
let volumeOpen = false;
let tmdbRequestToken = 0;
let addStep = 1;
const STORAGE_TRENDING_KEY = "cinema.trendingWindow";
let trendingWindow = localStorage.getItem(STORAGE_TRENDING_KEY) || "week";
if (trendingWindow !== "day" && trendingWindow !== "week") {
  trendingWindow = "week";
}
let searchSuggestIndex = -1;
let navFilter = "home";
const TITLE_DROP_TOKENS = new Set([
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
  "directors",
  "cut",
  "rip",
  "cam",
  "ts",
  "tc",
  "dubbed",
  "subbed",
  "multi",
  "dual",
  "hd",
  "sd"
]);
const TAG_SKIP_TOKENS = new Set([
  "movies",
  "movie",
  "videos",
  "video",
  "media",
  "library",
  "streams",
  "stream"
]);

function normalize(text) {
  return String(text || "").toLowerCase();
}

function tokenize(text) {
  return normalize(text).split(/\s+/).filter(Boolean);
}

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatSize(bytes) {
  if (!bytes) {
    return "Unknown size";
  }
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let idx = 0;
  while (size > 1024 && idx < units.length - 1) {
    size /= 1024;
    idx += 1;
  }
  return `${size.toFixed(idx === 0 ? 0 : 1)} ${units[idx]}`;
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "0:00";
  }
  const total = Math.floor(seconds);
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const pad = (value) => String(value).padStart(2, "0");
  return hrs > 0 ? `${hrs}:${pad(mins)}:${pad(secs)}` : `${mins}:${pad(secs)}`;
}

function formatRelativeTime(iso) {
  if (!iso) {
    return "never";
  }
  const diff = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(diff) || diff < 0) {
    return iso;
  }
  if (diff < 60000) {
    return "just now";
  }
  if (diff < 3600000) {
    return `${Math.round(diff / 60000)}m ago`;
  }
  if (diff < 86400000) {
    return `${Math.round(diff / 3600000)}h ago`;
  }
  return `${Math.round(diff / 86400000)}d ago`;
}

function getProgressFor(item) {
  const profileId = state.activeProfileId;
  if (!profileId) {
    return null;
  }
  return state.progress[profileId] && state.progress[profileId][item.id]
    ? state.progress[profileId][item.id]
    : null;
}

function getRatingFor(item) {
  const profileId = state.activeProfileId;
  if (profileId && state.ratings[profileId] && state.ratings[profileId][item.id]) {
    return state.ratings[profileId][item.id];
  }
  if (Number.isFinite(item.rating)) {
    return item.rating;
  }
  return null;
}

function getFavoritesForProfile() {
  const profileId = state.activeProfileId;
  if (!profileId) {
    return {};
  }
  return state.favorites[profileId] || {};
}

function getReactionsForProfile() {
  const profileId = state.activeProfileId;
  if (!profileId) {
    return {};
  }
  return state.reactions[profileId] || {};
}

function getReaction(item) {
  if (!item) {
    return 0;
  }
  const reactions = getReactionsForProfile();
  return reactions[item.id] || 0;
}

function isFavorite(item) {
  if (!item) {
    return false;
  }
  const favorites = getFavoritesForProfile();
  return Boolean(favorites[item.id]);
}

function updateFavoriteButton(button, item) {
  if (!button || !item) {
    return;
  }
  const active = isFavorite(item);
  setButtonIcon(
    button,
    active ? "heartFilled" : "heart",
    active ? "Remove from My List" : "Add to My List"
  );
  button.classList.toggle("active", active);
}

function updateReactionButtons(likeBtn, dislikeBtn, item) {
  if (!item) {
    return;
  }
  const reaction = getReaction(item);
  if (likeBtn) {
    setButtonIcon(
      likeBtn,
      reaction === 1 ? "likeFilled" : "like",
      reaction === 1 ? "Liked" : "Like"
    );
    likeBtn.classList.toggle("active", reaction === 1);
    likeBtn.classList.toggle("like", true);
  }
  if (dislikeBtn) {
    setButtonIcon(
      dislikeBtn,
      reaction === -1 ? "dislikeFilled" : "dislike",
      reaction === -1 ? "Disliked" : "Dislike"
    );
    dislikeBtn.classList.toggle("active", reaction === -1);
    dislikeBtn.classList.toggle("dislike", true);
  }
}

function formatRating(value) {
  if (!Number.isFinite(value)) {
    return "NR";
  }
  return `${value.toFixed(1)}/5`;
}

function getTags(item) {
  const tags = Array.isArray(item.tags) ? item.tags : [];
  const group = item.group ? [item.group] : [];
  const merged = [...tags, ...group].filter(Boolean);
  const deduped = [];
  const seen = new Set();
  merged.forEach((tag) => {
    const key = normalize(tag);
    if (!key || seen.has(key)) {
      return;
    }
    seen.add(key);
    deduped.push(tag);
  });
  return deduped;
}

function progressRatio(progress) {
  if (!progress || !progress.duration) {
    return 0;
  }
  return Math.min(1, Math.max(0, progress.position / progress.duration));
}

function isContinueWatching(progress) {
  if (!progress || !progress.duration) {
    return false;
  }
  const ratio = progressRatio(progress);
  return progress.position > 20 && ratio > 0.02 && ratio < 0.95;
}

function getMediaSrc(item) {
  return item.type === "local" ? `/media/${encodeURIComponent(item.id)}` : item.url;
}

function pickRandomItem(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }
  const index = Math.floor(Math.random() * items.length);
  return items[index] || null;
}

function seededShuffle(items, seed) {
  if (!Array.isArray(items)) {
    return [];
  }
  let value = seed || 1;
  const next = () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function shuffleSuggested() {
  suggestedSeed = Date.now();
  scheduleRender();
}

function scrollToSelectedCard(itemId) {
  if (!itemId) {
    return;
  }
  const selector = `.card[data-id="${itemId}"]`;
  const target =
    document.querySelector(`#shelfContainer ${selector}`) ||
    document.querySelector(selector);
  if (!target) {
    return;
  }
  target.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
}

function queueScrollToSelected(itemId) {
  if (scrollHandle) {
    cancelAnimationFrame(scrollHandle);
  }
  scrollHandle = requestAnimationFrame(() => {
    scrollHandle = null;
    scrollToSelectedCard(itemId);
  });
}

function scrollToPlayerSection() {
  const section = ui.playerShell ? ui.playerShell.closest(".player") : null;
  if (!section) {
    return;
  }
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

function queueScrollToPlayer() {
  if (scrollPlayerHandle) {
    cancelAnimationFrame(scrollPlayerHandle);
  }
  scrollPlayerHandle = requestAnimationFrame(() => {
    scrollPlayerHandle = null;
    scrollToPlayerSection();
  });
}

function setButtonIcon(button, iconName, label) {
  if (!button) {
    return;
  }
  const icon = ICONS[iconName];
  button.innerHTML = "";
  if (icon) {
    button.insertAdjacentHTML("beforeend", icon);
  }
  const sr = document.createElement("span");
  sr.className = "sr-only";
  sr.textContent = label || "";
  button.appendChild(sr);
  if (label) {
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
  }
}

function initControlIcons() {
  setButtonIcon(ui.prevBtn, "prev", "Previous title");
  setButtonIcon(ui.nextBtn, "next", "Next title");
  setButtonIcon(ui.stopBtn, "stop", "Stop");
  setButtonIcon(ui.skipBack, "back", "Back 10 seconds");
  setButtonIcon(ui.skipForward, "forward", "Forward 30 seconds");
  setButtonIcon(ui.controlsToggle, "settings", "Settings");
  setButtonIcon(ui.settingsToggle, "settings", "Settings");
  setButtonIcon(ui.pipBtn, "pip", "Picture in Picture");
  setButtonIcon(ui.theaterBtn, "theater", "Theater mode");
  updateFullscreenUi();
  updatePlayState();
  setMuted(ui.player.muted);
  updateAutoplayUi();
  updateSubtitlesUi();
  updateVolumeIcon();
}

function isHlsItem(item) {
  if (!item || item.type !== "url" || !item.url) {
    return false;
  }
  return /\.m3u8($|\\?)/i.test(item.url);
}

function canPlayHlsNatively() {
  return ui.player.canPlayType(HLS_MIME) !== "";
}

function setQualityVisible(visible) {
  if (!ui.qualityLabel || !ui.qualitySelect) {
    return;
  }
  ui.qualityLabel.style.display = visible ? "flex" : "none";
  ui.qualitySelect.disabled = !visible;
}

function resetQualityOptions() {
  if (!ui.qualitySelect) {
    return;
  }
  ui.qualitySelect.innerHTML = "";
  const option = document.createElement("option");
  option.value = "auto";
  option.textContent = "Auto";
  ui.qualitySelect.appendChild(option);
  ui.qualitySelect.value = "auto";
}

function buildQualityOptions(levels) {
  resetQualityOptions();
  if (!ui.qualitySelect || !Array.isArray(levels) || levels.length === 0) {
    return;
  }
  const byHeight = new Map();
  levels.forEach((level, index) => {
    if (!level || !level.height) {
      return;
    }
    const current = byHeight.get(level.height);
    if (!current || (level.bitrate || 0) > current.bitrate) {
      byHeight.set(level.height, {
        index,
        height: level.height,
        bitrate: level.bitrate || 0
      });
    }
  });
  const sorted = Array.from(byHeight.values()).sort(
    (a, b) => a.height - b.height
  );
  sorted.forEach((entry) => {
    const option = document.createElement("option");
    option.value = String(entry.index);
    option.textContent = `${entry.height}p`;
    ui.qualitySelect.appendChild(option);
  });
  ui.qualitySelect.value = "auto";
}

function destroyHls() {
  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }
}

function attachHlsSource(item, src) {
  destroyHls();
  resetQualityOptions();
  setQualityVisible(false);

  if (!isHlsItem(item)) {
    ui.player.src = src;
    return;
  }

  if (canPlayHlsNatively()) {
    ui.player.src = src;
    return;
  }

  if (!window.Hls || !Hls.isSupported()) {
    ui.player.src = src;
    return;
  }

  ui.player.removeAttribute("src");
  ui.player.load();
  hlsInstance = new Hls({
    capLevelToPlayerSize: true,
    maxBufferLength: 30
  });
  hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
    buildQualityOptions(hlsInstance.levels);
    setQualityVisible(true);
  });
  hlsInstance.on(Hls.Events.ERROR, (_, data) => {
    if (!data || !data.fatal) {
      return;
    }
    if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
      hlsInstance.startLoad();
      return;
    }
    if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
      hlsInstance.recoverMediaError();
      return;
    }
    destroyHls();
  });
  hlsInstance.loadSource(src);
  hlsInstance.attachMedia(ui.player);
}

function buildIndex(items) {
  const map = new Map();
  items.forEach((item) => {
    const groupKey = item.group || "Library";
    const extKey = item.ext || "stream";
    const searchText = normalize(
      `${item.title} ${groupKey} ${item.path || ""} ${item.ext || ""} ${
        (item.tags || []).join(" ")
      }`
    );
    item._groupKey = groupKey;
    item._extKey = extKey;
    item._searchText = searchText;
    item._titleLower = normalize(item.title);
    item._updatedAt = item.updatedAt ? new Date(item.updatedAt).getTime() : 0;
    map.set(item.id, item);
  });
  state.itemsById = map;
}

function applyFilters() {
  const queryTokens = tokenize(ui.searchInput.value);
  const typeFilter = ui.typeFilter.value;
  const groupFilter = ui.groupFilter.value;
  const extFilter = ui.extFilter.value;

  state.filtered = state.items.filter((item) => {
    if (typeFilter !== "all" && item.type !== typeFilter) {
      return false;
    }
    if (groupFilter !== "all" && item._groupKey !== groupFilter) {
      return false;
    }
    if (extFilter !== "all" && item._extKey !== extFilter) {
      return false;
    }
    if (queryTokens.length === 0) {
      return true;
    }
    const haystack = item._searchText || "";
    return queryTokens.every((token) => haystack.includes(token));
  });

  if (navFilter && navFilter !== "home") {
    const now = Date.now();
    const favorites = getFavoritesForProfile();
    state.filtered = state.filtered.filter((item) => {
      const tags = getTags(item).map((tag) => normalize(tag));
      const group = normalize(item.group || "");
      if (navFilter === "series") {
        return (
          group.includes("series") ||
          tags.includes("series") ||
          tags.includes("tv") ||
          tags.includes("show")
        );
      }
      if (navFilter === "movies") {
        if (group.includes("movies") || tags.includes("movie") || tags.includes("film")) {
          return true;
        }
        return !(
          group.includes("series") ||
          tags.includes("series") ||
          tags.includes("tv") ||
          tags.includes("show")
        );
      }
      if (navFilter === "new") {
        if (!item.updatedAt) {
          return false;
        }
        const days = (now - new Date(item.updatedAt).getTime()) / 86400000;
        return days <= 30;
      }
      if (navFilter === "mylist") {
        return Boolean(favorites[item.id]);
      }
      return true;
    });
  }
}

function setNavFilter(value) {
  navFilter = value || "home";
  if (ui.navLinks && ui.navLinks.length) {
    ui.navLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.nav === navFilter);
    });
  }
  if (ui.mobileNavLinks && ui.mobileNavLinks.length) {
    ui.mobileNavLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.nav === navFilter);
    });
  }
  scheduleRender();
}

function sortItems(items) {
  const sort = ui.sortFilter.value;
  if (sort === "recent") {
    return [...items].sort((a, b) => (b._updatedAt || 0) - (a._updatedAt || 0));
  }
  if (sort === "played") {
    return [...items].sort((a, b) => {
      const pa = getProgressFor(a);
      const pb = getProgressFor(b);
      const da = pa && pa.lastPlayedAt ? new Date(pa.lastPlayedAt) : 0;
      const db = pb && pb.lastPlayedAt ? new Date(pb.lastPlayedAt) : 0;
      return db - da;
    });
  }
  if (sort === "rating") {
    return [...items].sort((a, b) => {
      const ra = getRatingFor(a) || 0;
      const rb = getRatingFor(b) || 0;
      return rb - ra;
    });
  }
  return [...items].sort((a, b) =>
    (a._titleLower || "").localeCompare(b._titleLower || "")
  );
}

function groupItems(items) {
  const groups = new Map();
  for (const item of items) {
    const key = item.group || "Library";
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(item);
  }
  return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]));
}

function setHero(item) {
  if (!item) {
    ui.heroTitle.textContent = "Load your library";
    ui.heroMeta.textContent = "Point to a folder or add stream URLs.";
    ui.heroRating.textContent = "Rating: --";
    ui.heroTags.innerHTML = "";
    ui.heroTags.style.display = "none";
    ui.heroSynopsis.textContent = "";
    ui.heroSynopsis.style.display = "none";
    if (ui.hero) {
      ui.hero.style.setProperty("--hero-image", "none");
    }
    ui.heroCard.style.backgroundImage = "";
    ui.heroCard.innerHTML = `
      <div class="hero-card-glow"></div>
      <div class="hero-card-title">Awaiting reels</div>
      <div class="hero-card-sub">Add movies to get started.</div>
    `;
    ui.playHero.disabled = true;
    ui.detailsHero.disabled = true;
    ui.uploadPosterBtn.disabled = true;
    if (ui.heroFavorite) {
      ui.heroFavorite.disabled = true;
      ui.heroFavorite.innerHTML = "";
    }
    if (ui.heroLike) {
      ui.heroLike.disabled = true;
      ui.heroLike.innerHTML = "";
    }
    if (ui.heroDislike) {
      ui.heroDislike.disabled = true;
      ui.heroDislike.innerHTML = "";
    }
    return;
  }
  ui.playHero.disabled = false;
  ui.detailsHero.disabled = false;
  ui.uploadPosterBtn.disabled = false;
  if (ui.heroFavorite) {
    ui.heroFavorite.disabled = false;
  }
  if (ui.heroLike) {
    ui.heroLike.disabled = false;
  }
  if (ui.heroDislike) {
    ui.heroDislike.disabled = false;
  }
  const progress = getProgressFor(item);
  const progressLine = progress
    ? `Progress: ${formatDuration(progress.position)} / ${formatDuration(
        progress.duration
      )}`
    : "Progress: none yet";
  const rating = getRatingFor(item);
  const metaParts = [item.group || "Library", item.year, item.type].filter(
    (value) => value
  );
  ui.heroTitle.textContent = item.title;
  ui.heroMeta.textContent = metaParts.join(" - ");
  ui.heroRating.textContent = `Rating: ${formatRating(rating)}`;
  ui.heroSynopsis.textContent = item.synopsis || "";
  ui.heroSynopsis.style.display = item.synopsis ? "block" : "none";
  if (ui.hero) {
    ui.hero.style.setProperty(
      "--hero-image",
      item.poster ? `url(${item.poster})` : "none"
    );
  }
  ui.heroCard.style.backgroundImage = item.poster ? `url(${item.poster})` : "";
  ui.heroTags.innerHTML = "";
  const tags = getTags(item).slice(0, 6);
  ui.heroTags.style.display = tags.length ? "flex" : "none";
  tags.forEach((tag) => {
    const pill = document.createElement("span");
    pill.className = "tag";
    pill.textContent = tag;
    ui.heroTags.appendChild(pill);
  });
  ui.heroCard.innerHTML = `
    <div class="hero-card-glow"></div>
    <div class="hero-card-title">${escapeHtml(item.title)}</div>
    <div class="hero-card-sub">${escapeHtml(item.group || "Library")}</div>
    <div class="hero-card-sub">${escapeHtml(progressLine)}</div>
  `;
  updateFavoriteButton(ui.heroFavorite, item);
  updateReactionButtons(ui.heroLike, ui.heroDislike, item);
}

function clearTracks() {
  const tracks = Array.from(ui.player.querySelectorAll("track"));
  tracks.forEach((track) => track.remove());
}

function updateTimeDisplay() {
  const current = ui.player.currentTime || 0;
  const duration = ui.player.duration || 0;
  ui.timeDisplay.textContent = `${formatDuration(current)} / ${formatDuration(
    duration
  )}`;
  ui.progressBar.max = duration || 0;
  ui.progressBar.value = current || 0;
  const ratio = duration ? Math.min(1, Math.max(0, current / duration)) : 0;
  ui.progressBar.style.setProperty("--progress", `${ratio * 100}%`);
}

function updateBufferStatus() {
  if (!ui.bufferStatus || !state.selected) {
    return;
  }
  const duration = ui.player.duration;
  if (!Number.isFinite(duration) || duration <= 0) {
    ui.bufferStatus.textContent = "Buffer: --";
    return;
  }
  const buffered = ui.player.buffered;
  const current = ui.player.currentTime || 0;
  let ahead = 0;
  for (let i = 0; i < buffered.length; i += 1) {
    const start = buffered.start(i);
    const end = buffered.end(i);
    if (current >= start && current <= end) {
      ahead = Math.max(0, end - current);
      break;
    }
  }
  ui.bufferStatus.textContent = `Buffer: ${formatDuration(ahead)} ahead`;
}

function setPlaybackStatus(status) {
  playbackStatus = status || "";
  if (!state.selected) {
    ui.playerStatus.textContent = "Pick a title to watch.";
    return;
  }
  const base = `Now playing: ${state.selected.title}`;
  ui.playerStatus.textContent = playbackStatus
    ? `${base} - ${playbackStatus}`
    : base;
}

function showLoadingState(message) {
  if (!ui.loadingOverlay || !ui.loadingText) {
    return;
  }
  loadingState = message || "Loading...";
  ui.loadingText.textContent = loadingState;
  ui.loadingOverlay.classList.add("visible");
  setPlaybackStatus(loadingState);
}

function clearLoadingState() {
  loadingState = "";
  if (ui.loadingOverlay) {
    ui.loadingOverlay.classList.remove("visible");
  }
  if (!ui.player.paused) {
    setPlaybackStatus("");
  }
}

function updateNetworkStatus(item) {
  if (!ui.networkStatus) {
    return;
  }
  const setStatus = (text, level) => {
    ui.networkStatus.textContent = text;
    ui.networkStatus.classList.remove(
      "status-good",
      "status-warn",
      "status-bad",
      "status-local"
    );
    if (level) {
      ui.networkStatus.classList.add(level);
    }
  };
  if (item && item.type === "local") {
    setStatus("Network: local file", "status-local");
    return;
  }
  const conn =
    navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!conn) {
    setStatus("Network: unavailable", "status-warn");
    return;
  }
  const parts = [];
  let level = "status-warn";
  if (Number.isFinite(conn.downlink)) {
    parts.push(`${conn.downlink.toFixed(1)} Mbps`);
    if (conn.downlink >= 5) {
      level = "status-good";
    } else if (conn.downlink >= 2) {
      level = "status-warn";
    } else {
      level = "status-bad";
    }
  }
  if (conn.effectiveType) {
    parts.push(String(conn.effectiveType).toUpperCase());
    const type = String(conn.effectiveType).toLowerCase();
    if (!Number.isFinite(conn.downlink)) {
      if (type === "4g") {
        level = "status-good";
      } else if (type === "3g") {
        level = "status-warn";
      } else {
        level = "status-bad";
      }
    }
  }
  if (Number.isFinite(conn.rtt)) {
    parts.push(`${conn.rtt} ms`);
  }
  setStatus(
    parts.length ? `Network: ${parts.join(" • ")}` : "Network: unknown",
    level
  );
}

function updateVolumeFill() {
  const volume = Number(ui.player.volume || 0);
  const ratio = Math.min(1, Math.max(0, volume));
  ui.volumeSlider.style.setProperty("--volume", `${ratio * 100}%`);
}

function updateVolumeIcon() {
  const volume = Number(ui.player.volume || 0);
  if (ui.player.muted || volume === 0) {
    setButtonIcon(ui.muteBtn, "mute", "Unmute");
    return;
  }
  if (volume < 0.34) {
    setButtonIcon(ui.muteBtn, "volumeLow", "Volume low");
    return;
  }
  if (volume < 0.67) {
    setButtonIcon(ui.muteBtn, "volumeMed", "Volume medium");
    return;
  }
  setButtonIcon(ui.muteBtn, "volumeHigh", "Volume high");
}

function updateAddMode() {
  if (!ui.addSource) {
    return;
  }
  const isLocal = ui.addSource.value === "local";
  if (ui.localFields) {
    ui.localFields.hidden = !isLocal;
  }
  if (ui.urlFields) {
    ui.urlFields.hidden = isLocal;
  }
  autoFillFromCurrentInput();
  if (addStep === 1) {
    validateAddStep1();
  }
}

function setAddValidation(message, isError) {
  if (!ui.addValidation) {
    return;
  }
  ui.addValidation.textContent = message || "";
  ui.addValidation.classList.toggle("error", Boolean(isError));
}

function setAddStep(nextStep) {
  addStep = Math.max(1, Math.min(2, nextStep));
  if (ui.addStepIndicator) {
    ui.addStepIndicator.textContent = `Step ${addStep} of 2`;
  }
  if (ui.addStepTitle) {
    ui.addStepTitle.textContent =
      addStep === 1 ? "Choose source" : "Confirm metadata";
  }
  document.querySelectorAll(".add-step").forEach((stepEl) => {
    const stepValue = Number(stepEl.dataset.step || 0);
    stepEl.hidden = stepValue !== addStep;
  });
  if (ui.addBack) {
    ui.addBack.hidden = addStep === 1;
  }
  if (ui.addNext) {
    ui.addNext.hidden = addStep !== 1;
  }
  if (ui.addSubmit) {
    ui.addSubmit.hidden = addStep !== 2;
  }
}

function normalizePath(value) {
  return String(value || "").replace(/\//g, "\\").toLowerCase();
}

function getAddSourceInput() {
  if (!ui.addSource) {
    return { type: "local", value: "" };
  }
  if (ui.addSource.value === "url") {
    return { type: "url", value: ui.addUrl ? ui.addUrl.value.trim() : "" };
  }
  if (ui.addPath && ui.addPath.value.trim()) {
    return { type: "local", value: ui.addPath.value.trim() };
  }
  const file = ui.addFile && ui.addFile.files && ui.addFile.files[0];
  return { type: "local", value: file ? file.name : "" };
}

function findDuplicateAddEntry(sourceType, sourceValue) {
  if (!sourceValue) {
    return { exact: false, possible: false };
  }
  if (sourceType === "url") {
    const match = state.items.find(
      (item) => item.type === "url" && item.url === sourceValue
    );
    return { exact: Boolean(match), possible: false };
  }
  const filename = sourceValue.split(/[\\/]+/).pop() || sourceValue;
  const target = normalizePath(sourceValue);
  const localRoot = normalizePath(state.localPath || "");
  let relative = "";
  if (localRoot && target.startsWith(localRoot)) {
    relative = target.slice(localRoot.length).replace(/^\\+/, "");
  }
  const exact = Boolean(
    relative &&
      state.items.find(
        (item) =>
          item.type === "local" &&
          normalizePath(item.path || "") === normalizePath(relative)
      )
  );
  if (exact) {
    return { exact: true, possible: false };
  }
  const possible = Boolean(
    state.items.find(
      (item) =>
        item.type === "local" &&
        normalizePath(item.path || "").endsWith(normalizePath(filename))
    )
  );
  return { exact: false, possible };
}

function validateAddStep1() {
  const { type, value } = getAddSourceInput();
  if (!value) {
    setAddValidation("Choose a file/path or enter a URL.", true);
    return false;
  }
  if (type === "url") {
    try {
      const url = new URL(value);
      if (!/^https?:$/.test(url.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      setAddValidation("Enter a valid http/https URL.", true);
      return false;
    }
  } else {
    const ext = value.toLowerCase().match(/\.[a-z0-9]+$/);
    if (ext && ![".mp4", ".mkv", ".webm", ".mov", ".avi"].includes(ext[0])) {
      setAddValidation("Unsupported video type.", true);
      return false;
    }
  }
  const duplicate = findDuplicateAddEntry(type, value);
  if (duplicate.exact && !(ui.addAllowDuplicate && ui.addAllowDuplicate.checked)) {
    setAddValidation("This item already exists. Enable Allow duplicates to proceed.", true);
    return false;
  }
  if (duplicate.possible) {
    setAddValidation("Possible duplicate found. Double-check before adding.", false);
  } else {
    setAddValidation("");
  }
  return true;
}

function validateAddStep2() {
  if (ui.addStatus) {
    ui.addStatus.textContent = "";
    ui.addStatus.classList.remove("error");
  }
  if (!ui.addTitle || !ui.addTitle.value.trim()) {
    if (ui.addStatus) {
      ui.addStatus.textContent = "Title is required.";
      ui.addStatus.classList.add("error");
    }
    return false;
  }
  if (ui.addYear && ui.addYear.value !== "") {
    const year = Number(ui.addYear.value);
    if (!Number.isFinite(year) || year < 1900 || year > 2100) {
      if (ui.addStatus) {
        ui.addStatus.textContent = "Year must be between 1900 and 2100.";
        ui.addStatus.classList.add("error");
      }
      return false;
    }
  }
  if (ui.addRating && ui.addRating.value !== "") {
    const rating = Number(ui.addRating.value);
    if (!Number.isFinite(rating) || rating < 0 || rating > 10) {
      if (ui.addStatus) {
        ui.addStatus.textContent = "Rating must be between 0 and 10.";
        ui.addStatus.classList.add("error");
      }
      return false;
    }
  }
  return true;
}

function clearAutoFillState() {
  [
    ui.addTitle,
    ui.addTags,
    ui.addYear,
    ui.addRating,
    ui.addGroup
  ].forEach((field) => {
    if (!field) {
      return;
    }
    delete field.dataset.manual;
    delete field.dataset.auto;
  });
}

function buildSuggestionRow(item, query) {
  const row = document.createElement("button");
  row.type = "button";
  row.className = "search-suggest-row";
  row.dataset.id = item.id;
  const title = escapeHtml(item.title || "Untitled");
  const year = item.year ? String(item.year) : "--";
  const rating = Number.isFinite(getRatingFor(item))
    ? Math.round((getRatingFor(item) / 5) * 100)
    : null;
  const type = item.type === "url" ? "Stream" : "Local";
  row.innerHTML = `
    <span class="search-suggest-title">${title}</span>
    <span class="search-suggest-meta">
      ${year}
      ${rating !== null ? ` • ${rating}%` : ""}
      ${type ? ` • ${type}` : ""}
    </span>
  `;
  row.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });
  row.addEventListener("click", () => {
    ui.searchInput.value = item.title || "";
    scheduleRender();
    hideSearchSuggestions();
  });
  return row;
}

function hideSearchSuggestions() {
  if (!ui.searchSuggest) {
    return;
  }
  ui.searchSuggest.innerHTML = "";
  ui.searchSuggest.hidden = true;
  searchSuggestIndex = -1;
}

function updateSearchSuggestions() {
  if (!ui.searchSuggest) {
    return;
  }
  const query = ui.searchInput.value.trim();
  if (!query) {
    hideSearchSuggestions();
    return;
  }
  const tokens = tokenize(query);
  const results = state.items
    .filter((item) => {
      const haystack = item._searchText || "";
      return tokens.every((token) => haystack.includes(token));
    })
    .slice(0, 6);
  ui.searchSuggest.innerHTML = "";
  results.forEach((item) => {
    ui.searchSuggest.appendChild(buildSuggestionRow(item, query));
  });
  ui.searchSuggest.hidden = results.length === 0;
  searchSuggestIndex = results.length ? 0 : -1;
  if (searchSuggestIndex >= 0) {
    const row = ui.searchSuggest.children[searchSuggestIndex];
    if (row) {
      row.classList.add("active");
    }
  }
}

function moveSearchSelection(delta) {
  if (!ui.searchSuggest || ui.searchSuggest.hidden) {
    return;
  }
  const rows = Array.from(ui.searchSuggest.children);
  if (!rows.length) {
    return;
  }
  rows.forEach((row) => row.classList.remove("active"));
  searchSuggestIndex = Math.max(
    0,
    Math.min(rows.length - 1, searchSuggestIndex + delta)
  );
  rows[searchSuggestIndex].classList.add("active");
}

function applySearchSelection() {
  if (!ui.searchSuggest || ui.searchSuggest.hidden) {
    return false;
  }
  const rows = Array.from(ui.searchSuggest.children);
  if (!rows.length || searchSuggestIndex < 0) {
    return false;
  }
  const row = rows[searchSuggestIndex];
  const id = row.dataset.id;
  const item = state.itemsById.get(id);
  if (item) {
    ui.searchInput.value = item.title || "";
  }
  scheduleRender();
  hideSearchSuggestions();
  return true;
}

function decodePathSafe(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function stripQueryHash(value) {
  return value.split(/[?#]/)[0];
}

function stripExtension(value) {
  return value.replace(/\.[^.]+$/, "");
}

function splitSegments(value) {
  return value.split(/[\\/]+/).filter(Boolean);
}

function splitTagString(value) {
  return value
    .split(/[,|]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function normalizeToken(value) {
  return String(value || "").toLowerCase();
}

function isYearToken(value) {
  return /^(19|20)\d{2}$/.test(value);
}

function isResolutionToken(value) {
  return /^\d{3,4}p$/.test(value) || value === "4k" || value === "8k";
}

function shouldKeepTitleToken(token) {
  const lowered = normalizeToken(token);
  if (!lowered) {
    return false;
  }
  if (isYearToken(lowered) || isResolutionToken(lowered)) {
    return false;
  }
  if (TITLE_DROP_TOKENS.has(lowered)) {
    return false;
  }
  return true;
}

function shouldSkipTagToken(token) {
  const lowered = normalizeToken(token);
  if (!lowered) {
    return true;
  }
  if (TAG_SKIP_TOKENS.has(lowered)) {
    return true;
  }
  if (isYearToken(lowered)) {
    return true;
  }
  if (lowered.endsWith(":")) {
    return true;
  }
  return false;
}

function dedupeTags(tags) {
  const seen = new Set();
  return tags.filter((tag) => {
    const key = normalizeToken(tag);
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function extractAutoHints(rawValue, sourceType) {
  const hints = {
    title: "",
    year: "",
    tags: [],
    group: ""
  };
  if (!rawValue) {
    return hints;
  }

  let value = rawValue.trim();
  let hostnameTag = "";

  if (sourceType === "url") {
    try {
      const url = new URL(value);
      value = url.pathname || "";
      hostnameTag = url.hostname
        ? url.hostname.replace(/^www\./, "")
        : "";
      hints.group = "Streams";
    } catch {
      // Fall through to treat as a path-like string.
    }
  }

  value = stripQueryHash(value);
  value = decodePathSafe(value);
  const segments = splitSegments(value.replace(/\\/g, "/"));
  const fileSegment = segments[segments.length - 1] || value;
  let base = stripExtension(fileSegment);

  const bracketTags = [];
  base = base.replace(/\[([^\]]+)\]|\(([^)]+)\)/g, (match, a, b) => {
    const text = String(a || b || "").trim();
    if (text && !isYearToken(text)) {
      bracketTags.push(...splitTagString(text));
    }
    return " ";
  });

  const cleaned = base.replace(/[._-]+/g, " ").replace(/\s+/g, " ").trim();
  const yearMatch = cleaned.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) {
    hints.year = yearMatch[0];
  }

  const tokens = cleaned.split(/\s+/).filter(Boolean);
  const titleTokens = tokens.filter((token) => shouldKeepTitleToken(token));
  hints.title = (titleTokens.length ? titleTokens : tokens).join(" ").trim();

  const folderSegments = segments
    .slice(0, -1)
    .map((segment) => segment.replace(/[._-]+/g, " ").trim())
    .filter(Boolean);

  if (!hints.group && folderSegments.length) {
    const candidate = folderSegments[folderSegments.length - 1];
    if (!shouldSkipTagToken(candidate)) {
      hints.group = candidate;
    }
  }

  folderSegments.forEach((segment) => {
    if (shouldSkipTagToken(segment)) {
      return;
    }
    hints.tags.push(...splitTagString(segment));
  });

  if (hostnameTag) {
    hints.tags.push(hostnameTag);
  }

  hints.tags.push(...bracketTags);
  hints.tags = dedupeTags(hints.tags);

  return hints;
}

function setAutoValue(field, value) {
  if (!field || !value) {
    return;
  }
  if (field.dataset.manual === "true") {
    return;
  }
  field.value = value;
  field.dataset.auto = value;
}

function autoFillFromInput(rawValue, sourceType) {
  const hints = extractAutoHints(rawValue, sourceType);
  setAutoValue(ui.addTitle, hints.title);
  setAutoValue(ui.addYear, hints.year);
  setAutoValue(ui.addGroup, hints.group);
  if (hints.tags.length) {
    setAutoValue(ui.addTags, hints.tags.join(", "));
  }
}

function autoFillFromCurrentInput() {
  if (!ui.addSource) {
    return;
  }
  if (ui.addSource.value === "url") {
    if (ui.addUrl && ui.addUrl.value.trim()) {
      autoFillFromInput(ui.addUrl.value, "url");
    }
    return;
  }
  if (ui.addPath && ui.addPath.value.trim()) {
    autoFillFromInput(ui.addPath.value, "local");
    return;
  }
  const file = ui.addFile && ui.addFile.files && ui.addFile.files[0];
  if (file) {
    autoFillFromInput(file.name, "local");
  }
}

function setManualValue(field, value) {
  if (!field) {
    return;
  }
  const hasValue = value !== undefined && value !== null && value !== "";
  if (!hasValue) {
    return;
  }
  field.value = String(value);
  field.dataset.manual = "true";
}

function getTmdbQuery() {
  const title = ui.addTitle ? ui.addTitle.value.trim() : "";
  if (title) {
    return title;
  }
  if (ui.addSource && ui.addSource.value === "url" && ui.addUrl) {
    const hints = extractAutoHints(ui.addUrl.value, "url");
    return hints.title || "";
  }
  if (ui.addPath && ui.addPath.value.trim()) {
    const hints = extractAutoHints(ui.addPath.value, "local");
    return hints.title || "";
  }
  const file = ui.addFile && ui.addFile.files && ui.addFile.files[0];
  if (file) {
    const hints = extractAutoHints(file.name, "local");
    return hints.title || "";
  }
  return "";
}

function setTmdbStatus(message, isError) {
  if (!ui.tmdbStatus) {
    return;
  }
  ui.tmdbStatus.textContent = message || "";
  ui.tmdbStatus.classList.toggle("error", Boolean(isError));
}

function clearTmdbResults() {
  if (!ui.tmdbResults) {
    return;
  }
  ui.tmdbResults.innerHTML = "";
  ui.tmdbResults.hidden = true;
}

function renderTmdbResults(results) {
  if (!ui.tmdbResults) {
    return;
  }
  ui.tmdbResults.innerHTML = "";
  if (!results.length) {
    ui.tmdbResults.hidden = true;
    return;
  }
  results.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tmdb-result";
    button.dataset.id = item.id;
    const poster = item.poster
      ? ` style="background-image: url('${item.poster}');"`
      : "";
    button.innerHTML = `
      <div class="tmdb-poster"${poster}></div>
      <div class="tmdb-meta">
        <div class="tmdb-title">${escapeHtml(item.title || "Untitled")}</div>
        <div class="tmdb-sub">
          ${item.year ? escapeHtml(item.year) : "Year --"}
          ${item.rating ? ` • ${item.rating.toFixed(1)}/5` : ""}
        </div>
      </div>
    `;
    ui.tmdbResults.appendChild(button);
  });
  ui.tmdbResults.hidden = false;
}

async function fetchTmdbSearch(query, year) {
  const url = new URL("/api/tmdb/search", window.location.origin);
  url.searchParams.set("query", query);
  if (year) {
    url.searchParams.set("year", year);
  }
  const response = await fetch(url.toString());
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "TMDB search failed");
  }
  const payload = await response.json();
  return Array.isArray(payload.results) ? payload.results : [];
}

async function fetchTmdbDetails(id) {
  const response = await fetch(`/api/tmdb/details/${encodeURIComponent(id)}`);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "TMDB details failed");
  }
  return response.json();
}

async function runTmdbLookup() {
  const query = getTmdbQuery();
  if (!query) {
    setTmdbStatus("Add a title or file name first.", true);
    clearTmdbResults();
    return;
  }
  const year = ui.addYear && ui.addYear.value ? ui.addYear.value.trim() : "";
  const token = (tmdbRequestToken += 1);
  setTmdbStatus("Searching TMDB...", false);
  clearTmdbResults();
  try {
    const results = await fetchTmdbSearch(query, year);
    if (token !== tmdbRequestToken) {
      return;
    }
    renderTmdbResults(results);
    setTmdbStatus(
      results.length ? "Pick a match to fill metadata." : "No matches found.",
      !results.length
    );
  } catch (err) {
    if (token !== tmdbRequestToken) {
      return;
    }
    setTmdbStatus(err.message || "TMDB lookup failed.", true);
    clearTmdbResults();
  }
}

async function applyTmdbSelection(id) {
  if (!id) {
    return;
  }
  setTmdbStatus("Loading details...", false);
  try {
    const details = await fetchTmdbDetails(id);
    setManualValue(ui.addTitle, details.title || "");
    setManualValue(ui.addYear, details.year || "");
    if (Array.isArray(details.tags) && details.tags.length) {
      setManualValue(ui.addTags, details.tags.join(", "));
    }
    if (Number.isFinite(details.rating)) {
      setManualValue(ui.addRating, details.rating.toFixed(1));
    }
    if (details.synopsis) {
      setManualValue(ui.addSynopsis, details.synopsis);
    }
    if (ui.addPosterUrl && details.poster) {
      setManualValue(ui.addPosterUrl, details.poster);
    }
    setTmdbStatus("Metadata applied from TMDB.", false);
  } catch (err) {
    setTmdbStatus(err.message || "TMDB lookup failed.", true);
  }
}

function setBulkStatus(message, isError) {
  if (!ui.bulkStatus) {
    return;
  }
  ui.bulkStatus.textContent = message || "";
  ui.bulkStatus.classList.toggle("error", Boolean(isError));
}

function setEnrichStatus(message, isError) {
  if (!ui.enrichStatus) {
    return;
  }
  ui.enrichStatus.textContent = message || "";
  ui.enrichStatus.classList.toggle("error", Boolean(isError));
}

function parseBulkLine(line) {
  const parts = line.split("|").map((part) => part.trim());
  if (!parts[0]) {
    return null;
  }
  const entry = { source: parts[0] };
  if (parts[1]) {
    entry.title = parts[1];
  }
  if (parts[2]) {
    entry.year = Number(parts[2]);
  }
  if (parts[3]) {
    entry.tags = parts[3];
  }
  if (parts[4]) {
    entry.rating = Number(parts[4]);
  }
  if (parts[5]) {
    entry.group = parts[5];
  }
  if (parts[6]) {
    entry.poster = parts[6];
  }
  if (parts[7]) {
    entry.subtitle = parts[7];
  }
  return entry;
}

function buildBulkItems(rawText, mode) {
  if (!rawText || !rawText.trim()) {
    return [];
  }
  if (mode === "json") {
    const parsed = JSON.parse(rawText);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    if (parsed && Array.isArray(parsed.items)) {
      return parsed.items;
    }
    return [];
  }
  return rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parseBulkLine)
    .filter(Boolean);
}

async function submitBulkImport() {
  const mode = ui.bulkMode ? ui.bulkMode.value : "lines";
  const rawText = ui.bulkInput ? ui.bulkInput.value : "";
  let items = [];
  try {
    items = buildBulkItems(rawText, mode);
  } catch (err) {
    setBulkStatus("Invalid JSON format.", true);
    return;
  }
  if (!items.length) {
    setBulkStatus("Add at least one item to import.", true);
    return;
  }
  setBulkStatus("Importing...", false);
  try {
    const response = await fetch("/api/media/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items })
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error || "Bulk import failed");
    }
    const payload = await response.json().catch(() => ({}));
    setBulkStatus(
      `Imported ${payload.added || 0}, skipped ${payload.skipped || 0}.`,
      false
    );
    await loadAll();
  } catch (err) {
    setBulkStatus(err.message || "Bulk import failed.", true);
  }
}

async function submitTmdbEnrich() {
  const limitValue =
    ui.enrichLimit && ui.enrichLimit.value
      ? Number(ui.enrichLimit.value)
      : null;
  const overwrite = Boolean(ui.enrichOverwrite && ui.enrichOverwrite.checked);
  const applyPosters = Boolean(ui.enrichPosters && ui.enrichPosters.checked);
  setEnrichStatus("Enriching library...", false);
  try {
    const response = await fetch("/api/tmdb/enrich", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        limit: limitValue,
        overwrite,
        applyPosters
      })
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error || "TMDB enrich failed");
    }
    const payload = await response.json().catch(() => ({}));
    setEnrichStatus(
      `Enriched ${payload.enriched || 0}, skipped ${payload.skipped || 0}.`,
      false
    );
    await loadAll();
  } catch (err) {
    setEnrichStatus(err.message || "TMDB enrich failed.", true);
  }
}

function registerManualField(field) {
  if (!field) {
    return;
  }
  field.addEventListener("input", () => {
    if (field.value.trim()) {
      field.dataset.manual = "true";
    } else {
      delete field.dataset.manual;
    }
  });
}

function resetAddForm() {
  if (!ui.addForm) {
    return;
  }
  ui.addForm.reset();
  if (ui.addStatus) {
    ui.addStatus.textContent = "";
    ui.addStatus.classList.remove("error");
  }
  setAddValidation("");
  if (ui.addAllowDuplicate) {
    ui.addAllowDuplicate.checked = false;
  }
  clearAutoFillState();
  setTmdbStatus("");
  clearTmdbResults();
  updateAddMode();
  setAddStep(1);
}

async function submitAddForm(event) {
  event.preventDefault();
  if (!ui.addSource) {
    return;
  }
  if (addStep !== 2) {
    if (validateAddStep1()) {
      setAddStep(2);
    }
    return;
  }
  if (!validateAddStep2()) {
    return;
  }
  if (ui.addStatus) {
    ui.addStatus.textContent = "Saving...";
    ui.addStatus.classList.remove("error");
  }
  const payload = {
    title: ui.addTitle.value.trim(),
    group: ui.addGroup.value.trim(),
    tags: ui.addTags.value.trim(),
    year: ui.addYear.value !== "" ? Number(ui.addYear.value) : null,
    rating: ui.addRating.value !== "" ? Number(ui.addRating.value) : null,
    synopsis: ui.addSynopsis.value.trim()
  };
  try {
    if (ui.addSource.value === "url") {
      const url = ui.addUrl.value.trim();
      if (!url) {
        throw new Error("URL is required.");
      }
      const response = await fetch("/api/media/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          url,
          poster: ui.addPosterUrl.value.trim(),
          subtitle: ui.addSubtitleUrl.value.trim()
        })
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to add URL");
      }
    } else {
      const form = new FormData();
      const file = ui.addFile.files && ui.addFile.files[0];
      const sourcePath = ui.addPath.value.trim();
      if (!file && !sourcePath) {
        throw new Error("Choose a file or enter a local path.");
      }
      if (file) {
        form.append("movie", file);
      }
      if (sourcePath) {
        form.append("sourcePath", sourcePath);
      }
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          form.append(key, String(value));
        }
      });
      const response = await fetch("/api/media/local", {
        method: "POST",
        body: form
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to add file");
      }
    }
    if (ui.addStatus) {
      ui.addStatus.textContent = "Saved.";
    }
    await loadAll();
    if (ui.addDialog) {
      ui.addDialog.close();
    }
    resetAddForm();
  } catch (err) {
    if (ui.addStatus) {
      ui.addStatus.textContent = err.message || "Failed to add movie.";
      ui.addStatus.classList.add("error");
    }
  }
}

function setVolumeOpen(open) {
  volumeOpen = Boolean(open);
  if (!ui.utilityControls) {
    return;
  }
  ui.utilityControls.classList.toggle("volume-open", volumeOpen);
}

function toggleVolumeOpen() {
  setVolumeOpen(!volumeOpen);
}

function isFullscreenActive() {
  return document.fullscreenElement === ui.playerShell;
}

function showFullscreenControls() {
  if (!ui.playerShell || !isFullscreenActive()) {
    return;
  }
  ui.playerShell.classList.add("controls-visible");
  if (controlsHideTimer) {
    clearTimeout(controlsHideTimer);
  }
  controlsHideTimer = setTimeout(() => {
    ui.playerShell.classList.remove("controls-visible");
  }, 3000);
}

function updateFullscreenUi() {
  const active = isFullscreenActive();
  ui.playerShell.classList.toggle("fullscreen", active);
  setButtonIcon(
    ui.fullscreenBtn,
    active ? "exitFullscreen" : "fullscreen",
    active ? "Minimize" : "Fullscreen"
  );
  if (active) {
    showFullscreenControls();
  } else {
    ui.playerShell.classList.remove("controls-visible");
  }
}

function stopPlayback() {
  ui.player.pause();
  ui.player.currentTime = 0;
  updateTimeDisplay();
  updatePlayState();
  clearLoadingState();
  setPlaybackStatus("Stopped");
  sendProgress(true).catch(() => {});
}

function updateTimeDisplayThrottled() {
  const now = performance.now();
  if (now - lastUiUpdate < UI_UPDATE_INTERVAL) {
    return;
  }
  lastUiUpdate = now;
  updateTimeDisplay();
  updateBufferStatus();
}

function updatePlayState() {
  const paused = ui.player.paused;
  setButtonIcon(ui.playToggle, paused ? "play" : "pause", paused ? "Play" : "Pause");
  setButtonIcon(ui.centerPlay, paused ? "play" : "pause", paused ? "Play" : "Pause");
  ui.playerShell.classList.toggle("paused", paused);
  if (paused) {
    showFullscreenControls();
  }
}

async function waitForEvent(target, eventName) {
  return new Promise((resolve) => {
    const handler = () => {
      target.removeEventListener(eventName, handler);
      resolve();
    };
    target.addEventListener(eventName, handler);
  });
}

async function seekTo(video, time) {
  return new Promise((resolve, reject) => {
    const onSeeked = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("seek-failed"));
    };
    const cleanup = () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
    };
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);
    video.currentTime = time;
  });
}

async function generateThumbnails(item) {
  if (!item || item.type !== "local") {
    return null;
  }
  const token = ++thumbnailToken;
  const previewVideo = document.createElement("video");
  previewVideo.src = getMediaSrc(item);
  previewVideo.muted = true;
  previewVideo.preload = "auto";
  await waitForEvent(previewVideo, "loadedmetadata");
  if (token !== thumbnailToken) {
    return null;
  }
  const duration = previewVideo.duration;
  if (!Number.isFinite(duration) || duration <= 0) {
    return null;
  }
  const count = 10;
  const canvas = document.createElement("canvas");
  const width = 180;
  const ratio = previewVideo.videoWidth
    ? previewVideo.videoHeight / previewVideo.videoWidth
    : 9 / 16;
  canvas.width = width;
  canvas.height = Math.round(width * ratio);
  const ctx = canvas.getContext("2d");
  const frames = [];
  for (let i = 1; i <= count; i += 1) {
    if (token !== thumbnailToken) {
      return null;
    }
    const time = (duration * i) / (count + 1);
    try {
      await seekTo(previewVideo, time);
      ctx.drawImage(previewVideo, 0, 0, canvas.width, canvas.height);
      frames.push({
        time,
        dataUrl: canvas.toDataURL("image/jpeg", 0.6)
      });
      await new Promise((resolve) => setTimeout(resolve, 40));
    } catch {
      break;
    }
  }
  previewVideo.src = "";
  return { duration, frames };
}

async function ensureThumbnails(item) {
  if (!item || item.type !== "local") {
    return null;
  }
  const cached = thumbnailCache.get(item.id);
  if (cached && cached.frames) {
    return cached;
  }
  if (cached && cached.promise) {
    return cached.promise;
  }
  const promise = generateThumbnails(item);
  thumbnailCache.set(item.id, { promise });
  const result = await promise;
  if (result) {
    thumbnailCache.set(item.id, result);
  }
  return result;
}

function showSeekPreview(event) {
  if (!state.selected || !ui.player.duration) {
    return;
  }
  const barRect = ui.progressBar.getBoundingClientRect();
  const shellRect = ui.playerShell.getBoundingClientRect();
  const ratio = Math.min(
    1,
    Math.max(0, (event.clientX - barRect.left) / barRect.width)
  );
  const time = ratio * ui.player.duration;
  const left = barRect.left + ratio * barRect.width - shellRect.left;
  ui.seekPreview.classList.add("visible");
  ui.seekPreview.style.left = `${left}px`;
  ui.seekPreviewTime.textContent = formatDuration(time);

  const cached = thumbnailCache.get(state.selected.id);
  if (!cached || !cached.frames) {
    ui.seekPreviewImg.style.display = "none";
    ensureThumbnails(state.selected).catch(() => {});
    return;
  }
  const frame = cached.frames.reduce((best, entry) => {
    if (!best) {
      return entry;
    }
    return Math.abs(entry.time - time) < Math.abs(best.time - time)
      ? entry
      : best;
  }, null);
  if (frame) {
    ui.seekPreviewImg.src = frame.dataUrl;
    ui.seekPreviewImg.style.display = "block";
  }
}

function hideSeekPreview() {
  ui.seekPreview.classList.remove("visible");
}

function setPlayer(item, options = {}) {
  if (!item) {
    setPlaybackStatus("");
    if (ui.networkStatus) {
      ui.networkStatus.textContent = "Network: --";
    }
    if (ui.bufferStatus) {
      ui.bufferStatus.textContent = "Buffer: --";
    }
    destroyHls();
    resetQualityOptions();
    setQualityVisible(false);
    ui.player.removeAttribute("src");
    ui.player.load();
    clearTracks();
    updateTimeDisplay();
    updatePlayState();
    clearLoadingState();
    return;
  }
  setPlaybackStatus("");
  updateNetworkStatus(item);
  const src = getMediaSrc(item);
  attachHlsSource(item, src);
  clearTracks();
  if (item.subtitle) {
    const track = document.createElement("track");
    track.kind = "subtitles";
    track.label = "Subtitles";
    track.srclang = "en";
    track.src = item.subtitle;
    track.default = true;
    ui.player.appendChild(track);
  }
  ui.player.load();
  ui.player.onloadedmetadata = () => {
    const progress = getProgressFor(item);
    const tracks = Array.from(ui.player.textTracks || []);
    tracks.forEach((track) => {
      track.mode = subtitlesEnabled ? "showing" : "disabled";
    });
    if (progress && progress.position > 5 && ui.player.duration) {
      const resumeAt = Math.min(progress.position, ui.player.duration - 2);
      if (resumeAt > 0) {
        ui.player.currentTime = resumeAt;
      }
    }
    updateTimeDisplay();
    updateBufferStatus();
    updatePlayState();
  };
  if (options.autoplay !== false) {
    ui.player.play().catch(() => {});
  }
}

function buildShelf(title, items, badge, id) {
  return { id: id || null, title, items, badge: badge || items.length };
}

function computeSuggested(items) {
  const recent = items
    .map((item) => ({ item, progress: getProgressFor(item) }))
    .filter((entry) => entry.progress && entry.progress.lastPlayedAt)
    .sort(
      (a, b) =>
        new Date(b.progress.lastPlayedAt) - new Date(a.progress.lastPlayedAt)
    )
    .slice(0, 5)
    .map((entry) => entry.item);

  const tagCounts = new Map();
  const likedItems = items.filter((item) => getReaction(item) === 1);
  likedItems.forEach((item) => {
    getTags(item).forEach((tag) => {
      const key = normalize(tag);
      tagCounts.set(key, (tagCounts.get(key) || 0) + 3);
    });
  });
  recent.forEach((item) => {
    getTags(item).forEach((tag) => {
      const key = normalize(tag);
      tagCounts.set(key, (tagCounts.get(key) || 0) + 1);
    });
  });

  const scored = [...items]
    .map((item) => {
      if (getReaction(item) === -1) {
        return { item, score: -1 };
      }
      let score = 0;
      const rating = getRatingFor(item) || 0;
      score += rating * 2;
      getTags(item).forEach((tag) => {
        const key = normalize(tag);
        if (tagCounts.has(key)) {
          score += tagCounts.get(key) * 3;
        }
      });
      if (item.updatedAt) {
        score += 0.5;
      }
      if (getReaction(item) === 1) {
        score += 4;
      }
      return { item, score };
    })
    .filter((entry) => entry.score >= 0)
    .sort((a, b) => b.score - a.score);
  const pool = scored.slice(0, 30).map((entry) => entry.item);
  return seededShuffle(pool, suggestedSeed).slice(0, 12);
}

function computeTrending(items) {
  const now = Date.now();
  const windowHours = trendingWindow === "day" ? 24 : 24 * 7;
  const scored = items
    .map((item) => {
      if (getReaction(item) === -1) {
        return { item, score: -1 };
      }
      const progress = getProgressFor(item);
      let score = 0;
      if (progress && progress.lastPlayedAt) {
        const hours =
          (now - new Date(progress.lastPlayedAt).getTime()) / 3600000;
        if (hours <= windowHours) {
          score += windowHours - hours;
        }
      }
      const rating = getRatingFor(item) || 0;
      score += rating * 0.8;
      if (item.updatedAt) {
        const days =
          (now - new Date(item.updatedAt).getTime()) / (24 * 3600000);
        score += Math.max(0, 2 - days / 7);
      }
      if (getReaction(item) === 1) {
        score += 2;
      }
      return { item, score };
    })
    .filter((entry) => entry.score >= 0)
    .sort((a, b) => b.score - a.score);
  const top = scored.filter((entry) => entry.score > 0).slice(0, 12);
  if (top.length) {
    return top.map((entry) => entry.item);
  }
  return scored.slice(0, 12).map((entry) => entry.item);
}

function computeSimilarToSelected(items) {
  if (!state.selected) {
    return [];
  }
  const selectedTags = getTags(state.selected).map((tag) => normalize(tag));
  if (!selectedTags.length) {
    return [];
  }
  const scored = items
    .filter((item) => item.id !== state.selected.id && getReaction(item) !== -1)
    .map((item) => {
      const tags = getTags(item).map((tag) => normalize(tag));
      const overlap = tags.filter((tag) => selectedTags.includes(tag)).length;
      const rating = getRatingFor(item) || 0;
      const likedBoost = getReaction(item) === 1 ? 2 : 0;
      return { item, score: overlap * 3 + rating + likedBoost };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((entry) => entry.item);
  return scored;
}

function computeSimilarToLiked(items) {
  const liked = items.filter((item) => getReaction(item) === 1);
  if (!liked.length) {
    return [];
  }
  const tagCounts = new Map();
  liked.forEach((item) => {
    getTags(item).forEach((tag) => {
      const key = normalize(tag);
      tagCounts.set(key, (tagCounts.get(key) || 0) + 2);
    });
  });
  const scored = items
    .filter((item) => getReaction(item) !== -1 && getReaction(item) !== 1)
    .map((item) => {
      const tags = getTags(item).map((tag) => normalize(tag));
      let score = 0;
      tags.forEach((tag) => {
        if (tagCounts.has(tag)) {
          score += tagCounts.get(tag);
        }
      });
      const rating = getRatingFor(item) || 0;
      return { item, score: score + rating };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((entry) => entry.item);
  return scored;
}

function setTrendingWindow(value) {
  const next = value === "day" ? "day" : "week";
  if (next === trendingWindow) {
    return;
  }
  trendingWindow = next;
  localStorage.setItem(STORAGE_TRENDING_KEY, trendingWindow);
  scheduleRender();
}

function computeShelves() {
  const base = sortItems(state.filtered);
  const shelves = [];

  const continueWatching = base.filter((item) =>
    isContinueWatching(getProgressFor(item))
  );
  if (continueWatching.length) {
    shelves.push(buildShelf("Continue Watching", continueWatching));
  }

  const favorites = base.filter((item) => isFavorite(item));
  if (favorites.length) {
    shelves.push(buildShelf("My List", favorites));
  }

  const likedShelf = computeSimilarToLiked(base);
  if (likedShelf.length) {
    shelves.push(buildShelf("Because You Liked", likedShelf));
  }

  const trending = computeTrending(base);
  if (trending.length) {
    shelves.push(buildShelf("Trending", trending, trending.length, "trending"));
  }

  const similar = computeSimilarToSelected(base);
  if (similar.length) {
    const label = state.selected
      ? `Because you watched ${state.selected.title}`
      : "Because you watched";
    shelves.push(buildShelf(label, similar));
  }

  const suggested = computeSuggested(base);
  if (suggested.length) {
    shelves.push(buildShelf("Suggested for You", suggested, suggested.length, "suggested"));
  }

  const topRated = [...base]
    .filter((item) => Number.isFinite(getRatingFor(item)))
    .sort((a, b) => (getRatingFor(b) || 0) - (getRatingFor(a) || 0))
    .slice(0, 12);
  if (topRated.length) {
    shelves.push(buildShelf("Top Rated", topRated));
  }

  const recentPlayed = base
    .map((item) => ({ item, progress: getProgressFor(item) }))
    .filter((entry) => entry.progress && entry.progress.lastPlayedAt)
    .sort(
      (a, b) =>
        new Date(b.progress.lastPlayedAt) - new Date(a.progress.lastPlayedAt)
    )
    .slice(0, 12)
    .map((entry) => entry.item);
  if (recentPlayed.length) {
    shelves.push(buildShelf("Recently Played", recentPlayed));
  }

  const recentlyAdded = [...base]
    .filter((item) => item.updatedAt)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 12);
  if (recentlyAdded.length) {
    shelves.push(buildShelf("Recently Added", recentlyAdded));
  }

  const bigScreen = base.filter((item) => item.size && item.size > 1.5e9);
  if (bigScreen.length) {
    shelves.push(buildShelf("Big Screen", bigScreen));
  }

  const streams = base.filter((item) => item.type === "url");
  if (streams.length) {
    shelves.push(buildShelf("Stream Deck", streams));
  }

  const groups = groupItems(base);
  groups.forEach(([groupName, items]) => {
    shelves.push(buildShelf(groupName, items));
  });

  if (!shelves.length) {
    shelves.push(buildShelf("Library", base));
  }

  return shelves;
}

function renderShelves() {
  ui.shelfContainer.innerHTML = "";
  const shelves = computeShelves();
  const fragment = document.createDocumentFragment();
  shelves.forEach((shelf, shelfIndex) => {
    const shelfEl = document.createElement("div");
    shelfEl.className = "shelf";
    const shelfTitle = document.createElement("div");
    shelfTitle.className = "shelf-title";
    const titleText = document.createElement("span");
    titleText.className = "shelf-text";
    titleText.textContent = shelf.title;
    const badge = document.createElement("span");
    badge.className = "shelf-count";
    badge.textContent = shelf.badge;
    shelfTitle.appendChild(titleText);
    shelfTitle.appendChild(badge);
    const actions = document.createElement("div");
    actions.className = "shelf-actions";
    if (shelf.id === "suggested") {
      const action = document.createElement("button");
      action.type = "button";
      action.className = "btn btn-ghost icon-btn shelf-action";
      setButtonIcon(action, "shuffle", "Shuffle");
      action.addEventListener("click", (event) => {
        event.stopPropagation();
        shuffleSuggested();
      });
      actions.appendChild(action);
    }
    if (shelf.id === "trending") {
      const toggle = document.createElement("div");
      toggle.className = "trend-toggle";
      const todayBtn = document.createElement("button");
      todayBtn.type = "button";
      todayBtn.textContent = "Today";
      todayBtn.className = trendingWindow === "day" ? "active" : "";
      todayBtn.addEventListener("click", () => setTrendingWindow("day"));
      const weekBtn = document.createElement("button");
      weekBtn.type = "button";
      weekBtn.textContent = "This Week";
      weekBtn.className = trendingWindow === "week" ? "active" : "";
      weekBtn.addEventListener("click", () => setTrendingWindow("week"));
      toggle.appendChild(todayBtn);
      toggle.appendChild(weekBtn);
      actions.appendChild(toggle);
    }
    if (actions.children.length) {
      shelfTitle.appendChild(actions);
    }
    shelfEl.appendChild(shelfTitle);

    const row = document.createElement("div");
    row.className = "card-row";

    shelf.items.forEach((item, index) => {
      row.appendChild(buildCard(item, index + shelfIndex));
    });

    shelfEl.appendChild(row);
    fragment.appendChild(shelfEl);
  });
  ui.shelfContainer.appendChild(fragment);
}

function computeUpNext() {
  const base = sortItems(state.filtered);
  if (!base.length) {
    return [];
  }
  if (!state.selected) {
    return base.slice(0, 6);
  }
  const index = base.findIndex((item) => item.id === state.selected.id);
  const next = [];
  for (let i = index + 1; i < base.length && next.length < 6; i += 1) {
    next.push(base[i]);
  }
  for (let i = 0; i < base.length && next.length < 6; i += 1) {
    if (base[i].id !== state.selected.id) {
      next.push(base[i]);
    }
  }
  return next;
}

function renderUpNext() {
  ui.upNextRow.innerHTML = "";
  const nextItems = computeUpNext();
  if (!nextItems.length) {
    ui.upNextMeta.textContent = "Autoplay: off";
    return;
  }
  ui.upNextMeta.textContent = `Autoplay: ${
    state.autoplayEnabled ? "on" : "off"
  }`;
  const fragment = document.createDocumentFragment();
  nextItems.forEach((item, index) => {
    fragment.appendChild(buildCard(item, index));
  });
  ui.upNextRow.appendChild(fragment);
}

function buildCard(item, index) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.id = item.id;
  if (state.selected && state.selected.id === item.id) {
    card.classList.add("selected");
  }
  card.style.animationDelay = `${index * 0.04}s`;

  const poster = document.createElement("div");
  poster.className = "card-poster";
  if (item.poster) {
    poster.style.backgroundImage = `url(${item.poster})`;
    poster.style.backgroundSize = "cover";
    poster.style.backgroundPosition = "center";
    poster.textContent = "";
  } else {
    poster.textContent = item.title.slice(0, 1).toUpperCase();
  }

  const rating = getRatingFor(item);
  if (Number.isFinite(rating)) {
    const badge = document.createElement("div");
    badge.className = "rating-badge";
    const percent = Math.round((rating / 5) * 100);
    badge.style.setProperty("--rating", `${percent}%`);
    const text = document.createElement("span");
    text.textContent = `${percent}%`;
    badge.appendChild(text);
    poster.appendChild(badge);
  }

  const actions = document.createElement("div");
  actions.className = "card-actions";
  const likeBtn = document.createElement("button");
  likeBtn.type = "button";
  likeBtn.className = "btn btn-ghost icon-btn card-reaction like";
  const dislikeBtn = document.createElement("button");
  dislikeBtn.type = "button";
  dislikeBtn.className = "btn btn-ghost icon-btn card-reaction dislike";
  const favBtn = document.createElement("button");
  favBtn.type = "button";
  favBtn.className = "btn btn-ghost icon-btn card-favorite";
  updateReactionButtons(likeBtn, dislikeBtn, item);
  updateFavoriteButton(favBtn, item);
  likeBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleLike(item);
  });
  dislikeBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleDislike(item);
  });
  favBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(item).catch(() => {});
  });
  actions.appendChild(likeBtn);
  actions.appendChild(dislikeBtn);
  actions.appendChild(favBtn);
  poster.appendChild(actions);

  const progress = getProgressFor(item);
  const ratio = progressRatio(progress);
  if (ratio > 0.01) {
    const bar = document.createElement("div");
    bar.className = "progress";
    const fill = document.createElement("span");
    fill.style.width = `${Math.round(ratio * 100)}%`;
    bar.appendChild(fill);
  poster.appendChild(bar);
  }

  const title = document.createElement("div");
  title.className = "card-title";
  title.textContent = item.title;

  const meta = document.createElement("div");
  meta.className = "card-meta";
  const metaParts = [];
  metaParts.push(item.type === "local" ? formatSize(item.size) : "Stream");
  if (item.ext) {
    metaParts.push(item.ext.replace(".", "").toUpperCase());
  }
  if (progress && progress.lastPlayedAt) {
    metaParts.push(`Played ${formatRelativeTime(progress.lastPlayedAt)}`);
  }
  meta.textContent = metaParts.join(" | ");

  card.appendChild(poster);
  card.appendChild(title);
  card.appendChild(meta);

  card.addEventListener("click", (event) => {
    if (event.target.closest(".card-actions")) {
      return;
    }
    selectItem(item);
  });
  return card;
}

function updateMeta() {
  const count = state.items.length;
  const groups = new Set(state.items.map((item) => item.group || "Library"));
  ui.libraryMeta.textContent = `${count} titles - ${groups.size} shelves`;
  ui.configPath.textContent = state.localPath || "media.config.json";
  ui.refreshMeta.textContent = `Last scan: ${state.refreshedAt || "never"}`;
}

function updateFiltersOptions() {
  const groups = new Set(state.items.map((item) => item.group || "Library"));
  const exts = new Set(state.items.map((item) => item.ext || "stream"));
  populateSelect(ui.groupFilter, ["all", ...Array.from(groups).sort()]);
  populateSelect(ui.extFilter, ["all", ...Array.from(exts).sort()]);
}

function populateSelect(select, values) {
  const current = select.value;
  select.innerHTML = "";
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value === "all" ? "All" : value;
    select.appendChild(option);
  });
  if (values.includes(current)) {
    select.value = current;
  }
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

function hashString(value) {
  let hash = 0;
  const text = String(value || "");
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getProfileColor(profile) {
  if (profile && profile.color) {
    return profile.color;
  }
  const seed = profile ? profile.id || profile.name : "profile";
  return PROFILE_COLORS[hashString(seed) % PROFILE_COLORS.length];
}

function getProfileAvatarUrl(profile) {
  if (!profile || !profile.avatar) {
    return null;
  }
  return avatarUrlMap.get(profile.avatar) || null;
}

function getProfileInitial(profile) {
  const name = profile && profile.name ? profile.name.trim() : "Profile";
  return name ? name.slice(0, 1).toUpperCase() : "P";
}

function buildProfileAvatar(profile, large) {
  const avatar = document.createElement("div");
  avatar.className = `profile-avatar${large ? " large" : ""}`;
  const imageUrl = getProfileAvatarUrl(profile);
  if (imageUrl) {
    avatar.classList.add("has-image");
    avatar.style.backgroundImage = `url("${imageUrl}")`;
    avatar.style.backgroundColor = "transparent";
    avatar.textContent = "";
  } else {
    avatar.style.backgroundImage = "";
    avatar.style.backgroundColor = getProfileColor(profile);
    avatar.textContent = getProfileInitial(profile);
  }
  return avatar;
}

function buildAvatarChoice(preset, active) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "avatar-choice";
  button.setAttribute("aria-label", preset.label);
  button.setAttribute("title", preset.label);
  button.dataset.avatar = preset.id;
  button.style.backgroundImage = `url("${avatarUrlMap.get(preset.id)}")`;
  if (active) {
    button.classList.add("active");
  }
  return button;
}

function buildInitialsChoice(active) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "avatar-choice initials";
  button.dataset.avatar = "initials";
  button.textContent = "Aa";
  if (active) {
    button.classList.add("active");
  }
  return button;
}

function renderAvatarGrid(container, selectedId, onSelect) {
  if (!container) {
    return;
  }
  container.innerHTML = "";
  const initialActive = !selectedId;
  const initialsBtn = buildInitialsChoice(initialActive);
  initialsBtn.addEventListener("click", () => onSelect(""));
  container.appendChild(initialsBtn);
  AVATAR_PRESETS.forEach((preset) => {
    const btn = buildAvatarChoice(preset, preset.id === selectedId);
    btn.addEventListener("click", () => onSelect(preset.id));
    container.appendChild(btn);
  });
}

function updateProfileToggle() {
  if (!ui.profileAvatar) {
    return;
  }
  const profile = state.profiles.find(
    (entry) => entry.id === state.activeProfileId
  );
  const imageUrl = getProfileAvatarUrl(profile);
  if (imageUrl) {
    ui.profileAvatar.classList.add("has-image");
    ui.profileAvatar.style.backgroundImage = `url("${imageUrl}")`;
    ui.profileAvatar.style.backgroundColor = "transparent";
    ui.profileAvatar.textContent = "";
  } else {
    ui.profileAvatar.classList.remove("has-image");
    ui.profileAvatar.style.backgroundImage = "";
    ui.profileAvatar.style.backgroundColor = getProfileColor(profile);
    ui.profileAvatar.textContent = getProfileInitial(profile);
  }
}

function renderProfileMenu() {
  if (!ui.profileList) {
    return;
  }
  ui.profileList.innerHTML = "";
  state.profiles.forEach((profile) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "profile-item";
    if (profile.id === state.activeProfileId) {
      button.classList.add("active");
    }
    const avatar = buildProfileAvatar(profile, false);
    const name = document.createElement("span");
    name.textContent = profile.name || "Profile";
    button.appendChild(avatar);
    button.appendChild(name);
    button.addEventListener("click", () => {
      setActiveProfile(profile.id).catch(() => {});
      setProfileMenuOpen(false);
    });
    ui.profileList.appendChild(button);
  });
}

function renderProfileEditor() {
  if (!ui.profileEditList) {
    return;
  }
  ui.profileEditList.innerHTML = "";
  state.profiles.forEach((profile) => {
    const row = document.createElement("div");
    row.className = "profile-row";
    if (profile.id === state.activeProfileId) {
      row.classList.add("active");
    }
    row.dataset.id = profile.id;
    row.dataset.avatar = profile.avatar || "";

    const avatar = buildProfileAvatar(profile, false);
    const name = document.createElement("input");
    name.type = "text";
    name.value = profile.name || "Profile";
    name.className = "profile-name-input";
    const color = document.createElement("input");
    color.type = "color";
    color.value = getProfileColor(profile);
    color.className = "profile-color-input";

    const updateAvatar = () => {
      const avatarId = row.dataset.avatar;
      const imageUrl = avatarId ? avatarUrlMap.get(avatarId) : null;
      if (imageUrl) {
        avatar.classList.add("has-image");
        avatar.style.backgroundImage = `url("${imageUrl}")`;
        avatar.style.backgroundColor = "transparent";
        avatar.textContent = "";
      } else {
        avatar.classList.remove("has-image");
        avatar.style.backgroundImage = "";
        avatar.textContent = name.value.trim()
          ? name.value.trim().slice(0, 1).toUpperCase()
          : "P";
        avatar.style.backgroundColor = color.value;
      }
    };
    name.addEventListener("input", updateAvatar);
    color.addEventListener("input", updateAvatar);

    row.appendChild(avatar);
    row.appendChild(name);
    row.appendChild(color);
    const avatarToggle = document.createElement("button");
    avatarToggle.type = "button";
    avatarToggle.className = "btn btn-ghost icon-btn profile-avatar-btn";
    avatarToggle.setAttribute("aria-label", "Change avatar");
    avatarToggle.setAttribute("title", "Change avatar");
    avatarToggle.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16M7 7a2 2 0 1 0 4 0M4 17h16M13 17a2 2 0 1 1 4 0M4 12h16M9 12a2 2 0 1 1 4 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
      </svg>
      <span class="sr-only">Change avatar</span>
    `;
    avatarToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      row.classList.toggle("open");
    });
    row.appendChild(avatarToggle);
    if (state.profiles.length > 1) {
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "btn btn-ghost icon-btn profile-delete";
      deleteBtn.setAttribute("aria-label", "Delete profile");
      deleteBtn.setAttribute("title", "Delete profile");
      deleteBtn.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 7h14M9 7V5h6v2M8 7l1 11h6l1-11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
        </svg>
        <span class="sr-only">Delete profile</span>
      `;
      deleteBtn.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        deleteProfile(profile.id).catch(() => {});
      });
      row.appendChild(deleteBtn);
    }
    const picker = document.createElement("div");
    picker.className = "avatar-picker";
    renderAvatarGrid(picker, profile.avatar || "", (avatarId) => {
      row.dataset.avatar = avatarId;
      row.classList.add("open");
      updateAvatar();
      picker
        .querySelectorAll(".avatar-choice")
        .forEach((btn) => btn.classList.remove("active"));
      const activeBtn = picker.querySelector(
        `[data-avatar="${avatarId || "initials"}"]`
      );
      if (activeBtn) {
        activeBtn.classList.add("active");
      }
      updateProfile(profile.id, { avatar: avatarId }).catch(() => {});
    });
    row.appendChild(picker);
    ui.profileEditList.appendChild(row);
  });
}

function updateProfiles() {
  renderProfileMenu();
  renderProfileEditor();
  updateProfileToggle();
  updateProfileAddPreview();
  updateMobileProfile();
}

let profileMenuOpen = false;

function setProfileMenuOpen(open) {
  if (!ui.profileDropdown) {
    return;
  }
  profileMenuOpen = Boolean(open);
  ui.profileDropdown.hidden = !profileMenuOpen;
  if (ui.profileToggle) {
    ui.profileToggle.classList.toggle("open", profileMenuOpen);
  }
}

function toggleProfileMenu() {
  setProfileMenuOpen(!profileMenuOpen);
}

let mobileNavOpen = false;

function setMobileNavOpen(open) {
  if (!ui.mobileNav) {
    return;
  }
  mobileNavOpen = Boolean(open);
  if (mobileNavOpen) {
    ui.mobileNav.hidden = false;
    if (ui.mobileSearchInput && ui.searchInput) {
      ui.mobileSearchInput.value = ui.searchInput.value;
    }
    requestAnimationFrame(() => ui.mobileNav.classList.add("open"));
    document.body.classList.add("nav-open");
  } else {
    ui.mobileNav.classList.remove("open");
    document.body.classList.remove("nav-open");
    setTimeout(() => {
      if (!ui.mobileNav.classList.contains("open")) {
        ui.mobileNav.hidden = true;
      }
    }, 200);
  }
}

function toggleMobileNav() {
  setMobileNavOpen(!mobileNavOpen);
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";
  if (window.location.protocol !== "https:" && !isLocalhost) {
    return;
  }
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}

function updateProfileAddPreview() {
  if (!ui.profileAddAvatar || !ui.profileAddColor || !ui.profileAddName) {
    return;
  }
  const name = ui.profileAddName.value.trim();
  const avatarId = ui.profileAddAvatar.dataset.avatar || "";
  const imageUrl = avatarId ? avatarUrlMap.get(avatarId) : null;
  if (imageUrl) {
    ui.profileAddAvatar.classList.add("has-image");
    ui.profileAddAvatar.style.backgroundImage = `url("${imageUrl}")`;
    ui.profileAddAvatar.style.backgroundColor = "transparent";
    ui.profileAddAvatar.textContent = "";
  } else {
    ui.profileAddAvatar.classList.remove("has-image");
    ui.profileAddAvatar.style.backgroundImage = "";
    ui.profileAddAvatar.textContent = name
      ? name.slice(0, 1).toUpperCase()
      : "+";
    ui.profileAddAvatar.style.backgroundColor = ui.profileAddColor.value;
  }
}

function updateMobileProfile() {
  if (!ui.mobileProfileAvatar || !ui.mobileProfileName) {
    return;
  }
  const profile = state.profiles.find(
    (entry) => entry.id === state.activeProfileId
  );
  const imageUrl = getProfileAvatarUrl(profile);
  if (imageUrl) {
    ui.mobileProfileAvatar.classList.add("has-image");
    ui.mobileProfileAvatar.style.backgroundImage = `url("${imageUrl}")`;
    ui.mobileProfileAvatar.style.backgroundColor = "transparent";
    ui.mobileProfileAvatar.textContent = "";
  } else {
    ui.mobileProfileAvatar.classList.remove("has-image");
    ui.mobileProfileAvatar.style.backgroundImage = "";
    ui.mobileProfileAvatar.style.backgroundColor = getProfileColor(profile);
    ui.mobileProfileAvatar.textContent = getProfileInitial(profile);
  }
  ui.mobileProfileName.textContent = profile ? profile.name : "Profile";
}

function setAddAvatar(avatarId) {
  if (!ui.profileAddAvatar) {
    return;
  }
  ui.profileAddAvatar.dataset.avatar = avatarId || "";
  updateProfileAddPreview();
  if (!ui.profileAvatarGrid) {
    return;
  }
  ui.profileAvatarGrid
    .querySelectorAll(".avatar-choice")
    .forEach((btn) => btn.classList.remove("active"));
  const selector = avatarId ? `[data-avatar="${avatarId}"]` : '[data-avatar="initials"]';
  const activeBtn = ui.profileAvatarGrid.querySelector(selector);
  if (activeBtn) {
    activeBtn.classList.add("active");
  }
}

function initProfileAvatarGrid() {
  if (!ui.profileAvatarGrid) {
    return;
  }
  if (ui.profileAddAvatar) {
    ui.profileAddAvatar.dataset.avatar = "";
  }
  renderAvatarGrid(ui.profileAvatarGrid, "", (avatarId) => {
    setAddAvatar(avatarId);
  });
}

function openProfileDialog() {
  if (!ui.profileDialog) {
    return;
  }
  renderProfileEditor();
  ui.profileDialog.showModal();
}

function closeProfileDialog() {
  if (ui.profileDialog) {
    ui.profileDialog.close();
  }
}

function openAddProfileDialog() {
  if (!ui.addProfileDialog) {
    return;
  }
  if (ui.profileAddAvatar && !ui.profileAddAvatar.dataset.avatar) {
    ui.profileAddAvatar.dataset.avatar = "";
  }
  setAddAvatar(ui.profileAddAvatar ? ui.profileAddAvatar.dataset.avatar : "");
  updateProfileAddPreview();
  ui.addProfileDialog.showModal();
}

function closeAddProfileDialog() {
  if (ui.addProfileDialog) {
    ui.addProfileDialog.close();
  }
}

async function saveProfileEdits() {
  if (!ui.profileEditList) {
    return;
  }
  const rows = Array.from(ui.profileEditList.querySelectorAll(".profile-row"));
  const updates = [];
  rows.forEach((row) => {
    const id = row.dataset.id;
    const nameInput = row.querySelector(".profile-name-input");
    const colorInput = row.querySelector(".profile-color-input");
    const name = nameInput ? nameInput.value.trim() : "";
    const color = colorInput ? colorInput.value : "";
    const avatar = row.dataset.avatar || "";
    const current = state.profiles.find((profile) => profile.id === id);
    if (!current) {
      return;
    }
    const nextName = name || current.name || "Profile";
    const nextColor = color || current.color;
    const nextAvatar = avatar || "";
    if (
      nextName !== current.name ||
      nextColor !== current.color ||
      nextAvatar !== (current.avatar || "")
    ) {
      updates.push({ id, name: nextName, color: nextColor, avatar: nextAvatar });
    }
  });
  if (!updates.length) {
    closeProfileDialog();
    return;
  }
  for (const update of updates) {
    await fetch("/api/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update)
    });
  }
  await loadAll();
  closeProfileDialog();
}

async function deleteProfile(id) {
  if (!id) {
    return;
  }
  if (!window.confirm("Delete this profile?")) {
    return;
  }
  const response = await fetch("/api/profile/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    window.alert(body.error || "Failed to delete profile.");
    return;
  }
  await loadAll();
}

function renderRatingButtons(item) {
  ui.ratingStars.innerHTML = "";
  if (!item) {
    return;
  }
  const current = getRatingFor(item) || 0;
  for (let i = 1; i <= 5; i += 1) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = String(i);
    if (current >= i - 0.1) {
      btn.classList.add("active");
    }
    btn.addEventListener("click", () => {
      const next = current >= i - 0.1 ? 0 : i;
      setRating(item, next).catch(() => {});
    });
    ui.ratingStars.appendChild(btn);
  }
  const clearBtn = document.createElement("button");
  clearBtn.type = "button";
  clearBtn.textContent = "Clear";
  clearBtn.addEventListener("click", () => {
    setRating(item, 0).catch(() => {});
  });
  ui.ratingStars.appendChild(clearBtn);
}

function fillMetadataForm(item) {
  ui.metaTitle.value = item && item.title ? item.title : "";
  ui.metaYear.value = item && item.year ? item.year : "";
  ui.metaRating.value = item && item.rating ? item.rating : "";
  ui.metaTags.value = item && item.tags ? item.tags.join(", ") : "";
  ui.metaSynopsis.value = item && item.synopsis ? item.synopsis : "";
}

function readMetadataForm() {
  return {
    title: ui.metaTitle.value.trim(),
    year: ui.metaYear.value ? Number(ui.metaYear.value) : null,
    rating: ui.metaRating.value ? Number(ui.metaRating.value) : null,
    tags: ui.metaTags.value,
    synopsis: ui.metaSynopsis.value.trim()
  };
}

function render() {
  applyFilters();
  updateMeta();
  const heroItem =
    state.selected && state.filtered.some((item) => item.id === state.selected.id)
      ? state.selected
      : state.filtered[0];
  setHero(heroItem);
  renderShelves();
  renderUpNext();
}

function scheduleRender(delay = 0) {
  if (renderTimer) {
    clearTimeout(renderTimer);
  }
  renderTimer = setTimeout(() => {
    renderTimer = null;
    requestAnimationFrame(() => render());
  }, delay);
}

async function fetchLibrary() {
  const response = await fetch("/api/library");
  return response.json();
}

async function fetchState() {
  const response = await fetch("/api/state");
  return response.json();
}

async function loadAll() {
  const selectedId = state.selected ? state.selected.id : null;
  const storedId = localStorage.getItem(STORAGE_SELECTED_KEY);
  const [libraryData, stateData] = await Promise.all([
    fetchLibrary(),
    fetchState()
  ]);
  state.items = libraryData.items || [];
  buildIndex(state.items);
  state.localPath = libraryData.localPath;
  state.refreshedAt = libraryData.refreshedAt;
  state.profiles = stateData.profiles || [];
  state.activeProfileId = stateData.activeProfileId;
  state.progress = stateData.progress || {};
  state.ratings = stateData.ratings || {};
  state.favorites = stateData.favorites || {};
  state.reactions = stateData.reactions || {};
  state.posters = stateData.posters || {};
  state.selected = selectedId && state.itemsById.has(selectedId)
    ? state.itemsById.get(selectedId)
    : storedId && state.itemsById.has(storedId)
      ? state.itemsById.get(storedId)
      : null;
  if (!state.selected && !hasAutoPicked) {
    const randomItem = pickRandomItem(state.items);
    if (randomItem) {
      hasAutoPicked = true;
      state.selected = randomItem;
      localStorage.setItem(STORAGE_SELECTED_KEY, randomItem.id);
    }
  }
  updateProfiles();
  updateFiltersOptions();
  render();
  if (state.selected) {
    setPlayer(state.selected, { autoplay: false });
    renderRatingButtons(state.selected);
    queueScrollToSelected(state.selected.id);
  }
  updatePlayState();
  if (state.selected) {
    queueScrollToPlayer();
  }
  ui.pipBtn.disabled = !document.pictureInPictureEnabled;
  updateAutoplayUi();
}

async function refreshLibrary() {
  if (ui.refreshBtn) {
    ui.refreshBtn.disabled = true;
    ui.refreshBtn.classList.add("loading");
    ui.refreshBtn.setAttribute("aria-busy", "true");
  }
  await fetch("/api/refresh", { method: "POST" });
  await loadAll();
  if (ui.refreshBtn) {
    ui.refreshBtn.classList.remove("loading");
    ui.refreshBtn.removeAttribute("aria-busy");
    ui.refreshBtn.disabled = false;
  }
}

async function setActiveProfile(id) {
  await fetch("/api/profile/active", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
  await loadAll();
}

async function createProfile(name, color, avatar) {
  const trimmed = String(name || "").trim();
  if (!trimmed) {
    return false;
  }
  const response = await fetch("/api/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: trimmed, color, avatar })
  });
  if (!response.ok) {
    return false;
  }
  await loadAll();
  return true;
}

async function updateProfile(id, updates) {
  if (!id) {
    return false;
  }
  const response = await fetch("/api/profile/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...updates })
  });
  if (!response.ok) {
    return false;
  }
  await loadAll();
  return true;
}

async function uploadPoster(item, file) {
  const form = new FormData();
  form.append("poster", file);
  await fetch(`/api/poster?id=${encodeURIComponent(item.id)}`, {
    method: "POST",
    body: form
  });
  await loadAll();
}

async function clearPoster(item) {
  await fetch(`/api/poster/${encodeURIComponent(item.id)}`, {
    method: "DELETE"
  });
  await loadAll();
}

async function setRating(item, rating) {
  await fetch("/api/rating", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: item.id,
      rating,
      profileId: state.activeProfileId
    })
  });
  const profileId = state.activeProfileId;
  if (profileId) {
    if (!state.ratings[profileId]) {
      state.ratings[profileId] = {};
    }
    if (!rating) {
      delete state.ratings[profileId][item.id];
    } else {
      state.ratings[profileId][item.id] = rating;
    }
  }
  scheduleRender();
  const updatedItem = state.itemsById.get(item.id) || item;
  renderRatingButtons(updatedItem);
  if (state.selected && state.selected.id === item.id) {
    setHero(updatedItem);
  }
}

async function toggleFavorite(item) {
  if (!item) {
    return;
  }
  const profileId = state.activeProfileId;
  if (!profileId) {
    return;
  }
  const active = isFavorite(item);
  await fetch("/api/favorite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: item.id,
      favorite: !active,
      profileId
    })
  });
  if (!state.favorites[profileId]) {
    state.favorites[profileId] = {};
  }
  if (active) {
    delete state.favorites[profileId][item.id];
  } else {
    state.favorites[profileId][item.id] = true;
  }
  scheduleRender();
  if (state.selected && state.selected.id === item.id) {
    updateFavoriteButton(ui.heroFavorite, item);
  }
}

async function setReaction(item, reaction) {
  if (!item) {
    return;
  }
  const profileId = state.activeProfileId;
  if (!profileId) {
    return;
  }
  await fetch("/api/reaction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: item.id,
      reaction,
      profileId
    })
  });
  if (!state.reactions[profileId]) {
    state.reactions[profileId] = {};
  }
  if (!reaction) {
    delete state.reactions[profileId][item.id];
  } else {
    state.reactions[profileId][item.id] = reaction;
  }
  scheduleRender();
  if (state.selected && state.selected.id === item.id) {
    updateReactionButtons(ui.heroLike, ui.heroDislike, item);
  }
}

function toggleLike(item) {
  const reaction = getReaction(item);
  const next = reaction === 1 ? 0 : 1;
  setReaction(item, next).catch(() => {});
}

function toggleDislike(item) {
  const reaction = getReaction(item);
  const next = reaction === -1 ? 0 : -1;
  setReaction(item, next).catch(() => {});
}

async function saveMetadata(item, meta, clearOnly) {
  const payload = clearOnly ? { id: item.id } : { id: item.id, ...meta };
  await fetch("/api/metadata", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  await loadAll();
}

async function sendProgress(force) {
  if (!state.selected) {
    return;
  }
  const duration = ui.player.duration;
  if (!Number.isFinite(duration) || duration <= 0) {
    return;
  }
  const now = Date.now();
  if (!force && now - lastProgressSentAt < 15000) {
    return;
  }
  lastProgressSentAt = now;
  const payload = {
    id: state.selected.id,
    position: ui.player.currentTime,
    duration,
    profileId: state.activeProfileId
  };
  const profileId = state.activeProfileId;
  if (profileId) {
    if (!state.progress[profileId]) {
      state.progress[profileId] = {};
    }
    state.progress[profileId][state.selected.id] = {
      id: state.selected.id,
      position: payload.position,
      duration: payload.duration,
      lastPlayedAt: new Date().toISOString()
    };
  }
  await fetch("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (force) {
    scheduleRender();
  }
}

function setMuted(muted) {
  ui.player.muted = muted;
  updateVolumeIcon();
  updateVolumeFill();
}

function togglePlay() {
  if (ui.player.paused) {
    ui.player.play().catch(() => {});
  } else {
    ui.player.pause();
  }
}

function toggleSubtitles() {
  subtitlesEnabled = !subtitlesEnabled;
  const tracks = Array.from(ui.player.textTracks || []);
  tracks.forEach((track) => {
    track.mode = subtitlesEnabled ? "showing" : "disabled";
  });
  updateSubtitlesUi();
}

function updateSubtitlesUi() {
  setButtonIcon(
    ui.subsToggle,
    subtitlesEnabled ? "subs" : "subsOff",
    subtitlesEnabled ? "Subtitles on" : "Subtitles off"
  );
}

async function togglePiP() {
  if (!document.pictureInPictureEnabled) {
    return;
  }
  if (document.pictureInPictureElement) {
    await document.exitPictureInPicture();
  } else {
    await ui.player.requestPictureInPicture();
  }
}

function toggleTheater() {
  document.body.classList.toggle("theater");
}

async function toggleFullscreen() {
  if (document.fullscreenElement) {
    await document.exitFullscreen();
    return;
  }
  await ui.playerShell.requestFullscreen();
}

function updateAutoplayUi() {
  ui.autoplayToggle.classList.toggle("active", state.autoplayEnabled);
  ui.upNextMeta.textContent = `Autoplay: ${
    state.autoplayEnabled ? "on" : "off"
  }`;
  setButtonIcon(
    ui.autoplayToggle,
    "autoplay",
    `Autoplay ${state.autoplayEnabled ? "on" : "off"}`
  );
}

function toggleFiltersPanel() {
  ui.filtersPanel.classList.toggle("open");
  ui.filtersToggle.classList.toggle("active");
}

function toggleAdvancedControls() {
  ui.advancedControls.classList.toggle("open");
  if (ui.controlsToggle) {
    ui.controlsToggle.classList.toggle("active");
  }
  if (ui.settingsToggle) {
    ui.settingsToggle.classList.toggle("active");
  }
  showFullscreenControls();
}

function toggleAutoplay() {
  state.autoplayEnabled = !state.autoplayEnabled;
  localStorage.setItem("cinema.autoplay", String(state.autoplayEnabled));
  updateAutoplayUi();
}

function playNext() {
  const nextItems = computeUpNext();
  if (nextItems.length) {
    selectItem(nextItems[0]);
  }
}

function playPrevious() {
  const list = sortItems(state.filtered);
  if (!list.length) {
    return;
  }
  if (!state.selected) {
    selectItem(list[0]);
    return;
  }
  const index = list.findIndex((item) => item.id === state.selected.id);
  const prevIndex = index > 0 ? index - 1 : list.length - 1;
  selectItem(list[prevIndex]);
}

function handleKeyboard(event) {
  if (
    event.target &&
    ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)
  ) {
    return;
  }
  if (event.code === "Space") {
    event.preventDefault();
    togglePlay();
  }
  if (event.code === "ArrowRight") {
    ui.player.currentTime = Math.min(
      ui.player.duration || 0,
      ui.player.currentTime + 10
    );
  }
  if (event.code === "ArrowLeft") {
    ui.player.currentTime = Math.max(0, ui.player.currentTime - 10);
  }
  if (event.code === "ArrowUp") {
    ui.player.volume = Math.min(1, ui.player.volume + 0.05);
    ui.volumeSlider.value = ui.player.volume;
  }
  if (event.code === "ArrowDown") {
    ui.player.volume = Math.max(0, ui.player.volume - 0.05);
    ui.volumeSlider.value = ui.player.volume;
  }
  if (event.key.toLowerCase() === "m") {
    setMuted(!ui.player.muted);
  }
  if (event.key.toLowerCase() === "f") {
    toggleFullscreen().catch(() => {});
  }
}

function selectItem(item, options = {}) {
  state.selected = item;
  localStorage.setItem(STORAGE_SELECTED_KEY, item.id);
  setHero(item);
  setPlayer(item, options);
  renderRatingButtons(item);
  document.querySelectorAll(".card").forEach((card) => {
    card.classList.toggle("selected", card.dataset.id === item.id);
  });
  renderUpNext();
  queueScrollToSelected(item.id);
  if (options.scrollToPlayer !== false) {
    queueScrollToPlayer();
  }
}

function applyDroppedMetadata(text) {
  try {
    const parsed = JSON.parse(text);
    const data = {
      title: parsed.title || "",
      year: parsed.year || "",
      rating: parsed.rating || "",
      tags: Array.isArray(parsed.tags)
        ? parsed.tags.join(", ")
        : parsed.tags || parsed.genres || parsed.genre || "",
      synopsis: parsed.synopsis || ""
    };
    ui.metaTitle.value = data.title;
    ui.metaYear.value = data.year;
    ui.metaRating.value = data.rating;
    ui.metaTags.value = data.tags;
    ui.metaSynopsis.value = data.synopsis;
    ui.metadataDrop.textContent = "Metadata loaded. Review and save.";
  } catch {
    ui.metadataDrop.textContent = "Invalid JSON. Drop a valid metadata file.";
  }
}

ui.searchInput.addEventListener("input", () => scheduleRender(120));
ui.searchInput.addEventListener("search", () => scheduleRender());
ui.searchInput.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    moveSearchSelection(1);
    return;
  }
  if (event.key === "ArrowUp") {
    event.preventDefault();
    moveSearchSelection(-1);
    return;
  }
  if (event.key === "Enter") {
    event.preventDefault();
    if (!applySearchSelection()) {
      scheduleRender();
      hideSearchSuggestions();
    }
  }
});
if (ui.searchBtn) {
  ui.searchBtn.addEventListener("click", () => {
    scheduleRender();
    ui.searchInput.focus();
  });
}
ui.searchInput.addEventListener("input", () => {
  updateSearchSuggestions();
});
ui.searchInput.addEventListener("focus", () => {
  updateSearchSuggestions();
});
document.addEventListener("click", (event) => {
  const searchWrap = ui.searchInput ? ui.searchInput.closest(".search") : null;
  if (searchWrap && searchWrap.contains(event.target)) {
    return;
  }
  hideSearchSuggestions();
});
document.addEventListener("click", (event) => {
  if (!profileMenuOpen || !ui.profileDropdown || !ui.profileToggle) {
    return;
  }
  if (
    ui.profileDropdown.contains(event.target) ||
    ui.profileToggle.contains(event.target)
  ) {
    return;
  }
  setProfileMenuOpen(false);
});
ui.typeFilter.addEventListener("change", () => scheduleRender());
ui.groupFilter.addEventListener("change", () => scheduleRender());
ui.extFilter.addEventListener("change", () => scheduleRender());
ui.sortFilter.addEventListener("change", () => scheduleRender());

ui.filtersToggle.addEventListener("click", () => {
  toggleFiltersPanel();
});

if (ui.refreshBtn) {
  ui.refreshBtn.addEventListener("click", () => {
    refreshLibrary().catch(() => {});
  });
}

if (ui.profileToggle) {
  ui.profileToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleProfileMenu();
  });
}

if (ui.profileManageBtn) {
  ui.profileManageBtn.addEventListener("click", () => {
    setProfileMenuOpen(false);
    openProfileDialog();
  });
}

if (ui.profileAddBtn) {
  ui.profileAddBtn.addEventListener("click", () => {
    setProfileMenuOpen(false);
    openAddProfileDialog();
    if (ui.profileAddName) {
      ui.profileAddName.focus();
    }
  });
}

if (ui.profileAddName) {
  ui.profileAddName.addEventListener("input", () => {
    updateProfileAddPreview();
  });
}

if (ui.profileAddColor) {
  ui.profileAddColor.addEventListener("input", () => {
    updateProfileAddPreview();
  });
}

if (ui.profileAddConfirm) {
  ui.profileAddConfirm.addEventListener("click", async () => {
    if (!ui.profileAddName || !ui.profileAddColor) {
      return;
    }
    const avatarId =
      ui.profileAddAvatar && ui.profileAddAvatar.dataset.avatar
        ? ui.profileAddAvatar.dataset.avatar
        : "";
    const created = await createProfile(
      ui.profileAddName.value,
      ui.profileAddColor.value,
      avatarId
    );
    if (created) {
      ui.profileAddName.value = "";
      if (ui.profileAddAvatar) {
        ui.profileAddAvatar.dataset.avatar = "";
      }
      setAddAvatar("");
      updateProfileAddPreview();
      closeAddProfileDialog();
    }
  });
}

if (ui.profileDialogClose) {
  ui.profileDialogClose.addEventListener("click", () => {
    closeProfileDialog();
  });
}
if (ui.addProfileClose) {
  ui.addProfileClose.addEventListener("click", () => {
    closeAddProfileDialog();
  });
}

if (ui.profileSave) {
  ui.profileSave.addEventListener("click", () => {
    saveProfileEdits().catch(() => {});
  });
}

if (ui.mobileMenuToggle) {
  ui.mobileMenuToggle.addEventListener("click", () => {
    toggleMobileNav();
  });
}
if (ui.mobileNavScrim) {
  ui.mobileNavScrim.addEventListener("click", () => {
    setMobileNavOpen(false);
  });
}
if (ui.mobileNavClose) {
  ui.mobileNavClose.addEventListener("click", () => {
    setMobileNavOpen(false);
  });
}
if (ui.mobileNavLinks && ui.mobileNavLinks.length) {
  ui.mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setNavFilter(link.dataset.nav || "home");
      setMobileNavOpen(false);
    });
  });
}
if (ui.mobileSearchInput) {
  ui.mobileSearchInput.addEventListener("input", () => {
    if (ui.searchInput) {
      ui.searchInput.value = ui.mobileSearchInput.value;
    }
    scheduleRender(120);
  });
}
if (ui.mobileManageProfiles) {
  ui.mobileManageProfiles.addEventListener("click", () => {
    setMobileNavOpen(false);
    openProfileDialog();
  });
}
if (ui.mobileAddProfile) {
  ui.mobileAddProfile.addEventListener("click", () => {
    setMobileNavOpen(false);
    openAddProfileDialog();
  });
}

if (ui.navLinks && ui.navLinks.length) {
  ui.navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setNavFilter(link.dataset.nav || "home");
    });
  });
}

ui.playHero.addEventListener("click", () => {
  if (state.filtered[0]) {
    selectItem(state.filtered[0]);
  }
});

ui.detailsHero.addEventListener("click", () => {
  const item = state.selected || state.filtered[0];
  if (!item) {
    return;
  }
  const progress = getProgressFor(item);
  const tags = getTags(item);
  const details = [
    `Shelf: ${item.group || "Library"}`,
    `Type: ${item.type}`,
    item.ext ? `Ext: ${item.ext}` : null,
    item.path ? `Path: ${item.path}` : null,
    item.size ? `Size: ${formatSize(item.size)}` : null,
    item.year ? `Year: ${item.year}` : null,
    tags.length ? `Tags: ${tags.join(", ")}` : null,
    `Rating: ${formatRating(getRatingFor(item))}`,
    progress && progress.lastPlayedAt
      ? `Last played: ${new Date(progress.lastPlayedAt).toLocaleString()}`
      : "Last played: never",
    progress
      ? `Progress: ${formatDuration(progress.position)} / ${formatDuration(
          progress.duration
        )}`
      : "Progress: none"
  ]
    .filter(Boolean)
    .map((line) => escapeHtml(line))
    .join("<br>");
  ui.dialogTitle.textContent = item.title;
  ui.dialogBody.innerHTML = details;
  renderRatingButtons(item);
  fillMetadataForm(item);
  ui.metadataDrop.textContent = "Drop metadata JSON here";
  ui.detailsDialog.showModal();
});

if (ui.heroFavorite) {
  ui.heroFavorite.addEventListener("click", () => {
    const item = state.selected || state.filtered[0];
    if (!item) {
      return;
    }
    toggleFavorite(item).catch(() => {});
  });
}
if (ui.heroLike) {
  ui.heroLike.addEventListener("click", () => {
    const item = state.selected || state.filtered[0];
    if (!item) {
      return;
    }
    toggleLike(item);
  });
}
if (ui.heroDislike) {
  ui.heroDislike.addEventListener("click", () => {
    const item = state.selected || state.filtered[0];
    if (!item) {
      return;
    }
    toggleDislike(item);
  });
}

ui.dialogClose.addEventListener("click", () => ui.detailsDialog.close());
if (ui.addMovieBtn) {
  ui.addMovieBtn.addEventListener("click", () => {
    resetAddForm();
    ui.addDialog.showModal();
  });
}
if (ui.addCancel) {
  ui.addCancel.addEventListener("click", () => {
    ui.addDialog.close();
  });
}
if (ui.addSource) {
  ui.addSource.addEventListener("change", () => updateAddMode());
}
if (ui.addForm) {
  ui.addForm.addEventListener("submit", (event) => {
    submitAddForm(event).catch(() => {});
  });
}
if (ui.addNext) {
  ui.addNext.addEventListener("click", () => {
    if (validateAddStep1()) {
      setAddStep(2);
    }
  });
}
if (ui.addBack) {
  ui.addBack.addEventListener("click", () => {
    setAddStep(1);
  });
}
if (ui.addAllowDuplicate) {
  ui.addAllowDuplicate.addEventListener("change", () => {
    validateAddStep1();
  });
}
if (ui.bulkImportBtn) {
  ui.bulkImportBtn.addEventListener("click", () => {
    if (ui.bulkInput) {
      ui.bulkInput.value = "";
    }
    setBulkStatus("");
    ui.bulkDialog.showModal();
  });
}
if (ui.bulkCancel) {
  ui.bulkCancel.addEventListener("click", () => {
    ui.bulkDialog.close();
  });
}
if (ui.bulkSubmit) {
  ui.bulkSubmit.addEventListener("click", () => {
    submitBulkImport().catch(() => {});
  });
}
if (ui.enrichTmdbBtn) {
  ui.enrichTmdbBtn.addEventListener("click", () => {
    if (ui.enrichLimit) {
      ui.enrichLimit.value = "";
    }
    if (ui.enrichOverwrite) {
      ui.enrichOverwrite.checked = false;
    }
    if (ui.enrichPosters) {
      ui.enrichPosters.checked = false;
    }
    setEnrichStatus("");
    ui.enrichDialog.showModal();
  });
}
if (ui.enrichCancel) {
  ui.enrichCancel.addEventListener("click", () => {
    ui.enrichDialog.close();
  });
}
if (ui.enrichRun) {
  ui.enrichRun.addEventListener("click", () => {
    submitTmdbEnrich().catch(() => {});
  });
}
if (ui.tmdbLookupBtn) {
  ui.tmdbLookupBtn.addEventListener("click", () => {
    runTmdbLookup().catch(() => {});
  });
}
if (ui.tmdbResults) {
  ui.tmdbResults.addEventListener("click", (event) => {
    const target = event.target.closest(".tmdb-result");
    if (!target || !target.dataset.id) {
      return;
    }
    applyTmdbSelection(target.dataset.id).catch(() => {});
  });
}
if (ui.addUrl) {
  ui.addUrl.addEventListener("input", () => {
    if (ui.addSource.value === "url") {
      autoFillFromInput(ui.addUrl.value, "url");
      if (addStep === 1) {
        validateAddStep1();
      }
    }
  });
}
if (ui.addPath) {
  ui.addPath.addEventListener("input", () => {
    if (ui.addSource.value === "local") {
      autoFillFromInput(ui.addPath.value, "local");
      if (addStep === 1) {
        validateAddStep1();
      }
    }
  });
}
if (ui.addFile) {
  ui.addFile.addEventListener("change", () => {
    const file = ui.addFile.files && ui.addFile.files[0];
    if (file && ui.addSource.value === "local") {
      autoFillFromInput(file.name, "local");
      if (addStep === 1) {
        validateAddStep1();
      }
    }
  });
}
registerManualField(ui.addTitle);
registerManualField(ui.addTags);
registerManualField(ui.addYear);
registerManualField(ui.addRating);
registerManualField(ui.addGroup);

ui.uploadPosterBtn.addEventListener("click", () => {
  const item = state.selected || state.filtered[0];
  if (!item) {
    return;
  }
  ui.posterInput.dataset.id = item.id;
  ui.posterInput.click();
});

ui.posterInput.addEventListener("change", (event) => {
  const file = event.target.files && event.target.files[0];
  const id = event.target.dataset.id;
  if (!file || !id) {
    return;
  }
  const item = state.itemsById.get(id);
  if (!item) {
    return;
  }
  uploadPoster(item, file).catch(() => {});
  event.target.value = "";
});

ui.clearPosterBtn.addEventListener("click", () => {
  const item = state.selected || state.filtered[0];
  if (!item) {
    return;
  }
  clearPoster(item).catch(() => {});
  ui.detailsDialog.close();
});

ui.saveMetaBtn.addEventListener("click", () => {
  const item = state.selected || state.filtered[0];
  if (!item) {
    return;
  }
  saveMetadata(item, readMetadataForm(), false).catch(() => {});
});

ui.clearMetaBtn.addEventListener("click", () => {
  const item = state.selected || state.filtered[0];
  if (!item) {
    return;
  }
  ui.metaTitle.value = "";
  ui.metaYear.value = "";
  ui.metaRating.value = "";
  ui.metaTags.value = "";
  ui.metaSynopsis.value = "";
  saveMetadata(item, {}, true).catch(() => {});
});

ui.metadataDrop.addEventListener("dragover", (event) => {
  event.preventDefault();
  ui.metadataDrop.classList.add("active");
});
ui.metadataDrop.addEventListener("dragleave", () => {
  ui.metadataDrop.classList.remove("active");
});
ui.metadataDrop.addEventListener("drop", (event) => {
  event.preventDefault();
  ui.metadataDrop.classList.remove("active");
  const file = event.dataTransfer.files && event.dataTransfer.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => applyDroppedMetadata(reader.result);
    reader.readAsText(file);
    return;
  }
  const text = event.dataTransfer.getData("text/plain");
  if (text) {
    applyDroppedMetadata(text);
  }
});

ui.centerPlay.addEventListener("click", () => togglePlay());
ui.playToggle.addEventListener("click", () => togglePlay());
ui.stopBtn.addEventListener("click", () => stopPlayback());
ui.prevBtn.addEventListener("click", () => playPrevious());
ui.nextBtn.addEventListener("click", () => playNext());
ui.skipBack.addEventListener("click", () => {
  ui.player.currentTime = Math.max(0, ui.player.currentTime - 10);
});
ui.skipForward.addEventListener("click", () => {
  ui.player.currentTime = Math.min(
    ui.player.duration || 0,
    ui.player.currentTime + 30
  );
});
ui.progressBar.addEventListener("input", (event) => {
  ui.player.currentTime = Number(event.target.value || 0);
  lastUiUpdate = performance.now();
  updateTimeDisplay();
});
ui.progressBar.addEventListener("mousemove", showSeekPreview);
ui.progressBar.addEventListener("mouseleave", hideSeekPreview);
ui.muteBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleVolumeOpen();
});
ui.muteBtn.addEventListener("dblclick", () => {
  setMuted(!ui.player.muted);
});
ui.volumeSlider.addEventListener("input", (event) => {
  ui.player.volume = Number(event.target.value);
  if (ui.player.volume === 0) {
    ui.player.muted = true;
  } else if (ui.player.muted) {
    ui.player.muted = false;
  }
  updateVolumeIcon();
  updateVolumeFill();
});
ui.speedSelect.addEventListener("change", (event) => {
  ui.player.playbackRate = Number(event.target.value);
});
ui.qualitySelect.addEventListener("change", (event) => {
  if (!hlsInstance) {
    return;
  }
  const value = event.target.value;
  if (value === "auto") {
    hlsInstance.currentLevel = -1;
    return;
  }
  const level = Number(value);
  if (Number.isFinite(level)) {
    hlsInstance.currentLevel = level;
  }
});
ui.subsToggle.addEventListener("click", () => toggleSubtitles());
ui.pipBtn.addEventListener("click", () => {
  togglePiP().catch(() => {});
});
ui.autoplayToggle.addEventListener("click", () => toggleAutoplay());
ui.controlsToggle.addEventListener("click", () => toggleAdvancedControls());
ui.settingsToggle.addEventListener("click", () => toggleAdvancedControls());
ui.theaterBtn.addEventListener("click", () => toggleTheater());
ui.fullscreenBtn.addEventListener("click", () => {
  toggleFullscreen().catch(() => {});
});

ui.player.addEventListener("timeupdate", () => {
  sendProgress(false).catch(() => {});
  updateTimeDisplayThrottled();
});
ui.player.addEventListener("loadstart", () => showLoadingState("Loading..."));
ui.player.addEventListener("waiting", () => showLoadingState("Buffering..."));
ui.player.addEventListener("stalled", () => showLoadingState("Stalled"));
ui.player.addEventListener("canplay", () => clearLoadingState());
ui.player.addEventListener("canplaythrough", () => clearLoadingState());
ui.player.addEventListener("click", () => togglePlay());
ui.player.addEventListener("dblclick", () => {
  toggleFullscreen().catch(() => {});
});
ui.player.addEventListener("pause", () => {
  updatePlayState();
  if (!loadingState) {
    setPlaybackStatus("Paused");
  }
  sendProgress(true).catch(() => {});
});
ui.player.addEventListener("play", () => {
  updatePlayState();
  clearLoadingState();
});
ui.player.addEventListener("ended", () => {
  updatePlayState();
  clearLoadingState();
  setPlaybackStatus("Ended");
  sendProgress(true).catch(() => {});
  if (state.autoplayEnabled) {
    playNext();
  }
});

ui.player.addEventListener("loadedmetadata", () => updateTimeDisplay());
ui.player.addEventListener("progress", () => updateBufferStatus());
ui.player.addEventListener("volumechange", () => {
  ui.volumeSlider.value = ui.player.volume;
  updateVolumeIcon();
  updateVolumeFill();
});

document.addEventListener("keydown", handleKeyboard);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && profileMenuOpen) {
    setProfileMenuOpen(false);
  }
  if (event.key === "Escape" && mobileNavOpen) {
    setMobileNavOpen(false);
  }
});
document.addEventListener("click", (event) => {
  if (!volumeOpen || !ui.utilityControls) {
    return;
  }
  if (ui.utilityControls.contains(event.target)) {
    return;
  }
  setVolumeOpen(false);
});
ui.playerShell.addEventListener("mousemove", () => showFullscreenControls());
ui.playerShell.addEventListener("mouseenter", () => showFullscreenControls());
ui.playerShell.addEventListener("touchstart", () => showFullscreenControls(), {
  passive: true
});
document.addEventListener("fullscreenchange", () => updateFullscreenUi());

const savedAutoplay = localStorage.getItem("cinema.autoplay");
state.autoplayEnabled = savedAutoplay ? savedAutoplay === "true" : true;
updateAutoplayUi();
updateVolumeFill();
updateNetworkStatus();
updateBufferStatus();
updateAddMode();
setAddStep(1);
initProfileAvatarGrid();
initControlIcons();
setNavFilter(navFilter);
registerServiceWorker();

loadAll().catch(() => {});
hideSearchSuggestions();

const conn =
  navigator.connection || navigator.mozConnection || navigator.webkitConnection;
if (conn && conn.addEventListener) {
  conn.addEventListener("change", () => updateNetworkStatus(state.selected));
}
