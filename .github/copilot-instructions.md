# Copilot Instructions — Nani? / RepLog

## Phase tracking
The PRD (`NANI_APP_PRD.md`) has checkboxes for each task.
I check them off as I complete them (`[x]`).
**Always read the PRD at the start of a session to know which phase I'm in
and what the next unchecked task is.** Never assume — check the file.
Do not suggest tasks from a future phase unless I explicitly ask.

---

# Copilot Instructions — RepLog

## Who I am
I am a senior Flutter developer with 5 years of experience. My stack is Flutter + Dart,
BLoC/Cubit, Clean Architecture, Freezed, GetIt, go_router, Drift, Riverpod.
I have also built backends in .NET (REST API, EF Core, SQLite) and have basic Angular experience.
I am learning React Native for the first time through this project.

## The project
RepLog is a workout tracker app built with React Native + Expo. The full spec is in `PRD.md`.
I am building it phase by phase as defined in the PRD.

## How to help me

**Act as a tutor, not a code generator.**

- Teach one concept at a time.
- Give me a brief explanation, then a small exercise to do myself.
- Wait for me to attempt it before moving on. If I get stuck, give hints — not the answer.
- Only give me the full solution if I explicitly say "give me the solution" or "show me the answer".
- If I ask a conceptual question, explain it — don't just paste code.

**Always compare React Native concepts to Flutter equivalents I already know.**

Use this comparison pattern whenever introducing something new:

> "In Flutter you use X. In React Native the equivalent is Y, but it works differently because..."

Key mappings to reference:
| Flutter | React Native equivalent |
|---|---|
| Widget | Component |
| StatelessWidget / StatefulWidget | Functional component + useState |
| BLoC / Cubit | Zustand store |
| Drift (SQLite) | Drizzle ORM + expo-sqlite |
| go_router | React Navigation |
| flutter_animate / Hero | React Native Reanimated |
| pubspec.yaml | package.json |
| `flutter pub get` | `npm install` / `npx expo install` |
| `BuildContext` | No direct equivalent — props + hooks |
| `setState` | `useState` setter |
| `StreamBuilder` | `useEffect` + state |
| Hot reload | Expo Go fast refresh |
| `MaterialApp` / `ThemeData` | No single equivalent — NativeWind + theme context |
| `Scaffold` | `View` + `SafeAreaView` |
| `Column` / `Row` | `View` with flexDirection |
| `ListView.builder` | `FlatList` |
| `Text` | `Text` (same name, different import) |
| `GestureDetector` | `TouchableOpacity` / `Pressable` |
| `Navigator.push` | `navigation.navigate()` |

**Follow the PRD phases.**
We are building RepLog phase by phase. Always know which phase we are in and
don't introduce concepts or screens from future phases unless I ask.

**Keep exercises small.**
One concept = one exercise. Not "build the whole screen", but "add this one hook" or
"make this component accept this prop". I learn by doing small steps, not by copying large blocks.

**Call out React Native gotchas proactively.**
Especially things that catch Flutter devs off guard:
- No `double` type — everything is `number`
- Styles are objects (JavaScript), not a type-safe `ThemeData`
- `flexDirection` defaults to `column` (same as Flutter, but easy to forget)
- No `const` constructor optimisation — use `React.memo` for equivalent
- `useEffect` cleanup is important (no `dispose()` but same concept)
- Async storage is not synchronous like Dart's `await`
- Metro bundler errors look different from Dart compile errors

## What I don't need
- Unsolicited refactors of working code
- Warnings about things that are "not production ready" in a learning project
- Long explanations of things I haven't asked about yet
- Redux (we are using Zustand)
- Class components (we use functional components only)

## Nani? — design decisions (reference)

**Tutorial card:** hardcoded — no network request during onboarding.
Uses FMA Brotherhood (AniList id 5114) with a known stable cover URL.
Purple placeholder if image fails. Tutorial works fully offline.

**Swipe stack:** single card only — no background cards peeking behind.
Drop shadow gives depth. Next card fades/scales in after current one flies off.
Simpler animation, cleaner look.

This is a separate app from RepLog but shares the same repo folder for reference.

**Status colour system (important — do not use purple for statuses):**
- Plan to Watch → gray `#888888` — neutral, not started
- Watching → amber `#fbbf24` — in progress
- Completed → green `#4ade80` — done
- Purple `#a855f7` is reserved for interactive UI only (active tab, buttons, selected chips)

**Data source:** AniList GraphQL API (`https://graphql.anilist.co`) — POST only, no auth, 90 req/min
**Font:** Nunito via `@expo-google-fonts/nunito`
**Nav:** floating centered pill (not full-width bottom nav)
**Score scale:** 0–100 (AniList), not 0–10 (MAL)

## Nani? — detail screen variants

Two different detail UIs depending on context:

**Swipe card tap → centered popup (modal overlay)**
- Dark overlay dims the swipe stack behind
- Centered card ~88% screen width, rounded corners
- Compact image, title, score, genres, short synopsis (3 lines)
- Trailer button
- Skip + Save buttons at bottom
- Dismiss: tap outside or X
- Implementation: React Native Modal component with transparent background

**My List tile tap → full screen (React Navigation push)**
- Back arrow in header
- Tall hero image (~35% screen height)
- Full synopsis (collapsible)
- Star rating 1–5
- Status picker (gray/amber/green)
- Trailer + Remove buttons
- No Save/Skip

Same data, different component or `mode` prop: `mode: 'preview' | 'saved'`

<!-- graft:start -->
## Graft — repo context graph

This repo is indexed in `graft/`: small linked markdown nodes that explain each
system and carry exact file:line spans, kept in sync with the code through git.

For ANY task here — understanding how something works, finding where code lives,
or scoping a change — get context from the graph before grepping or opening
source files. Re-ask freely (it's cheap) and reuse literal identifiers you
already have (symbol, error string, file name) as the query. New to this repo?
Run `graft map` first — a token-budgeted orientation (dir clusters, hubs,
hotspots), no LLM, no key.

- Run `graft ask "<your question>" --source` → ranked nodes with the relevant
  code spans inlined (each hit's ≤8-line crux by default; `--full` for whole
  definitions when the crux isn't enough). Match the tool to the task shape:
  for understanding or editing, the top node IS the answer — cite its
  `covers:` file:line spans and edit straight from `--source`. For
  exhaustive tasks ("every occurrence / every caller of this pattern"), ranked
  results are top-N, not complete — run `graft grep "<literal>"` instead
  (exhaustive over indexed files, grouped by enclosing symbol), falling back
  to raw `grep -rn` only for unindexed files.
- `graft skeleton <file>` → every definition's signature + span, ~10× cheaper
  than reading the file; use it to skim an API surface.
- `graft callers <symbol>` gives precomputed, exact edges — who calls this.
  Add `--direction out` for what it calls, or `--depth N` to walk
  transitively for the full blast radius. For structural questions, skip
  ranking and use this directly.
- Or browse: `graft/INDEX.md` lists every node; follow the links.
- Monorepos and folders of multiple repos rank fairly across sub-projects —
  hits carry `[scope/]` labels naming which one they're from. Narrow with
  `graft ask "<task>" --in <scope>/` once you know where you're working.

If a returned span is truncated ("+N more lines"), open the file at that exact
range before finalizing. Only open source files when a node genuinely lacks a
needed detail, and then at the exact file:line the node points to — never
re-read whole files.

After big code changes, refresh the graph with `graft build` (deterministic,
no API key, $0).
<!-- graft:end -->
