# Screenalizer Cinema

Local movie shelf with a creative UI. Scan a folder of video files or add stream URLs, then play everything in your browser with profiles, history, and smart shelves.

## Setup

```bash
npm install
npm start
```

Open `http://localhost:5179`.

Optional: copy `.env.example` to `.env` and fill in keys like `TMDB_API_KEY`.

## Configure media

Create `media.config.json` in the project root (or copy `media.config.example.json`):

```json
{
  "localPath": "C:\\Movies",
  "autoPosters": true,
  "tmdbApiKey": "",
  "tmdbLanguage": "en-US",
  "urls": [
    {
      "title": "Big Buck Bunny",
      "url": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
      "group": "Streams",
      "poster": "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg",
      "subtitle": "https://bitdash-a.akamaihd.net/content/sintel/subtitles/subtitles_en.vtt",
      "year": 2008,
      "rating": 4.5,
      "tags": ["Animation", "Short"],
      "synopsis": "A giant rabbit deals with three tiny bullies."
    }
  ]
}
```

Notes:
- `localPath` can be absolute (recommended on Windows) or relative to the project.
- Supported local extensions: `.mp4`, `.mkv`, `.webm`, `.mov`, `.avi`.
- Optional posters: place `movie.jpg` next to `movie.mp4`, or use `poster` for URLs.
- `autoPosters` (default true) generates posters for streams and local files using `ffmpeg` if installed.
- `tmdbApiKey` enables TMDB lookups from the Add dialog (you can also set `TMDB_API_KEY`).
- `tmdbBearer` enables TMDB lookups with a v4 token (you can also set `TMDB_BEARER`).
- `tmdbLanguage` (optional) sets TMDB language (default `en-US`).
- Optional subtitles: place `movie.srt` or `movie.vtt` next to `movie.mp4`, or use `subtitle` for URLs.
- Optional metadata: create `Movie.json` or `Movie.meta.json` next to the video file with:
  - `title`, `year`, `rating` (0-5 or 0-10), `tags` (array or comma list), `group`, `synopsis`.

Example `Movie.json`:

```json
{
  "title": "My Indie Film",
  "year": 2022,
  "rating": 4.2,
  "tags": ["Drama", "Festival"],
  "group": "Indie",
  "synopsis": "A quiet story about a night train."
}
```

## Features

- Profiles with watch history, last played, and continue watching.
- Smart shelves (recently added, big files, streams, folder groups).
- Full-text search and filters (type, shelf, extension) plus sorting.
- Poster uploads per title (plus local posters).
- Subtitle support for local `.srt`/`.vtt` and URL subtitles.
- Ratings per profile, plus metadata ratings for suggestions.
- Rate from the Details dialog; ratings are stored in `data/state.json`.
- Timeline hover previews for local files (generated on first hover).
- Autoplay with an Up Next queue.
- Drag-and-drop metadata editor inside the Details dialog.
- Admin page (`/admin.html`) for edit/delete/bulk update.

State is stored in `data/state.json`. Poster uploads are stored in `data/posters/`.

## TMDB metadata

If you want automatic metadata (title, year, tags, synopsis, rating), add a TMDB API key:

```bash
set TMDB_API_KEY=your_key_here
```

Or place it in `.env` as `TMDB_API_KEY` (or in `media.config.json` as `tmdbApiKey`).
If you only have a TMDB v4 token, use `TMDB_BEARER` (or `tmdbBearer` in config).
Then use **Find on TMDB** in the Add dialog.

For bulk metadata on local files, open **Enrich TMDB** in the top bar.

## Bulk import

Use **Bulk** in the top bar to paste many items at once.

Line mode format:

```
source | title | year | tags | rating | group | poster | subtitle
```

Examples:

```
C:\Movies\Inception.mp4 | Inception | 2010 | Sci-Fi, Thriller | 4.6 | Movies
https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8 | Big Buck Bunny | 2008 | Animation, Short | 4.5 | Streams
```

JSON mode accepts an array:

```json
[
  { "path": "C:\\Movies\\Inception.mp4", "title": "Inception", "year": 2010 },
  { "url": "https://example.com/movie.m3u8", "title": "Stream Title" }
]
```

## Rescan

Use the **Rescan** button in the UI or run:

```bash
curl -X POST http://localhost:5179/api/refresh
```

## Troubleshooting

- If nothing shows up, double check `localPath` and permissions.
- If you use `.mkv` or `.avi`, your browser may not support playback.

## Player controls

- Buttons for play/pause, skip, volume, speed, subtitles, PiP, theater, fullscreen.
- Keyboard: Space (play/pause), Left/Right (seek 10s), Up/Down (volume), M (mute), F (fullscreen).

## Metadata editor

- Open **Details** for a title, then edit fields or drop a `.json` file.
- Click **Save metadata** to write `Movie.json` or `Movie.meta.json` next to local files.
- For URL entries, edits are stored in `data/state.json`.
