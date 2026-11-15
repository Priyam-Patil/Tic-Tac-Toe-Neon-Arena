# 🎮 TIC TAC TOE — NEON ARENA

### ✨ Classic Game • Modern Design • Intelligent AI

A modern, interactive Tic Tac Toe web application featuring smart AI opponents, local multiplayer, beautiful themes, smooth animations, and persistent game statistics.

**React.js • TypeScript • Vite • Tailwind CSS • Motion**

### 🚀 [PLAY LIVE GAME](https://tic-tac-toe-neon-arena-2iww.vercel.app/)

[🌐 Live Demo](https://tic-tac-toe-neon-arena-2iww.vercel.app/) 
[💻 Source Code](https://github.com/Priyam-Patil/Tic-Tac-Toe-Neon-Arena) 
[📚 Documentation](docs/PROJECT_DOCUMENTATION.md)


## 🌟 Project Overview

**Tic Tac Toe — Neon Arena** is a modern web-based gaming application built using **React.js, TypeScript, Vite, and Tailwind CSS**.

The project transforms the classic Tic Tac Toe game into an engaging and interactive experience with intelligent computer opponents, customizable game settings, colorful themes, and smooth animations.

Players can challenge the computer at different difficulty levels or compete with friends using local multiplayer.

The application also includes game statistics, winning streaks, sound effects, match history, and replay functionality.

**The game runs entirely in the browser without requiring a backend server, database, or user authentication.**


## 🚀 Live Demo

🎮 **Play Online:**  
https://tic-tac-toe-neon-arena-2iww.vercel.app/

💻 **GitHub Repository:**  
https://github.com/Priyam-Patil/Tic-Tac-Toe-Neon-Arena

☁️ **Deployment Platform:** Vercel



## ✨ Features

### 🎯 Game Modes

- 👥 **Player vs Player** — Two players can compete on the same device.
- 🤖 **Player vs Computer** — Challenge an intelligent AI opponent.
- ⚡ **Quick Play** — Start a match instantly.
- ✏️ Custom player names.
- ❌⭕ Choose X or O.
- 🔄 Select the starting player.

### 🤖 AI Difficulty Levels

| Difficulty | Description |
|------------|-------------|
| 🟢 Easy | Random valid moves, suitable for beginners |
| 🟡 Medium | Detects winning opportunities, blocks threats, and mixes strategic moves with random moves |
| 🔴 Hard | Uses an optimized Minimax-based algorithm to play optimally |

### 🎨 Modern UI & Design

- 🌈 Attractive and colorful user interface
- 🌞 Light theme
- 🌙 Dark theme
- ✨ Smooth animations and transitions
- 🏆 Animated winning combinations
- 🎉 Victory celebrations
- 📱 Responsive design for mobile, tablet, and desktop
- ♿ Keyboard accessibility and reduced-motion support

### ⚡ Game Controls

- ▶️ Start Match
- 🔁 Restart Game
- ⏭️ Play Again / Next Round
- ↩️ Undo Move
- 💡 Hint
- 🔄 Reset Scores
- 🏠 Home Navigation
- ⚙️ Game Preferences

### 📊 Statistics & History

- 🏆 Total Wins
- ❌ Total Losses
- 🤝 Total Draws
- 🔥 Current Winning Streak
- ⭐ Best Winning Streak
- 📜 Match History
- 🎬 Game Replay
- 💾 Automatic LocalStorage Persistence

### 🔊 Audio & Preferences

- 🎵 Background Music
- 🔔 Interactive Sound Effects
- 🔇 Sound On/Off
- 🌗 Theme Switching
- ✨ Animation Settings
- 💾 Saved Preferences



## 🛠️ Technology Stack

### 🎨 Frontend

| Technology | Purpose |
|------------|---------|
| React.js 19 | Interactive user interface and reusable components |
| TypeScript 5.9 | Type-safe application development |
| Vite 7 | Development server and production builds |
| Tailwind CSS 4 | Responsive styling |
| CSS3 | Custom themes, layouts, and animations |
| Motion 12 | Smooth transitions and animated elements |
| Lucide React | Modern interface icons |

### 🧠 Game Logic & Browser APIs

| Technology | Purpose |
|------------|---------|
| TypeScript | Game rules and AI implementation |
| Minimax / Negamax | Optimal Hard AI decisions |
| React Hooks | State and component interactions |
| LocalStorage | Game progress, statistics, and preferences |
| Web Audio API | Sound effects and background music |

### 🧪 Testing

| Tool | Purpose |
|------|---------|
| Vitest | Automated testing |
| React Testing Library | Component interaction testing |
| jsdom | Simulated browser testing |
| TypeScript Compiler | Type checking |
| npm audit | Dependency security checks |

### 🔧 Development Tools

- Visual Studio Code
- OpenAI Codex
- Git
- GitHub
- Node.js
- npm
- Browser Developer Tools
- Vercel



## 📁 Project Structure

```text
Tic-Tac-Toe-Neon-Arena/
│
├── public/
│   └── favicon.svg
│
├── src/
│   ├── components/
│   │   ├── AnimationContext.ts
│   │   ├── Mark.tsx
│   │   ├── Modal.tsx
│   │   ├── Replay.tsx
│   │   ├── Scoreboard.tsx
│   │   └── WinningLine.tsx
│   │
│   ├── game/
│   │   ├── logic.ts
│   │   ├── logic.test.ts
│   │   ├── store.ts
│   │   └── store.test.ts
│   │
│   ├── hooks/
│   │   ├── useAudio.ts
│   │   └── useAudio.test.ts
│   │
│   ├── test/
│   │   └── setup.ts
│   │
│   ├── App.tsx
│   ├── App.test.tsx
│   ├── upgrade.test.tsx
│   ├── main.tsx
│   └── styles.css
│
├── scripts/
│   ├── security-check.mjs
│   ├── check-production.mjs
│   └── build-documentation.py
│
├── docs/
│   ├── PROJECT_DOCUMENTATION.md
│   ├── Tic-Tac-Toe-Neon-Arena-Documentation.pdf
│   └── screenshots/
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── vercel.json
├── RUNNING_GUIDE.md
├── VERIFICATION.md
└── README.md
```



## ⚙️ System Requirements

Before running the project, install:

- **Node.js:** Version 22.12 or later, compatible with Vite 7
- **npm:** Package manager
- **Git:** For cloning the repository
- **Visual Studio Code:** Recommended code editor
- **Browser:** Chrome, Edge, Firefox, or Safari

**Note:** No backend, MongoDB, external API, or environment variables are required.



## 💻 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Priyam-Patil/Tic-Tac-Toe-Neon-Arena.git
```

### 2️⃣ Navigate to the Project Folder

```bash
cd Tic-Tac-Toe-Neon-Arena
```

### 3️⃣ Install Dependencies

```bash
npm ci
```

### 4️⃣ Start the Development Server

```bash
npm run dev
```

### 5️⃣ Open the Application

Open the local URL displayed in the terminal, usually:

```text
http://localhost:5173/
```

🎉 The game is ready to play!


## 🔄 Main Functional Flow

### 👥 Player vs Player

1. Open the application.
2. Select Local Multiplayer.
3. Enter player names.
4. Choose the starting symbol.
5. Start the match.
6. Players take turns placing X and O.
7. The game automatically detects wins and draws.
8. Match scores update after completion.
9. Select Play Again for another round.

### 🤖 Player vs Computer

1. Select Vs Computer.
2. Choose Easy, Medium, or Hard difficulty.
3. Select X or O.
4. Choose the starting player.
5. Start the game.
6. The player makes a valid move.
7. The AI calculates and plays its response.
8. The game checks for a winner or draw.
9. Statistics and history update after the round.


## 🧠 Game Logic & Algorithms

### 🎯 Board Representation

The game uses a **3×3 board** containing nine cells.

Each cell can contain:

```text
X
O
null
```

`null` represents an empty cell.

### 🏆 Winner Detection

The game checks eight possible winning combinations:

```text
Horizontal:
[0, 1, 2]
[3, 4, 5]
[6, 7, 8]

Vertical:
[0, 3, 6]
[1, 4, 7]
[2, 5, 8]

Diagonal:
[0, 4, 8]
[2, 4, 6]
```

A player wins when three matching symbols appear in any winning combination.

If all nine cells are filled without a winner, the game ends in a draw.

### 🤖 AI Implementation

**Easy AI**
- Selects a random available cell.
- Designed for casual gameplay.

**Medium AI**
- Checks for immediate winning moves.
- Blocks immediate opponent threats.
- Combines optimal and random decisions.

**Hard AI**
- Uses a Negamax implementation of Minimax.
- Evaluates possible future moves.
- Uses cached board positions.
- Selects an optimal move.
- Cannot be defeated when playing correctly.



## 💾 Data Storage

The application uses **LocalStorage** to save:

- Theme preferences
- Sound and music settings
- Animation preferences
- Active game session
- Match statistics
- Winning streaks
- Recent game history

Data is restored when the application is reopened in the same browser.

No cloud database is used.


## 🧪 Testing & Verification

The application includes automated tests for:

- Winning combinations
- Draw detection
- Move validation
- Player turns
- AI move selection
- Hard AI strategy
- Undo functionality
- Restart and rematch
- Score calculation
- LocalStorage validation
- Theme preferences
- Audio behavior
- Match history and replay
- React component interactions

### ▶️ Run Tests

```bash
npm test
```

### 🔐 Security Check

```bash
npm run security:check
```

### 🏗️ Production Build

```bash
npm run build
```

### 👀 Preview Production Build

```bash
npm run preview
```

### ✅ Documented Verification Results

| Verification | Result |
|--------------|--------|
| Automated Tests | 59 Passed |
| Production Build | Passed |
| TypeScript Checks | Passed |
| Dependency Audit | 0 Reported Vulnerabilities |
| Security Scan | Passed |
| Responsive Browser Emulation | Passed |

---

## 🌍 Deployment

The project is deployed using **Vercel**.

### 🌐 Live Website

https://tic-tac-toe-neon-arena-2iww.vercel.app/

### ⚙️ Deployment Configuration

| Setting | Value |
|---------|-------|
| Hosting Platform | Vercel |
| Framework | Vite |
| Root Directory | Project root |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

The application is a static frontend project and does not require a backend server.


## 📸 Application Screens

The application includes:

- 🏠 Home / Welcome Screen
- 🎮 Game Arena
- ⚙️ Match Setup
- 🤖 AI Difficulty Selection
- 🏆 Result Dialog
- 📊 Statistics Dashboard
- 🎬 Game Replay
- 🌞 Light Theme
- 🌙 Dark Theme
- 📱 Mobile Layout

Screenshots are maintained in the `docs/screenshots/` directory.



## 🎯 Project Highlights

- ✅ React + TypeScript application
- ✅ Modern and responsive interface
- ✅ Beautiful light and dark themes
- ✅ Player vs Player gameplay
- ✅ Player vs Computer gameplay
- ✅ Three AI difficulty levels
- ✅ Minimax-based Hard AI
- ✅ Winning animations and sound effects
- ✅ Undo, hints, and restart controls
- ✅ Match history and replay
- ✅ Persistent game statistics
- ✅ Automated testing
- ✅ Vercel deployment
- ✅ GitHub source code



## 🚀 Future Improvements

Possible future enhancements:

- 🌐 Online Multiplayer
- 🏆 Global Leaderboards
- 🎖️ Achievements
- ☁️ Cloud-Based Statistics
- 🎨 Additional Themes
- 📱 Progressive Web App Support
- 🔔 More Audio Customization


## 📚 Documentation

Detailed project documentation is available here:

📖 [Technical Documentation](docs/PROJECT_DOCUMENTATION.md)

📄 [PDF Documentation](docs/Tic-Tac-Toe-Neon-Arena-Documentation.pdf)


## 👨‍💻 Author

**Priyam Patil**

🎓 Information Science and Engineering Student  
🏫 KLS Gogte Institute of Technology, Belagavi

💻 Interested in Full-Stack Development, Java, DSA, and AI.

**GitHub:** https://github.com/Priyam-Patil
