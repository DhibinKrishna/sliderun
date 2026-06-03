# SlideRun - Puzzle Game

A challenging and interactive tile-sliding puzzle game built with vanilla JavaScript and modern CSS. The goal is to arrange numbered tiles in ascending order within a grid by sliding them into the empty space in the fewest moves possible.

## 🚀 Features

### 🧩 Core Gameplay
- **Dynamic Grid Sizes**: Supports difficulty levels from **2x2** up to **9x9** grids.
- **Solvability Guarantee**: Boards are randomized by shuffling backwards from a solved state, guaranteeing that every generated board can be solved.
- **Move Counter**: Real-time count of steps taken, displayed at the bottom right.
- **Keyboard Navigation**: Move tiles using arrow keys or shift key modifiers for rapid edge slides.
- **Mobile Optimized**: Responsive touch-friendly tap controls.

### 🏆 Achievements & Leaderboard (History)
- **Top 10 Best Runs**: Persistent tracking of top 10 step counts sorted from fewest to most moves.
- **Variant Filtering**: Filter scores by variant (grid size) directly in the history overlay.
- **Auto-Focus Selection**: Opening history from an active game automatically filters history to that variant.
- **Local Persistence**: Scores are saved to browser `localStorage` and persist across page loads.

### 🎊 Celebration & Modals
- **Victory Confetti**: High-performance canvas confetti animations explode upon successful solve.
- **Interactive Info Sheet**: A modal dialog explaining rules, touch controls, and keyboard shortkeys.

### 🎨 Premium Aesthetics
- **Modern Dark Palette**: Sleek neon-cyan and teal color system styled via CSS variables.
- **Responsive Layout**: Fluidly scales using modern CSS boundaries (`min()`) to fit both viewport width and height.

---

## 📂 Project Structure

SlideRun is structured as a **self-contained, single-page application** to maximize load speed and simplify deployment:

```
/sliderun
├── index.html       # Single file containing HTML layout, CSS styles, and JS logic
├── AGENTS.md        # AI Agent context and code conventions
├── README.md        # Main developer documentation
├── LICENSE          # MIT License file
└── assets/
    ├── favicon-16x16.png
    └── favicon-32x32.png
```

---

## 🏁 How to Play

1. Open `index.html` directly in any web browser.
2. Select your desired grid size challenge (**2x2** to **9x9**).
3. **Move Tiles**:
   - **Click/Touch**: Click any tile in the same row or column as the blank space to slide it (multiple tiles can slide at once!).
   - **Keyboard Arrow Keys**: Press Arrow keys to shift the blank square by one tile.
   - **Shift + Arrow Keys**: Move the blank square all the way to the edge of the grid.
4. Solve the grid by ordering numbers ascending from `1` (top-left) to `N-1`, leaving the bottom-right corner empty.
5. Access the **History Button** (clock icon in the top right) at any time to review your ranking!

---

## 🛠️ Tech Stack
- **HTML5 & CSS3**: Responsive grid layout and custom theme tokens.
- **Vanilla JavaScript**: State handling, history APIs, and game loop logic.
- **Canvas-Confetti**: Loaded via defer CDN to display victory fireworks.
- **LocalStorage**: Used for leaderboard score serialization.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
