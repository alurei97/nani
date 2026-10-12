# 👀 Nani? — Anime Randomizer & Tracker

> Swipe through random anime, save the ones that catch your eye, track what you watch.
> Built with React Native + Expo as a deliberate RN learning project.

---

## Concept

Open the app, optionally pick a mood (genre/type/score), and get a swipeable stack of
random anime pulled from the AniList GraphQL API. Swipe right to save,
swipe left to skip. Your saved list lives locally — mark things as watching or completed,
add a rating. Simple, fun, genuinely useful.

---

## Why this works for the portfolio

| Signal                                      | What it shows                                                     |
| ------------------------------------------- | ----------------------------------------------------------------- |
| Swipe cards with Reanimated gestures        | The RN-specific skill that separates devs                         |
| AniList GraphQL integration                 | Real API concerns, non-trivial query design, rate-limit awareness |
| Onboarding/tutorial with scripted animation | Reanimated sequences, not just gestures                           |
| Zustand + Drizzle (local list)              | Modern RN state + type-safe SQLite                                |
| Image-heavy UI (anime posters)              | Completely different visually                                     |
| Genre/type/score filters                    | Non-trivial UI, shows product thinking                            |

---

## Tech Stack

| Layer      | Choice                                                    |
| ---------- | --------------------------------------------------------- |
| Framework  | React Native + Expo (managed)                             |
| Navigation | Expo Router (file-based routing with Stack + Bottom Tabs) |
| State      | Zustand (swipe session, filter state)                     |
| Local DB   | Drizzle ORM + expo-sqlite (saved list)                    |
| Animations | React Native Reanimated 3                                 |
| Gestures   | React Native Gesture Handler                              |
| Font       | Nunito (Google Fonts via @expo-google-fonts/nunito)       |
| Styling    | NativeWind (Tailwind for RN)                              |
| GraphQL    | urql                                                      |
| Images     | expo-image (faster than RN Image, built-in cache)         |
| Testing    | Jest + React Native Testing Library                       |
| Build      | Expo EAS Build (free tier → APK)                          |

---

## Data Source — AniList GraphQL API

Free, no auth, independent of MyAnimeList (more reliable).
Endpoint: `https://graphql.anilist.co` — all requests are POST.
Rate limit: 90 req/min — no queue needed, very generous.

**Single query for both modes (filtered and random — only variables differ):**

```graphql
query ($page: Int, $genres: [String], $format: MediaFormat, $score: Int) {
  Page(page: $page, perPage: 25) {
    media(
      type: ANIME
      genre_in: $genres # omit for random mode
      format: $format # omit for random mode
      averageScore_greater: $score # omit for random mode
      isAdult: false
    ) {
      id
      title {
        romaji
        english
      }
      coverImage {
        extraLarge
      }
      averageScore # 0–100 (not 0–10 like MyAnimeList)
      episodes
      format # TV, MOVIE, OVA, ONA
      genres
      description(asHtml: false)
      status
      trailer {
        id
        site
      } # YouTube video ID
    }
    pageInfo {
      lastPage
    }
  }
}
```

**Random strategy:** no native random endpoint — use random page number instead.
AniList has ~15,000 anime (~600 pages at 25/page). Pick `Math.floor(Math.random() * lastPage) + 1`.
First call returns `pageInfo.lastPage` — store it, use for subsequent random page picks. Do not request a score sort; locally shuffle each fetched batch before adding it to the swipe pool so results are not presented in AniList's default order.

**Key fields (AniList GraphQL response):**

- Genres are strings: `"Action"`, `"Fantasy"`, `"Romance"` etc. (not numeric IDs)
- Score is 0–100: slider value × 10 → `averageScore_greater`
- Format: `TV`, `MOVIE`, `OVA`, `ONA` (not `type`)
- `id` — AniList's own integer ID. Store this, not MAL's mal_id (different system)
- Image: `coverImage.extraLarge` (direct URL, 2:3 portrait, highest available quality)
- Trailer: `trailer.id` + `trailer.site` → construct YouTube URL: `youtube.com/watch?v={id}`

**Genres (strings, pass directly as variables):**

```
Action, Adventure, Comedy, Drama, Ecchi, Fantasy, Hentai, Horror,
Mahou Shoujo, Mecha, Music, Mystery, Psychological, Romance, Sci-Fi,
Slice of Life, Sports, Supernatural, Thriller
```

These 19 values are the AniList `GenreCollection` returned on 2026-10-07 and are stored as a local constant. No runtime genre query or AsyncStorage cache is needed; update the constant manually if AniList changes its genre collection.

---

## Screens

### 1. Tutorial (first launch only)

- Shown once, stored via AsyncStorage (`tutorial_seen`)
- 4 steps. When a step becomes active, its scripted animation plays once and then holds until Next is pressed:
  - Step 1 — Save: start centered; move the card right and rotate slightly clockwise. Fade in a neon-green heart badge at the card's top-right. Hold the card and badge in place. Text: "Swipe right to save."
  - Step 2 — Skip: reset the card to center, then move it left and rotate slightly counterclockwise. Fade in a neon-red X badge at the card's top-left. Hold in place. Text: "Swipe left to skip."
  - Step 3 — Anime info: show a brief tap ripple at the center of the card, then flip the card around its Y axis to reveal a hardcoded 16:9 banner, title, star-and-score, and short synopsis. This is the same flip interaction used by a card in Discover. Text: "Tap to see anime info."
  - Step 4 — My List: fade and slide in a static 2×2 My List preview. Show the tutorial anime in one tile and three muted empty poster placeholders; no extra anime data or scrolling is needed. Text: "Find it in My List."
- Skip button top right
- "Got it" CTA on step 4; Next advances steps 1–3
- Tutorial card is **hardcoded** — no network request on onboarding:
  ```js
  const TUTORIAL_ANIME = {
    id: 154587,
    title: "Frieren: Beyond Journey's End",
    coverImage:
      "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx154587-qQTzQnEJJ3oB.jpg",
    bannerImage:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/154587-ivXNJ23SM1xB.jpg",
    averageScore: 91,
    format: "TV",
    episodes: 28,
    genres: ["Adventure", "Drama", "Fantasy"],
    synopsis:
      "Years after defeating the Demon King, elf mage Frieren begins a new journey to understand life, mortality, and the people she once traveled with.",
  };
  ```
  The info face shows only the banner, title, score, and synopsis. Keep all tutorial data hardcoded; do not fetch details during onboarding.
  If image fails (no connection) → show purple placeholder colour. Tutorial still works.

### 2. Filter / Mood screen (tab: Discover)

- When no swipe session is active, this is the default Discover state
- Genre chips: scrollable row of toggleable pills (tap to select, multi-select)
- Type selector: All / TV / Movie / OVA (segmented control)
- Min score: slider 0–10 (default off / 0)
- Big "Shuffle" button → starts swipe session
- "Skip filters" link for pure random

### 3. Swipe Stack (active session)

- Single card display — no background cards peeking behind (cleaner, simpler to animate)
- Card: full-height poster image, gradient overlay at bottom, title + score + format badge
- Subtle drop shadow gives depth without needing background cards
- Drag gesture: card follows finger, rotates slightly
  - Dragging right: green heart icon fades in on card
  - Dragging left: red X icon fades in on card
- Release past threshold: card flies off in swipe direction, next card appears (fade/scale in)
- Release before threshold: card snaps back (spring animation)
- Tap card → opens centered popup detail
- "Out of cards" state → reload button

### 4. My List (tab: My List)

- 2-column grid of saved anime posters
- Status badge on each: Plan to Watch / Watching / Completed
- Tap → Detail sheet with status/rating controls
- Empty state: illustration + "Swipe right on something you like"

### 5a. Anime Detail — Swipe preview (flip card)

Triggered by tapping a card in the swipe stack. The card itself gives a brief tap
feedback/ripple, then flips around its Y axis to reveal its info face. This is a quick
decision helper, not management. Reuse the same two-sided card interaction in the
tutorial; the Discover card may grow during the flip to fit the details.

- Front face: anime poster, title, and score
- Back face: 16:9 banner image, title, inline star-and-score, and synopsis (3 lines max)
- Tap again or use a close control to return to the poster face
- Two action buttons: **Skip** (outlined) and **Save** (purple filled) — same as swiping

### 5b. Anime Detail — My List (full screen)

Triggered by tapping a tile in My List. Pushed via an Expo Router Stack — full screen,
back arrow top left. Management mode: user already saved this, now rating/tracking it.

- Back arrow navigation header
- Tall hero image (covers ~35% of screen height)
- Title, score, episodes, format, genre chips
- Full synopsis (collapsible if long)
- Your rating: 1–5 stars
- Status picker: Plan to Watch / Watching / Completed (with semantic colours)
- Trailer button + Remove from list button
- No Save/Skip (already saved)

### Card Metadata Styling

Use the same metadata colors on the swipe card and its flipped info face:

- Format pill (TV, Movie, OVA): text `#555555`, background `#111118`, border `#1e1e2e`
- Genre pills: text `#a855f7`, background `rgba(168, 85, 247, 0.12)`, border `rgba(168, 85, 247, 0.3)`
- Average score: keep the yellow star-and-number treatment (`#fbbf24`) on both faces; do not render it as a pill

---

## Technical Backlog

### Phase 1 — Foundation

- [x] Expo project init with TypeScript template
- [x] Expo Router: Bottom Tabs (Discover, My List) + Stack for sheets
- [x] NativeWind
- [x] Theme setup (dark, purple/pink accent — anime aesthetic)
- [x] Drizzle + expo-sqlite: `saved_anime` table (id, title, image_url, score,
      episodes, format, synopsis, genres, status, rating, saved_at)
- [x] Zustand: filter state + swipe session (current card pool, index, fetching)
- [x] AniList GraphQL client (urql): shared client, typed query wrapper, and error handling. Use imperative queries for button-triggered fetches; no Provider is needed unless UI components use urql hooks. Genre options are a local constant; no genre fetch or cache.

### Phase 2 — Tutorial

- [x] AsyncStorage check on app start → show tutorial if not seen
- [x] Four-step tutorial screen; each step animation plays on entry and holds until Next
  - [x] Hardcoded `TUTORIAL_ANIME` poster, banner, title, score, format, episodes, genres, and synopsis; no network request
  - [x] `useSharedValue` values for card X position, rotation, and icon opacity
  - [x] Step 1: reset to center, move right, rotate clockwise, and fade in the green heart badge
  - [x] Step 2: reset to center, move left, rotate counterclockwise, and fade in the red X badge
  - [x] Step 3: show a center tap ripple, then flip the card on its Y axis to reveal the banner, title, star-and-score, and short synopsis
  - [x] Step 4: fade/slide in a static 2×2 My List preview with the tutorial anime and three empty poster placeholders
  - [x] Show purple placeholder if the cover image fails to load
- [x] Four step indicator dots
- [x] Skip + Got it buttons persist `tutorial_seen` and navigate to Discover

### Phase 3 — Filter + Swipe

- [ ] Filter screen: genre chips, type segmented control, score slider
- [ ] AniList query on button press: filtered or unfiltered Page query with random page number; locally shuffle each fetched batch before adding it to the pool
- [ ] Swipe card component:
  - [ ] `useAnimatedStyle` for translateX, rotate, card opacity
  - [ ] `Gesture.Pan` from Gesture Handler
  - [ ] Threshold logic: right > 120px = save, left < -120px = skip
  - [ ] Heart/X icon interpolated opacity
  - [ ] Spring snap-back on threshold miss
  - [ ] Card fly-off animation on confirm → next card fades/scales in
- [ ] No background card stack — single card only, drop shadow for depth
- [ ] Save to Drizzle on right swipe
- [ ] Pre-fetch next batch when pool < 5

### Phase 4 — My List + Detail

- [ ] My List grid: FlatList 2 columns, expo-image for posters, status badge
- [ ] Bottom sheet (react-native-bottom-sheet library): anime detail
- [ ] Status picker + star rating → update Drizzle row
- [ ] Remove from list with confirmation
- [ ] Empty state

### Phase 5 — Polish + Portfolio

- [ ] Haptic feedback on swipe confirm (expo-haptics)
- [ ] Skeleton loaders while cards fetch
- [ ] Error state (API down, no results for filters)
- [ ] Discover background: subtle, stable placement of low-contrast アニメ Katakana accents that never obscure content
- [ ] App icon + splash (anime-themed)
- [ ] EAS Build → APK
- [ ] README with screen recordings / GIFs (the swipe animation must be in the README)
- [ ] Publish to GitHub

---

## 🧪 Tests

**Phase 1:**

- [ ] Zustand store: setFilters, addToPool, advanceCard actions
- [ ] Drizzle: saveAnime, updateStatus, removeAnime

**Phase 3:**

- [ ] Threshold logic util: `getSwiperResult(translateX)` → 'save' | 'skip' | null
- [ ] AniList client: handles rate limit (90 req/min), retries on 429

**Phase 5:**

- [ ] FilterScreen: genre chip toggles correctly, slider updates score
- [ ] MyListGrid: renders correct item count, tapping opens detail

---

## App design notes

- Theme: dark background (#0d0d0f), pink/purple accent (#e879f9 / #a855f7)
- Font: Nunito (via @expo-google-fonts/nunito) — rounded, fun, fits the anime aesthetic
- Anime poster aspect ratio: 2:3 (portrait) — cards fill most of the screen height
- Gradient overlay on cards: transparent → black at bottom (for title legibility)
- Status colours: gray (#888) = plan to watch · amber (#fbbf24) = watching · green (#4ade80) = completed
- Genre chips: pill style, pastel tints per genre (action=red, romance=pink, etc.)
- Score display: AniList 0–100 scale, yellow star + number, always visible on card
- Navigation: floating centered pill (NOT full-width bottom nav) — two icon+label buttons
  inside a frosted/elevated pill, sits above the home indicator

---

## Fetch & deduplication strategy

```
# On app open OR when pool drops below 10 cards — one GraphQL POST either way:

# Random mode: omit genre_in, format, averageScore_greater
# Filtered mode: include user-selected variables
# Both use a random page number

variables = {
  page: Math.floor(Math.random() * lastPage) + 1,
  genres: ["Action", "Fantasy"],  # filtered only
  format: "TV",                   # filtered only
  score: 70,                      # filtered only (0-100)
}
```

**Deduplication flow (local, instant):**

1. Fetch 25 results from AniList
2. Filter out ids already in AsyncStorage seen list
3. Filter out ids already saved in Drizzle (My List)
4. Add remaining to display pool
5. If < 5 survive dedup → silently fetch another random page
6. Add fetched ids to seen list (cap at 500, drop oldest)

**Seen list — AsyncStorage (not Drizzle):**
Just a JSON array of numbers. Simple, fast, persists across sessions.
Cap: keep last 500 seen IDs. After 500, shift oldest off the array.

```js
const seen = await AsyncStorage.getItem("seen_ids");
const seenSet = new Set(JSON.parse(seen ?? "[]"));
const fresh = results.filter((a) => !seenSet.has(a.id) && !savedIds.has(a.id));
const updated = [...seenSet, ...fresh.map((a) => a.id)].slice(-500);
await AsyncStorage.setItem("seen_ids", JSON.stringify(updated));
```

**No progress counter, no "X left" indicator** — just a shimmer when the pool is loading.
Shimmer only shows on first open and when pool is empty and refetching.

## AniList rate-limit (90 req/min — very lenient)

```js
// Simple queue — add delay between requests
// AniList allows 90 req/min — no queue needed for normal use.
// Simple retry on 429 is enough:
class AniListClient {
  private queue = [];
  private processing = false;

  async add(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      if (!this.processing) this.process();
    });
  }

  private async process() {
    this.processing = true;
    while (this.queue.length > 0) {
      const { fn, resolve, reject } = this.queue.shift();
      try { resolve(await fn()); } catch (e) { reject(e); }
      await new Promise(r => setTimeout(r, 400)); // 400ms between requests
    }
    this.processing = false;
  }
}
```

---

## What to say in interviews

_"Nani? is a React Native anime randomizer I built to learn the RN ecosystem properly.
The main technical challenge was the swipe card stack — I built it with Reanimated 3
and Gesture Handler, which gave me a real feel for how RN handles animations differently
from Flutter. I also built a scripted onboarding tutorial that demonstrates the swipe
gestures using Reanimated sequences before the user touches anything.
The data comes from the Jikan API (MyAnimeList) with a small rate-limit queue
to stay within their 3 req/sec limit. It's on GitHub and published as an APK."_

---

## Timeline

```
Week 1  → Phase 1 (foundation) + Phase 2 (tutorial — learn Reanimated basics)
Week 2  → Phase 3 (swipe stack — the hard part, learn Reanimated + Gesture Handler)
Week 3  → Phase 4 + 5 (list, detail, polish, publish)
```

---

## Status colour system

| Status        | Colour | Hex       |
| ------------- | ------ | --------- |
| Plan to Watch | Gray   | `#888888` |
| Watching      | Amber  | `#fbbf24` |
| Completed     | Green  | `#4ade80` |

Rationale: purple is the app's primary accent — reserving it for interactive UI elements only (active tab, selected chips, buttons). Status colours are purely semantic and follow a natural progression: neutral → active → done.
