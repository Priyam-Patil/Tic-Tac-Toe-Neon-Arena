🎮 Tic Tac Toe — Neon Arena

### ✨ Classic Game • Modern Experience • Intelligent AI

**A modern, responsive Tic Tac Toe web application featuring intelligent AI, local multiplayer, beautiful themes, smooth animations, game statistics, and match replay.**

**⚛️ React 19 | 🔷 TypeScript 5.9 | ⚡ Vite 7 | 🎨 Tailwind CSS 4 | 🚀 Vercel**

### 🔗 Explore the Project

- 🎮 **[Play Live Game](https://tic-tac-toe-neon-arena-2iww.vercel.app/)**
- 💻 **[GitHub Repository](https://github.com/Priyam-Patil/Tic-Tac-Toe-Neon-Arena)**
- 📖 **[How to Play — User Guide (PDF)](docs/Neon_Arena_Complete_How_to_Play_Guide.pdf)**
- 📚 **[Technical Documentation](docs/PROJECT_DOCUMENTATION.md)**


## 🌟 1. Project Overview

**Tic Tac Toe — Neon Arena** is a modern, browser-based implementation of the classic Tic Tac Toe game, developed using **React, TypeScript, Vite, and Tailwind CSS**.

The project combines intelligent game logic with an attractive, interactive interface. Players can challenge the computer at three difficulty levels or compete locally with a friend.

### 🎯 Project Objectives

- 🎮 Build a fully functional Tic Tac Toe game.
- 🤖 Implement intelligent AI with three difficulty levels.
- 👥 Support local two-player gameplay.
- 🎨 Create a responsive interface with customizable themes.
- 📊 Track scores, statistics, and match history.
- 💾 Save game progress and preferences using LocalStorage.
- 🧪 Validate functionality through automated testing.
- 🌐 Deploy the application for public access.

**No signup, backend server, or database is required to play.**


## ✨ 2. Key Features

### 🎮 Game Modes

- **👥 Player vs Player:** Two players compete on the same device.
- **🤖 Player vs Computer:** Challenge the AI opponent.
- **⚡ Quick Play:** Start a game quickly.
- **✏️ Match Customization:** Choose player names, X/O symbols, and starting player.

### 🤖 Intelligent AI

- **🟢 Easy:** Selects random valid moves, suitable for beginners.
- **🟡 Medium:** Detects winning opportunities, blocks immediate threats, and combines strategic decisions with random moves.
- **🔴 Hard:** Uses an optimized Minimax/Negamax algorithm to select optimal moves.

### 🎨 Modern User Interface

- 🌞 Beautiful light theme.
- 🌙 Elegant dark theme.
- ✨ Smooth transitions and animations.
- 🎉 Winning celebrations and confetti.
- 🏆 Animated winning combinations.
- 📱 Responsive layout for mobile, tablet, and desktop.
- ♿ Keyboard accessibility and reduced-motion support.

### ⚡ Game Controls

- ↩️ **Undo:** Reverse an eligible move.
- 💡 **Hint:** Get help choosing a move.
- 🔄 **Restart:** Restart the current game.
- ⏭️ **Next Round:** Start another round.
- 🏆 **Reset Scores:** Clear match scores.
- 🔊 **Sound Settings:** Enable or disable sound effects.
- 🎵 **Music Settings:** Control ambient music.

### 📊 Statistics & History

- 🏆 Wins and losses.
- 🤝 Total draws.
- 🔥 Current winning streak.
- ⭐ Best winning streak.
- 📜 Recent match history.
- 🎬 Completed match replay.
- 💾 Automatic browser-based data persistence.


## 🕹️ 3. How to Play — Quick Start

Follow these simple steps to start playing.

### 🌐 Step 1 — Open the Game

- Visit **[Tic Tac Toe — Neon Arena](https://tic-tac-toe-neon-arena-2iww.vercel.app/)**.
- The game opens directly in your browser.
- No installation or account registration is required.

### 🎯 Step 2 — Choose a Game Mode

- **Player vs Player:** Play with a friend on the same device.
- **Player vs Computer:** Challenge the computer.

### ⚙️ Step 3 — Customize Your Match

- Enter player names where applicable.
- Select X or O.
- Choose who plays first.
- For AI mode, select Easy, Medium, or Hard.

### ▶️ Step 4 — Start Playing

- The game uses a **3 × 3 board**.
- Players take turns placing X or O.
- Select an empty cell to make a move.
- In computer mode, the AI automatically responds.

### 🏆 Step 5 — Win the Game

Place three matching symbols in a:

- Horizontal row.
- Vertical column.
- Diagonal line.

If all nine cells are filled without a winner, the game ends in a draw.

### 🔁 Step 6 — Play Again

After completing a round, you can:

- Start another round.
- View updated scores.
- Check match statistics.
- Replay completed games.
- Change game settings.

### 📖 Complete User-Friendly Guide

For detailed instructions about game modes, controls, AI difficulty levels, results, and beginner tips:

**📄 [Read the Complete How-to-Play Guide (PDF)](docs/Neon_Arena_Complete_How_to_Play_Guide.pdf)**



## 🛠️ 4. Technology Stack

### 💻 Frontend Development

- **⚛️ React 19:** Interactive components and application interface.
- **🔷 TypeScript 5.9:** Type-safe game logic and development.
- **⚡ Vite 7:** Fast development server and optimized production builds.
- **🎨 Tailwind CSS 4:** Responsive styling and layouts.
- **🖌️ CSS3:** Custom themes, gradients, and animations.
- **✨ Motion:** Smooth UI transitions and visual effects.
- **🎯 Lucide React:** Modern interface icons.

### 🧠 Game Logic & Browser Features

- **Minimax / Negamax:** Intelligent Hard AI decision-making.
- **React Hooks:** Managing application state and interactions.
- **LocalStorage:** Saving preferences, scores, and match history.
- **Web Audio API:** Sound effects and background audio.

### 🧪 Testing & Development Tools

- **Vitest:** Automated unit and integration testing.
- **React Testing Library:** UI component testing.
- **jsdom:** Browser-like testing environment.
- **Git & GitHub:** Version control and repository hosting.
- **Visual Studio Code:** Development environment.
- **OpenAI Codex:** AI-assisted development.
- **Vercel:** Production deployment.


## 🧠 5. Game Logic & AI Implementation

### 🎯 Board Representation

- The game contains a **3 × 3 grid with nine cells**.
- Each cell can contain X, O, or an empty value.
- Players can only select available cells.
- The application manages turns and validates moves.

### 🏆 Winner Detection

The application checks eight winning combinations:

- Three horizontal combinations.
- Three vertical combinations.
- Two diagonal combinations.

A player wins when three matching symbols occupy a valid winning combination.

If all cells are filled without a winner, the result is a draw.

### 🤖 AI Algorithms

**🟢 Easy AI**

- Chooses a random available cell.
- Provides a simple challenge for beginners.

**🟡 Medium AI**

- Searches for immediate winning moves.
- Blocks immediate opponent threats.
- Combines strategic and random decisions.

**🔴 Hard AI**

- Uses a Minimax-based Negamax search.
- Evaluates possible future board positions.
- Uses caching to reduce repeated calculations.
- Selects optimal moves and cannot be defeated with correct play.

---

## 📂 6. Project Structure

### 📁 Main Folders

- **`public/`** — Static assets and favicon.
- **`src/components/`** — Reusable UI components, scoreboard, dialogs, and replay.
- **`src/game/`** — Game logic, AI algorithms, and state management.
- **`src/hooks/`** — Custom React hooks.
- **`src/test/`** — Automated test configuration.
- **`scripts/`** — Security, production, and documentation utilities.
- **`docs/`** — Technical documentation, project report, screenshots, and user guide.

### 📄 Important Files

- **`src/App.tsx`** — Main game interface and interactions.
- **`src/game/logic.ts`** — Game rules, winner detection, and AI algorithms.
- **`src/game/store.ts`** — Game state, scores, and persistence.
- **`src/hooks/useAudio.ts`** — Audio management.
- **`src/main.tsx`** — React application entry point.
- **`src/styles.css`** — Themes, layouts, and animations.
- **`package.json`** — Dependencies and project scripts.
- **`vite.config.ts`** — Vite configuration.
- **`vercel.json`** — Deployment configuration.
- **`README.md`** — Project overview and setup instructions.


## ⚙️ 7. Installation & Setup

### 📋 Prerequisites

- Node.js 22.12 or later.
- npm package manager.
- Git.
- A modern web browser.

### 1️⃣ Clone the Repository

`git clone https://github.com/Priyam-Patil/Tic-Tac-Toe-Neon-Arena.git`

### 2️⃣ Open the Project Directory

`cd Tic-Tac-Toe-Neon-Arena`

### 3️⃣ Install Dependencies

`npm ci`

### 4️⃣ Start the Development Server

`npm run dev`

### 5️⃣ Open the Application

Visit **http://localhost:5173/** or the local URL displayed in your terminal.

🎉 **Your game is ready to play!**


## 🧪 8. Testing & Quality Assurance

### 🔍 Automated Testing Covers

- Game rules and winning combinations.
- Draw detection and move validation.
- AI decision-making.
- Player turns and game state.
- Undo, restart, and rematch.
- Score calculation.
- LocalStorage persistence.
- Audio preferences.
- Match history and replay.
- UI component interactions.

### ⚙️ Testing Commands

- **`npm test`** — Run automated tests.
- **`npm run security:check`** — Run project security checks.
- **`npm run build`** — Create a production build.
- **`npm run preview`** — Preview the production build.

### ✅ Documented Verification Results

- **59 automated tests:** Passed.
- **TypeScript validation:** Passed.
- **Production build:** Passed.
- **Security checks:** Passed.
- **Dependency audit:** 0 reported vulnerabilities.
- **Responsive browser emulation:** Passed.

*These results reflect the documented verification run.*



## 💾 9. Data Storage

The application uses **browser LocalStorage** to save game data.

### 📌 Stored Information

- 🎨 Theme preferences.
- 🔊 Sound and music settings.
- ⚙️ Game preferences.
- 🏆 Scores and statistics.
- 🔥 Winning streaks.
- 📜 Recent match history.
- 🎮 Active game session.

### ✅ Benefits

- No account registration required.
- No backend or database setup.
- Game preferences remain available when reopening the application in the same browser.

**Note:** LocalStorage data is browser-specific and does not automatically synchronize across devices.



## 🌐 10. Deployment

The application is deployed on **Vercel**.

### 🚀 Live Application

🎮 **[Play Tic Tac Toe — Neon Arena](https://tic-tac-toe-neon-arena-2iww.vercel.app/)**

### ⚙️ Deployment Configuration

- **Hosting Platform:** Vercel.
- **Framework:** Vite.
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Application Type:** Frontend-only React application.

The application does not require a backend server.


## 📚 11. Project Documentation & Resources

Explore the complete project using the following resources.

### 🎮 1. Live Game

- **Description:** Play Tic Tac Toe — Neon Arena directly in your browser.
- **Link:** [🚀 Play Live Game](https://tic-tac-toe-neon-arena-2iww.vercel.app/)

### 💻 2. GitHub Source Code

- **Description:** Explore the complete source code, project structure, and implementation.
- **Link:** [🐙 View GitHub Repository](https://github.com/Priyam-Patil/Tic-Tac-Toe-Neon-Arena)

### 📖 3. User-Friendly Playing Guide

- **Description:** A beginner-friendly PDF explaining how to start, select game modes, play against AI, use controls, and view results.
- **Link:** [📄 How-to-Play Guide (PDF)](docs/Neon_Arena_Complete_How_to_Play_Guide.pdf)

### 📚 4. Technical Documentation

- **Description:** Detailed explanation of project architecture, game logic, AI algorithms, features, and testing.
- **Link:** [📘 View Technical Documentation](docs/PROJECT_DOCUMENTATION.md)

### 📑 5. Complete Project Report

- **Description:** Detailed PDF documentation covering project design, implementation, and verification.
- **Link:** [📕 View Project Report (PDF)](docs/Tic-Tac-Toe-Neon-Arena-Documentation.pdf)



## 🎯 12. Project Highlights

- ✅ Developed a complete browser-based game using React and TypeScript.
- ✅ Implemented intelligent AI with three difficulty levels.
- ✅ Applied Minimax/Negamax algorithms for optimal gameplay.
- ✅ Created a responsive interface with customizable themes.
- ✅ Integrated audio, animations, statistics, and replay functionality.
- ✅ Implemented browser-based data persistence.
- ✅ Added automated testing and security checks.
- ✅ Deployed the application on Vercel.
- ✅ Prepared technical documentation and a beginner-friendly playing guide.



## 🚀 13. Future Enhancements

Potential improvements for future versions:

- 🌐 Online multiplayer.
- 🏆 Global leaderboards.
- 👤 Player profiles.
- 🎖️ Achievements and rewards.
- ☁️ Cloud-based game statistics.
- 📱 Progressive Web App support.
- 🎨 Additional themes and customization.

*These are future ideas and are not features of the current release.*



## 👨‍💻  Developer

**Priyam Patil**

🎓 Information Science and Engineering Student

💻 Interested in Software Development, Full-Stack Applications, Java, Data Structures & Algorithms, and AI.

- 🐙 **GitHub:** [@Priyam-Patil](https://github.com/Priyam-Patil)
- 📂 **Project Repository:** [Tic Tac Toe — Neon Arena](https://github.com/Priyam-Patil/Tic-Tac-Toe-Neon-Arena)

