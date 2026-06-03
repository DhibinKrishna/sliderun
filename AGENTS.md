# Agent Context & Documentation (AGENTS.md)

Welcome! This document provides technical context, architecture breakdown, and guidelines for AI agents working on **SlideRun**.

## 🏗️ Architecture Overview

SlideRun is designed as a **completely self-contained, single-file web application**. All components, layout styles, and game logic reside in [index.html](index.html).

### Key Files
- **[index.html](index.html)**: The entire game client (HTML, CSS styling, and Vanilla JS logic).
- **[assets/](assets)**: Contains favicons.
- **[LICENSE](LICENSE)**: MIT License.

---

## 💾 State Variables

The game state is managed globally through the following variables:
- `_size` (number): The grid dimension (e.g., `4` for a 4x4 grid). Valid values are `2` to `9`.
- `_squares` (2D Array): Represents the grid layout. Each element is an object: `{ id, value, isModified }`.
- `_blankSquare` (Array `[row, col]`): The current coordinate of the blank/empty square.
- `_count` (number): Tracks the player's move count for the current session.
- `_success` (boolean): Flag set to `true` when the board is successfully solved.
- `_nextToBeSolvedId` / `_laterToBeSolvedId` (number): DOM element IDs for tiles that are close to their solved values (used for styling cues).
- `infoModal` / `historyModal` (HTMLDialogElement): References to the modal `<dialog>` elements.

---

## ⚙️ Core Algorithms & Navigation

### 1. Board Solvability
Instead of using complex inversion math to determine random solvability, SlideRun guarantees solvability by shuffling the board *backwards* from the solved state. The blank square travels randomly `Up/Down/Left/Right` for a dynamic number of iterations (scaled based on grid size).

### 2. Multi-Tile Shifting (`shift`)
When a tile is clicked, any intermediate tiles in the same row or column leading up to the blank square are shifted simultaneously. The direction parameter (`"up" | "down" | "left" | "right"`) controls this transaction.

### 3. Navigation & Popstate
URL parameters determine screen navigation:
- `?size=N` starts a game of size `N`.
- Going home clears the URL parameter and pushes state to history.
- Navigation utilizes `popstate` events to allow normal browser Back/Forward movement between screens.

---

## 🎨 CSS Style System & Tokens

SlideRun uses a responsive, dark-themed, glassmorphic layout centered on custom CSS properties:
- `--body-background-color-1` & `--body-background-color-2`: Background gradient colors.
- `--primary-color` (`#78a996`): Brand base/text color.
- `--glow-color` (`#00ffcc`): Accent cyan color used for focus states and move counts.
- `--solved-color` (`#34d399`): Green highlight for correctly placed tiles.
- `--next-to-solve-color` / `--later-to-solve-color`: Colored cues to guide players on which tile to move next.

---

## 🏆 Score Persistence (Leaderboard)

Scores are persisted in `localStorage` under the key `sliderun_scores` as a JSON array of objects:
```json
[
  { "size": 3, "steps": 12, "date": "2026-06-03T10:00:00.000Z" }
]
```
- **Sorting**: Lowest step count first. Ties are resolved by sorting newer dates first.
- **Filtering**: Modal view (`#history-modal`) allows filtering by size variant (`2x2` to `9x9`) or `"all"`. If opened from a variant game screen, the filter defaults to that variant.

---

## 🔍 Validation & Testing Tools

Always validate changes using the verification utilities:
1. **HTML Validation**:
   ```bash
   python3 verify_html.py
   ```
   Ensures that tags are balanced, critical layout IDs are present, and core functions exist in the Javascript block. (Note: A copy of this script is maintained inside the local configuration scratch folder).
2. **Javascript Compilation Check**:
   ```bash
   node verify_js.js
   ```
   Extracts and parses the JS block using Node's `vm` compiler to catch syntax errors before execution. (Note: A copy of this script is maintained inside the local configuration scratch folder).
