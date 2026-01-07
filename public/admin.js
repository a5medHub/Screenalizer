const state = {
  items: [],
  filtered: [],
  selectedIds: new Set(),
  activeItem: null
};

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

const ui = {
  adminStatus: document.getElementById("adminStatus"),
  adminReload: document.getElementById("adminReload"),
  adminSearch: document.getElementById("adminSearch"),
  adminType: document.getElementById("adminType"),
  adminGroup: document.getElementById("adminGroup"),
  adminTableBody: document.getElementById("adminTableBody"),
  selectAll: document.getElementById("selectAll"),
  bulkTags: document.getElementById("bulkTags"),
  bulkTagMode: document.getElementById("bulkTagMode"),
  bulkGroup: document.getElementById("bulkGroup"),
  bulkRating: document.getElementById("bulkRating"),
  bulkApply: document.getElementById("bulkApply"),
  bulkClear: document.getElementById("bulkClear"),
  bulkDelete: document.getElementById("bulkDelete"),
  adminAddLocal: document.getElementById("adminAddLocal"),
  adminLocalFile: document.getElementById("adminLocalFile"),
  adminLocalPath: document.getElementById("adminLocalPath"),
  adminLocalTitle: document.getElementById("adminLocalTitle"),
  adminLocalGroup: document.getElementById("adminLocalGroup"),
  adminLocalYear: document.getElementById("adminLocalYear"),
  adminLocalTags: document.getElementById("adminLocalTags"),
  adminLocalRating: document.getElementById("adminLocalRating"),
  adminAddUrl: document.getElementById("adminAddUrl"),
  adminUrl: document.getElementById("adminUrl"),
  adminPosterUrl: document.getElementById("adminPosterUrl"),
  adminSubtitleUrl: document.getElementById("adminSubtitleUrl"),
  adminUrlTitle: document.getElementById("adminUrlTitle"),
  adminUrlGroup: document.getElementById("adminUrlGroup"),
  adminUrlYear: document.getElementById("adminUrlYear"),
  adminUrlTags: document.getElementById("adminUrlTags"),
  adminUrlRating: document.getElementById("adminUrlRating"),
  adminBulkImport: document.getElementById("adminBulkImport"),
  adminBulkMode: document.getElementById("adminBulkMode"),
  adminBulkItems: document.getElementById("adminBulkItems"),
  adminEnrichForm: document.getElementById("adminEnrichForm"),
  adminEnrichLimit: document.getElementById("adminEnrichLimit"),
  adminEnrichOverwrite: document.getElementById("adminEnrichOverwrite"),
  adminEnrichPosters: document.getElementById("adminEnrichPosters"),
  adminEnrichRun: document.getElementById("adminEnrichRun"),
  adminRescan: document.getElementById("adminRescan"),
  editDialog: document.getElementById("adminEditDialog"),
  editForm: document.getElementById("adminEditForm"),
  editTitle: document.getElementById("editTitle"),
  editGroup: document.getElementById("editGroup"),
  editYear: document.getElementById("editYear"),
  editRating: document.getElementById("editRating"),
  editTags: document.getElementById("editTags"),
  editSynopsis: document.getElementById("editSynopsis"),
  editStatus: document.getElementById("editStatus"),
  editCancel: document.getElementById("editCancel")
};

const toast = document.createElement("div");
toast.className = "admin-toast";
document.body.appendChild(toast);

let toastTimer = null;

function showToast(message, type = "info") {
  if (!toast) {
    return;
  }
  toast.textContent = message;
  toast.classList.toggle("error", type === "error");
  toast.classList.add("show");
  if (toastTimer) {
    clearTimeout(toastTimer);
  }
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

function setStatus(message) {
  if (ui.adminStatus) {
    ui.adminStatus.textContent = message || "";
  }
}

function normalize(value) {
  return String(value || "").toLowerCase();
}

function formatTags(tags) {
  if (!Array.isArray(tags)) {
    return "";
  }
  return tags.join(", ");
}

function parseBulkLines(text) {
  const items = [];
  text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const parts = line.split("|").map((part) => part.trim());
      const [
        source,
        title,
        year,
        tags,
        rating,
        group,
        poster,
        subtitle
      ] = parts;
      if (!source) {
        return;
      }
      const entry = { source };
      if (title) {
        entry.title = title;
      }
      if (year && !Number.isNaN(Number(year))) {
        entry.year = Number(year);
      }
      if (tags) {
        entry.tags = tags;
      }
      if (rating && !Number.isNaN(Number(rating))) {
        entry.rating = Number(rating);
      }
      if (group) {
        entry.group = group;
      }
      if (poster) {
        entry.poster = poster;
      }
      if (subtitle) {
        entry.subtitle = subtitle;
      }
      items.push(entry);
    });
  return items;
}

function applyFilters() {
  const query = normalize(ui.adminSearch.value);
  const type = ui.adminType.value;
  const group = normalize(ui.adminGroup.value);
  state.filtered = state.items.filter((item) => {
    if (type !== "all" && item.type !== type) {
      return false;
    }
    if (group && normalize(item.group).indexOf(group) === -1) {
      return false;
    }
    if (!query) {
      return true;
    }
    const inTitle = normalize(item.title).includes(query);
    const inTags = normalize(formatTags(item.tags)).includes(query);
    return inTitle || inTags;
  });
}

function updateSelectAll() {
  if (!ui.selectAll) {
    return;
  }
  const selectable = state.filtered.length;
  const selected = state.filtered.filter((item) =>
    state.selectedIds.has(item.id)
  ).length;
  ui.selectAll.checked = selectable > 0 && selected === selectable;
  ui.selectAll.indeterminate = selected > 0 && selected < selectable;
}

function renderTable() {
  ui.adminTableBody.innerHTML = "";
  const fragment = document.createDocumentFragment();
  state.filtered.forEach((item) => {
    const row = document.createElement("tr");

    const selectCell = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = state.selectedIds.has(item.id);
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        state.selectedIds.add(item.id);
      } else {
        state.selectedIds.delete(item.id);
      }
      updateSelectAll();
    });
    selectCell.appendChild(checkbox);

    const titleCell = document.createElement("td");
    titleCell.textContent = item.title || "Untitled";

    const typeCell = document.createElement("td");
    typeCell.innerHTML = `<span class="admin-pill">${
      item.type === "url" ? "Stream" : "Local"
    }</span>`;

    const groupCell = document.createElement("td");
    groupCell.textContent = item.group || "Library";

    const yearCell = document.createElement("td");
    yearCell.textContent = item.year || "--";

    const ratingCell = document.createElement("td");
    ratingCell.textContent =
      typeof item.rating === "number" ? item.rating.toFixed(1) : "--";

    const tagsCell = document.createElement("td");
    tagsCell.textContent = formatTags(item.tags) || "--";

    const actionsCell = document.createElement("td");
    const actions = document.createElement("div");
    actions.className = "admin-row-actions";
    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-ghost icon-btn";
    editBtn.setAttribute("aria-label", "Edit");
    editBtn.setAttribute("title", "Edit");
    editBtn.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 16.5V20h3.5L18 9.5l-3.5-3.5L4 16.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></path>
        <path d="M13.5 6l3.5 3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
      </svg>
      <span class="sr-only">Edit</span>
    `;
    editBtn.addEventListener("click", () => openEditDialog(item));
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-ghost icon-btn";
    deleteBtn.setAttribute("aria-label", "Delete");
    deleteBtn.setAttribute("title", "Delete");
    deleteBtn.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 7h14M9 7V5h6v2M8 7l1 11h6l1-11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
      </svg>
      <span class="sr-only">Delete</span>
    `;
    deleteBtn.addEventListener("click", () => deleteItem(item.id));
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    actionsCell.appendChild(actions);

    row.appendChild(selectCell);
    row.appendChild(titleCell);
    row.appendChild(typeCell);
    row.appendChild(groupCell);
    row.appendChild(yearCell);
    row.appendChild(ratingCell);
    row.appendChild(tagsCell);
    row.appendChild(actionsCell);
    fragment.appendChild(row);
  });
  ui.adminTableBody.appendChild(fragment);
  updateSelectAll();
}

function render() {
  applyFilters();
  renderTable();
  setStatus(`${state.filtered.length} titles`);
}

async function loadLibrary() {
  setStatus("Loading...");
  const response = await fetch("/api/library");
  const payload = await response.json();
  state.items = payload.items || [];
  state.selectedIds.clear();
  render();
}

function openEditDialog(item) {
  state.activeItem = item;
  ui.editTitle.value = item.title || "";
  ui.editGroup.value = item.group || "";
  ui.editYear.value =
    item.year !== undefined && item.year !== null ? item.year : "";
  ui.editRating.value =
    typeof item.rating === "number" ? item.rating : "";
  ui.editTags.value = formatTags(item.tags);
  ui.editSynopsis.value = item.synopsis || "";
  ui.editStatus.textContent = "";
  ui.editDialog.showModal();
}

async function saveEdit(event) {
  event.preventDefault();
  if (!state.activeItem) {
    return;
  }
  ui.editStatus.textContent = "Saving...";
  const response = await fetch("/api/metadata", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: state.activeItem.id,
      title: ui.editTitle.value.trim(),
      group: ui.editGroup.value.trim(),
      year: ui.editYear.value !== "" ? Number(ui.editYear.value) : null,
      rating: ui.editRating.value !== "" ? Number(ui.editRating.value) : null,
      tags: ui.editTags.value,
      synopsis: ui.editSynopsis.value.trim()
    })
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    ui.editStatus.textContent = body.error || "Failed to save.";
    return;
  }
  ui.editDialog.close();
  await loadLibrary();
}

async function deleteItem(id) {
  if (!id) {
    return;
  }
  if (!window.confirm("Delete this title? This will remove local files.")) {
    return;
  }
  await fetch(`/api/media/${encodeURIComponent(id)}`, { method: "DELETE" });
  await loadLibrary();
}

async function bulkApply() {
  const ids = Array.from(state.selectedIds);
  if (!ids.length) {
    setStatus("Select items to update.");
    return;
  }
  const meta = {};
  if (ui.bulkTags.value.trim()) {
    meta.tags = ui.bulkTags.value.trim();
  }
  if (ui.bulkGroup.value.trim()) {
    meta.group = ui.bulkGroup.value.trim();
  }
  if (ui.bulkRating.value !== "") {
    meta.rating = Number(ui.bulkRating.value);
  }
  if (!Object.keys(meta).length) {
    setStatus("Provide tags, group, or rating first.");
    return;
  }
  setStatus("Applying updates...");
  const response = await fetch("/api/metadata/bulk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ids,
      meta,
      tagMode: ui.bulkTagMode.value
    })
  });
  if (!response.ok) {
    setStatus("Bulk update failed.");
    return;
  }
  await loadLibrary();
}

async function bulkClear() {
  const ids = Array.from(state.selectedIds);
  if (!ids.length) {
    setStatus("Select items to clear.");
    return;
  }
  if (!window.confirm("Clear metadata for selected items?")) {
    return;
  }
  await fetch("/api/metadata/bulk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids, clear: true })
  });
  await loadLibrary();
}

async function bulkDelete() {
  const ids = Array.from(state.selectedIds);
  if (!ids.length) {
    setStatus("Select items to delete.");
    return;
  }
  if (!window.confirm("Delete selected titles? This will remove local files.")) {
    return;
  }
  await fetch("/api/media/bulk-delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids })
  });
  await loadLibrary();
}

async function addLocalTitle(event) {
  event.preventDefault();
  const file = ui.adminLocalFile ? ui.adminLocalFile.files[0] : null;
  const sourcePath = ui.adminLocalPath ? ui.adminLocalPath.value.trim() : "";
  if (!file && !sourcePath) {
    setStatus("Select a file or provide a local path.");
    showToast("Select a file or provide a local path.", "error");
    return;
  }
  const form = new FormData();
  if (file) {
    form.append("movie", file);
  }
  if (sourcePath) {
    form.append("sourcePath", sourcePath);
  }
  if (ui.adminLocalTitle && ui.adminLocalTitle.value.trim()) {
    form.append("title", ui.adminLocalTitle.value.trim());
  }
  if (ui.adminLocalGroup && ui.adminLocalGroup.value.trim()) {
    form.append("group", ui.adminLocalGroup.value.trim());
  }
  if (ui.adminLocalYear && ui.adminLocalYear.value !== "") {
    form.append("year", ui.adminLocalYear.value);
  }
  if (ui.adminLocalTags && ui.adminLocalTags.value.trim()) {
    form.append("tags", ui.adminLocalTags.value.trim());
  }
  if (ui.adminLocalRating && ui.adminLocalRating.value !== "") {
    form.append("rating", ui.adminLocalRating.value);
  }
  setStatus("Adding local title...");
  const response = await fetch("/api/media/local", {
    method: "POST",
    body: form
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message = body.error || "Failed to add local title.";
    setStatus(message);
    showToast(message, "error");
    return;
  }
  if (ui.adminAddLocal) {
    ui.adminAddLocal.reset();
  }
  setStatus("Local title added.");
  showToast("Local title added.");
  await loadLibrary();
}

async function addStreamTitle(event) {
  event.preventDefault();
  const url = ui.adminUrl ? ui.adminUrl.value.trim() : "";
  if (!url) {
    setStatus("Provide a stream URL.");
    showToast("Provide a stream URL.", "error");
    return;
  }
  const payload = {
    url,
    title: ui.adminUrlTitle ? ui.adminUrlTitle.value.trim() : "",
    group: ui.adminUrlGroup ? ui.adminUrlGroup.value.trim() : "",
    poster: ui.adminPosterUrl ? ui.adminPosterUrl.value.trim() : "",
    subtitle: ui.adminSubtitleUrl ? ui.adminSubtitleUrl.value.trim() : "",
    tags: ui.adminUrlTags ? ui.adminUrlTags.value.trim() : "",
    year: ui.adminUrlYear && ui.adminUrlYear.value !== ""
      ? Number(ui.adminUrlYear.value)
      : null,
    rating: ui.adminUrlRating && ui.adminUrlRating.value !== ""
      ? Number(ui.adminUrlRating.value)
      : null
  };
  setStatus("Adding stream...");
  const response = await fetch("/api/media/url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message = body.error || "Failed to add stream.";
    setStatus(message);
    showToast(message, "error");
    return;
  }
  if (ui.adminAddUrl) {
    ui.adminAddUrl.reset();
  }
  setStatus("Stream added.");
  showToast("Stream added.");
  await loadLibrary();
}

async function bulkImport(event) {
  event.preventDefault();
  const raw = ui.adminBulkItems ? ui.adminBulkItems.value.trim() : "";
  if (!raw) {
    setStatus("Paste items to import.");
    showToast("Paste items to import.", "error");
    return;
  }
  let items = [];
  if (ui.adminBulkMode && ui.adminBulkMode.value === "json") {
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        setStatus("JSON must be an array.");
        showToast("JSON must be an array.", "error");
        return;
      }
      items = parsed;
    } catch {
      setStatus("Invalid JSON.");
      showToast("Invalid JSON.", "error");
      return;
    }
  } else {
    items = parseBulkLines(raw);
  }
  if (!items.length) {
    setStatus("No valid items found.");
    showToast("No valid items found.", "error");
    return;
  }
  setStatus("Importing items...");
  const response = await fetch("/api/media/bulk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items })
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message = body.error || "Bulk import failed.";
    setStatus(message);
    showToast(message, "error");
    return;
  }
  if (ui.adminBulkImport) {
    ui.adminBulkImport.reset();
  }
  setStatus("Bulk import complete.");
  showToast("Bulk import complete.");
  await loadLibrary();
}

async function runEnrich(event) {
  event.preventDefault();
  const payload = {
    limit: ui.adminEnrichLimit && ui.adminEnrichLimit.value !== ""
      ? Number(ui.adminEnrichLimit.value)
      : null,
    overwrite: Boolean(ui.adminEnrichOverwrite && ui.adminEnrichOverwrite.checked),
    applyPosters: Boolean(ui.adminEnrichPosters && ui.adminEnrichPosters.checked)
  };
  setStatus("Running TMDB enrich...");
  const response = await fetch("/api/tmdb/enrich", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message = body.error || "TMDB enrich failed.";
    setStatus(message);
    showToast(message, "error");
    return;
  }
  const result = await response.json().catch(() => ({}));
  const doneMessage = `Enriched ${result.enriched || 0}, skipped ${
    result.skipped || 0
  }.`;
  setStatus(doneMessage);
  showToast(doneMessage);
  await loadLibrary();
}

async function rescanLibrary() {
  setStatus("Rescanning library...");
  showToast("Rescanning library...");
  await fetch("/api/refresh", { method: "POST" });
  await loadLibrary();
}

ui.adminReload.addEventListener("click", () => loadLibrary().catch(() => {}));
ui.adminSearch.addEventListener("input", () => render());
ui.adminType.addEventListener("change", () => render());
ui.adminGroup.addEventListener("input", () => render());
ui.selectAll.addEventListener("change", () => {
  if (ui.selectAll.checked) {
    state.filtered.forEach((item) => state.selectedIds.add(item.id));
  } else {
    state.filtered.forEach((item) => state.selectedIds.delete(item.id));
  }
  renderTable();
});
ui.bulkApply.addEventListener("click", () => bulkApply().catch(() => {}));
ui.bulkClear.addEventListener("click", () => bulkClear().catch(() => {}));
ui.bulkDelete.addEventListener("click", () => bulkDelete().catch(() => {}));
ui.editForm.addEventListener("submit", (event) => saveEdit(event).catch(() => {}));
ui.editCancel.addEventListener("click", () => ui.editDialog.close());
if (ui.adminAddLocal) {
  ui.adminAddLocal.addEventListener("submit", (event) => {
    addLocalTitle(event).catch(() => {});
  });
}
if (ui.adminAddUrl) {
  ui.adminAddUrl.addEventListener("submit", (event) => {
    addStreamTitle(event).catch(() => {});
  });
}
if (ui.adminBulkImport) {
  ui.adminBulkImport.addEventListener("submit", (event) => {
    bulkImport(event).catch(() => {});
  });
}
if (ui.adminEnrichForm) {
  ui.adminEnrichForm.addEventListener("submit", (event) => {
    runEnrich(event).catch(() => {});
  });
}
if (ui.adminRescan) {
  ui.adminRescan.addEventListener("click", () => {
    rescanLibrary().catch(() => {});
  });
}

registerServiceWorker();
loadLibrary().catch(() => {});
