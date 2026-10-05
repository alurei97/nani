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

| Signal | What it shows |
|---|---|
| Swipe cards with Reanimated gestures | The RN-specific skill that separates devs |
| AniList GraphQL integration | Real API concerns, non-trivial query design, rate-limit awareness |
| Onboarding/tutorial with scripted animation | Reanimated sequences, not just gestures |
| Zustand + Drizzle (local list) | Modern RN state + type-safe SQLite |
| Image-heavy UI (anime posters) | Completely different visually |
| Genre/type/score filters | Non-trivial UI, shows product thinking |

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React Native + Expo (managed) |
| Navigation | React Navigation v6 (Stack + Bottom Tabs) |
| State | Zustand (swipe session, filter state) |
| Local DB | Drizzle ORM + expo-sqlite (saved list) |
| Animations | React Native Reanimated 3 |
| Gestures | React Native Gesture Handler |
| Font | Nunito (Google Fonts via @expo-google-fonts/nunito) |
| Styling | NativeWind (Tailwind for RN) |
| GraphQL | Apollo Client (for RN) or urql |
| Images | expo-image (faster than RN Image, built-in cache) |
| Testing | Jest + React Native Testing Library |
| Build | Expo EAS Build (free tier → APK) |

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
      genre_in: $genres           # omit for random mode
      format: $format             # omit for random mode
      averageScore_greater: $score  # omit for random mode
      isAdult: false
      sort: SCORE_DESC
    ) {
      id
      title { romaji english }
      coverImage { large }
      averageScore    # 0–100 (not 0–10 like MyAnimeList)
      episodes
      format          # TV, MOVIE, OVA, ONA
      genres
      description(asHtml: false)
      status
      trailer { id site }  # YouTube video ID
    }
    pageInfo { lastPage }
  }
}
```

**Random strategy:** no native random endpoint — use random page number instead.
AniList has ~15,000 anime (~600 pages at 25/page). Pick `Math.floor(Math.random() * lastPage) + 1`.
First call returns `pageInfo.lastPage` — store it, use for subsequent random page picks.

**Key fields (AniList GraphQL response):**
- Genres are strings: `"Action"`, `"Fantasy"`, `"Romance"` etc. (not numeric IDs)
- Score is 0–100: slider value × 10 → `averageScore_greater`
- Format: `TV`, `MOVIE`, `OVA`, `ONA` (not `type`)
- `id` — AniList's own integer ID. Store this, not MAL's mal_id (different system)
- Image: `coverImage.large` (direct URL, 2:3 portrait, good quality)
- Trailer: `trailer.id` + `trailer.site` → construct YouTube URL: `youtube.com/watch?v={id}`

**Genres (strings, pass directly as variables):**
```
Action, Adventure, Comedy, Drama, Fantasy, Horror,
Romance, Sci-Fi, Slice of Life, Thriller, Mystery, Psychological
```

**Genre cache:** call once with `query { GenreCollection }`, store in AsyncStorage forever.

---

## Screens

### 1. Tutorial (first launch only)
- Shown once, stored via AsyncStorage (`tutorial_seen`)
- 3 animated steps, each auto-plays then waits:
  - Step 1: card auto-swipes RIGHT → green heart appears → "Swipe right to save"
  - Step 2: card auto-swipes LEFT → red X appears → "Swipe left to skip"
  - Step 3: static My List preview → "Find it in your list later"
- Skip button top right
- "Got it" CTA on step 3
- Tutorial card is **hardcoded** — no network request on onboarding:
  ```js
  const TUTORIAL_ANIME = {
    id: 5114,
    title: 'Fullmetal Alchemist: Brotherhood',
    coverImage: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx5114-KJTQz9AIm6Wk.jpg',
    averageScore: 94,
  }
  ```
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

### 5a. Anime Detail — Swipe preview (centered popup)
Triggered by tapping a card in the swipe stack. Still in the discovery flow — overlay
dims the stack behind it, popup appears centered. Quick decision helper, not management.
- Semi-transparent dark overlay (swipe stack still faintly visible behind)
- Centered card ~88% screen width, rounded corners
- Compact image header (shorter than full screen)
- Title, score, episodes, format, genre chips
- Synopsis (3 lines max, no expand)
- Trailer button
- Two action buttons: **Skip** (outlined) and **Save** (purple filled) — same as swiping
- Dismiss: tap outside or X button

### 5b. Anime Detail — My List (full screen)
Triggered by tapping a tile in My List. Pushed via React Navigation Stack — full screen,
back arrow top left. Management mode: user already saved this, now rating/tracking it.
- Back arrow navigation header
- Tall hero image (covers ~35% of screen height)
- Title, score, episodes, format, genre chips
- Full synopsis (collapsible if long)
- Your rating: 1–5 stars
- Status picker: Plan to Watch / Watching / Completed (with semantic colours)
- Trailer button + Remove from list button
- No Save/Skip (already saved)

---

## Technical Backlog

### Phase 1 — Foundation
- [ ] Expo project init with TypeScript template
- [ ] React Navigation: Bottom Tabs (Discover, My List) + Stack for sheets
- [ ] NativeWind 
- [ ] Theme setup (dark, purple/pink accent — anime aesthetic)
- [ ] Drizzle + expo-sqlite: `saved_anime` table (anilist_id, title, image_url, score,
      episodes, format, synopsis, genres, status, rating, saved_at)
- [ ] Zustand: filter state + swipe session (current card pool, index, fetching)
- [ ] AniList GraphQL client (Apollo Client or urql): query wrapper, error handling, genre fetch + cache

### Phase 2 — Tutorial
- [ ] AsyncStorage check on app start → show tutorial if not seen
- [ ] Tutorial screen: 3 steps with scripted Reanimated card animation
  - [ ] Hardcoded TUTORIAL_ANIME constant (no network request)
  - [ ] `useSharedValue` for card X position and rotation
  - [ ] `withTiming` sequence: slide right → pause → snap back → slide left → pause → snap back
  - [ ] Interpolated opacity for heart/X icons as card moves
  - [ ] Purple placeholder shown if cover image fails to load
- [ ] Step indicator dots
- [ ] Skip + Got it buttons → set `tutorial_seen` → navigate to Discover

### Phase 3 — Filter + Swipe
- [ ] Filter screen: genre chips, type segmented control, score slider
- [ ] AniList query on button press: filtered or unfiltered Page query with random page number
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
const seen = await AsyncStorage.getItem('seen_ids');
const seenSet = new Set(JSON.parse(seen ?? '[]'));
const fresh = results.filter(a => !seenSet.has(a.id) && !savedIds.has(a.id));
const updated = [...seenSet, ...fresh.map(a => a.id)].slice(-500);
await AsyncStorage.setItem('seen_ids', JSON.stringify(updated));
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

*"Nani? is a React Native anime randomizer I built to learn the RN ecosystem properly.
The main technical challenge was the swipe card stack — I built it with Reanimated 3
and Gesture Handler, which gave me a real feel for how RN handles animations differently
from Flutter. I also built a scripted onboarding tutorial that demonstrates the swipe
gestures using Reanimated sequences before the user touches anything.
The data comes from the Jikan API (MyAnimeList) with a small rate-limit queue
to stay within their 3 req/sec limit. It's on GitHub and published as an APK."*

---

## Timeline

```
Week 1  → Phase 1 (foundation) + Phase 2 (tutorial — learn Reanimated basics)
Week 2  → Phase 3 (swipe stack — the hard part, learn Reanimated + Gesture Handler)
Week 3  → Phase 4 + 5 (list, detail, polish, publish)
```

---

## Status colour system

| Status | Colour | Hex |
|---|---|---|
| Plan to Watch | Gray | `#888888` |
| Watching | Amber | `#fbbf24` |
| Completed | Green | `#4ade80` |

Rationale: purple is the app's primary accent — reserving it for interactive UI elements only (active tab, selected chips, buttons). Status colours are purely semantic and follow a natural progression: neutral → active → done.