# Arena_Grid

Arena is a React Native app that hosts multiple games under one roof. The first game is **Sudoku**; more will be added progressively. This document describes how the app is structured and how work flows, with no implementation code.

---

## 1. Goals

- A **home screen** that shows every available game as a card.
- A **game screen** that opens the selected game.
- **Adding a new game should be cheap**: one new folder plus one registry entry, with no changes to navigation or the home screen.
- Each game is **self-contained**; games never import from each other.
- Game rules (logic) are **separate from UI**, so they can be tested without rendering anything.

---

## 2. Tech Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | React Native with Expo | Fast setup, easy device testing |
| Language | TypeScript | Safer refactors as games multiply |
| Navigation | Expo Router (file-based) | Screens map to files; deep links come free |
| State (local) | React state / hooks | Enough for a single game session |
| State (shared, later) | Zustand | Light, one store per game plus one global |
| Persistence (later) | AsyncStorage | Saved games, best times, settings |
| Testing | Jest | Pure logic is easy to unit test |

---

## 3. High-Level Architecture

The app has three layers, and dependencies only point downward.

1. **Shell layer** — navigation, home screen, shared UI, theme. Knows games exist, but not what any specific game does.
2. **Registry layer** — a single list of game definitions. This is the contract between the shell and the games.
3. **Game layer** — each game's UI, logic and state, fully isolated.

```
        ┌──────────────────────────────┐
        │  Shell (screens, navigation) │
        └──────────────┬───────────────┘
                       │ reads
        ┌──────────────▼───────────────┐
        │   Game Registry (the list)   │
        └──────────────┬───────────────┘
                       │ points to
   ┌───────────────────┼───────────────────┐
   ▼                   ▼                   ▼
 Sudoku            Future game        Future game
```

The shell never references "Sudoku" by name anywhere. It only knows "a game definition."

---

## 4. Folder Structure

```
app/                       Routes (Expo Router)
  _layout                  Root navigator (stack)
  index                    Home: grid of game cards
  game/[id]                Generic game screen

src/
  components/              Shared UI used by the shell (GameCard, etc.)
  theme/                   Colors, spacing, typography
  store/                   Global stores (later: settings, stats)
  games/
    types                  The GameDefinition contract
    registry               The only list of games
    sudoku/
      index                Game entry component
      components/          Board, Cell, NumberPad, Controls
      logic/               Generator, solver, validator, difficulty
      state/               Game store/hooks for this game
      __tests__/           Logic unit tests
```

Rule of thumb: **`app/` = where screens live, `src/` = what they're built from.**

---

## 5. The Game Contract

Every game is described by a **game definition** with these fields:

| Field | Purpose |
|---|---|
| `id` | Unique, URL-safe identifier, used in the route |
| `title` | Name shown on the card and in the header |
| `description` | One-line summary on the card |
| `emoji` / icon | Visual on the card |
| `color` | Card accent color |
| `component` | The game's root component to render |
| `comingSoon` (optional) | Shows a disabled card |

This contract is the **only coupling** between the shell and a game. Later it can grow (difficulty options, min player count, supports multiplayer, etc.) without touching the shell's structure.

---

## 6. Screens & Navigation

### Home screen (Arena)
- Reads the full list from the registry.
- Renders a two-column grid of cards.
- Tapping a card navigates to the game screen using the game's `id`.
- Disabled cards (coming soon) are visible but not tappable, which also works as a roadmap.

### Game screen
- Reads the `id` from the route.
- Looks the game up in the registry.
- If found: sets the header title and renders the game's component.
- If not found: shows a friendly "game not found" state (covers bad deep links).
- Hosts shared chrome (header, back button, later a pause/menu), so games don't each rebuild it.

### Navigation model
A single **stack navigator**: Home → Game. Back returns to Home. If shared areas are needed later (Stats, Settings), the shell can be upgraded to a **tab bar** with Home as one tab, without affecting any game.

---

## 7. Request Flow (what happens when a user taps a game)

1. App launches and the root layout mounts the stack navigator.
2. Home screen loads the registry list and renders cards.
3. User taps the Sudoku card.
4. Router pushes the game route with `id = sudoku`.
5. Game screen resolves `sudoku` in the registry.
6. Header title is set; the Sudoku root component mounts.
7. Sudoku initializes its own state (new puzzle or restored save).
8. User plays; back button unmounts the game and returns Home.

Games start fresh on mount and clean up on unmount. Anything that must survive goes through persistence, not component memory.

---

## 8. Inside a Game (using Sudoku as the template)

Each game follows the same internal split so future games feel familiar.

### Logic (pure, no UI)
Plain TypeScript functions and types, with no React or React Native imports.
- Board representation
- Puzzle generation by difficulty
- Solver (also used to verify unique solutions)
- Move validation and conflict detection
- Win detection

Benefits: fast unit tests, reusable if you later add a web version or server, and bugs are easy to isolate.

### State
- Holds the current board, selected cell, notes/pencil marks, history for undo, timer, difficulty.
- Starts as local state or a game-scoped store.
- Exposes actions (select cell, place number, erase, undo, new game) that the UI calls.
- UI never mutates the board directly; it dispatches actions, and the logic layer decides validity.

### UI components
- **Board** → arranges cells
- **Cell** → displays one value, highlights, conflicts
- **NumberPad** → input
- **Controls** → undo, erase, notes toggle, hint, new game
- Components are presentational: they receive data and callbacks, nothing else.

### Data flow within a game
User input → UI event → state action → logic validates → state updates → UI re-renders. One direction, always.

---

## 9. Adding a New Game (the workflow)

1. Create a folder under `games/` named for the game.
2. Build its logic, state and UI inside that folder, following the template above.
3. Export one root component from its entry file.
4. Add one definition entry to the registry.
5. Done. The card appears on Home and the route works automatically.

Checklist before merging a new game:
- [ ] Imports nothing from other games
- [ ] Logic has unit tests
- [ ] Handles mount/unmount cleanly
- [ ] Looks right in light and dark themes (once theming exists)

---

## 10. Cross-Cutting Concerns

| Concern | Where it lives | When |
|---|---|---|
| Theme (colors, spacing, type) | `theme/` | Phase 1 |
| Shared UI primitives (buttons, modals) | `components/` | As needed |
| Settings (sound, haptics, theme) | Global store | Phase 3 |
| Stats (best times, win counts) | Global store keyed by game id | Phase 3 |
| Saved games | Per-game store + AsyncStorage | Phase 3 |
| Sound / haptics | Shared service | Phase 4 |
| Analytics / crash reporting | Shell-level | Later |

Principle: **games request services from the shell; the shell never reaches into a game's internals.**

---

## 11. Development Roadmap

**Phase 1 — Architecture shell**
Project setup, navigation, registry, home grid, generic game screen, placeholder Sudoku.

**Phase 2 — Sudoku core**
Logic first (generator, solver, validator, tests), then board, cells, number pad, win state.

**Phase 3 — Persistence & polish**
Save/resume, best times, difficulty levels, notes, undo, hints, settings.

**Phase 4 — Arena features**
Stats screen, tab bar, sounds and haptics, second game to prove the architecture.

**Phase 5 — Release prep**
App icon, splash, performance pass, accessibility, store builds.

---

## 12. Conventions

- **Naming:** folders lowercase, components PascalCase, one component per file.
- **Boundaries:** `games/*` may import from `components/`, `theme/`, `store/`; never from another game.
- **Logic purity:** anything in a `logic/` folder must be framework-free.
- **Routes stay thin:** screens in `app/` should be nearly empty and delegate to `src/`.
- **Commits:** small and scoped per layer (shell, registry, a game).

---

## 13. Decisions to Revisit Later

- Tab bar vs. stack only, once Stats/Settings exist.
- Single global store vs. one store per game as shared features grow.
- Whether games need a standard lifecycle (pause, resume, restart) exposed by the shell.
- Whether to support multiplayer or online features, which would add a service layer beside the registry.