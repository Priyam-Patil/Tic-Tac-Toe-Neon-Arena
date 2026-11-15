🎮 Tic Tac Toe — Neon Arena

✨ A little rivalry. A lot of fun.
A modern, responsive Tic Tac Toe game featuring smart AI, local multiplayer, beautiful light and dark themes, smooth animations, and match statistics.

⚛️ React 19 | 🔷 TypeScript 5.9 | ⚡ Vite 7 | 🎨 Tailwind CSS 4 | 🚀 Vercel

🎮 PLAY THE GAME
🌐 Live Demo | 💻 Source Code | 📚 **Technical Documentation** | 📖 **How to Play — PDF Guide**

✨ About the Project
Tic Tac Toe — Neon Arena gives the classic 3×3 game a colorful, interactive upgrade. Play against a friend on the same device or challenge the computer at three difficulty levels. Customize your match, use helpful controls, and review your results and match history.

No account, installation, or backend is required to play online. Just open the live website in a modern browser.

🌟 Key Features
🎯 Two game modes: Local Player vs Player and Player vs Computer
🤖 Three AI difficulties: Easy, Medium, and Hard
⚡ Quick Play: Start immediately against Medium AI as X
🎨 Light and dark themes: Responsive, colorful interface
✨ Animations: Animated marks, winning line, and confetti
🔊 Audio: Sound effects and optional ambient music
↩️ Game controls: Hint, Undo, Restart, Next Round, and Reset Scores
📊 Statistics: Wins, losses, draws, and winning streaks
▶️ Replay: Revisit completed games with playback controls
💾 LocalStorage: Saves preferences, statistics, and recent history in your browser
📱 Accessibility: Mobile-friendly layout, keyboard support, and reduced-motion options
🕹️ How to Play — Quick Start
New to Neon Arena? Follow these simple steps:

🌐 Open the game: Launch Neon Arena.
🎮 Choose a mode: Select Quick Play, Player vs Computer, or Player vs Player.
⚙️ Set up your match: Choose player names, X/O, the starting player, and AI difficulty when available.
❌⭕ Make a move: Tap or click an empty square on the 3×3 board. Take turns with your friend or wait for the computer's response.
🏆 Try to win: Get three matching marks in a row, column, or diagonal. If the board fills without a winner, it's a draw.
🔁 Keep playing: View the result, select Next Round / Play Again, and explore scores, history, and replay.
💡 First-time tip: Choose Quick Play for the fastest start, or Easy AI to practice.

📖 Complete User-Friendly Playing Guide
Want to learn every button and game option? Read the illustrated-in-text 4-page beginner guide, which covers getting started, match setup, winning rules, game controls, AI levels, settings, statistics, replay, and quick help.

👉 OPEN THE COMPLETE HOW-TO-PLAY GUIDE (PDF)

Important: To make this PDF link work on GitHub, upload Neon_Arena_Complete_How_to_Play_Guide.pdf into the repository's docs/ folder.

🤖 AI Difficulty Levels
Level	How it plays	Recommended for
🟢 Easy	Picks random legal moves	Beginners
🟡 Medium	Looks for winning moves and blocks threats, with some non-optimal choices	Practice
🔴 Hard	Uses optimized Minimax/Negamax-style search for optimal play	A real challenge
🎮 Game Controls
Control	What it does
💡 Hint	Suggests a good square without placing a mark
↩️ Undo	Reverses the latest move; against AI, it may reverse the AI response too
🔄 Restart	Restarts the current match
⏭️ Next Round / Play Again	Starts a fresh round
🧹 Reset Scores	Clears match scores after confirmation
🏠 Home	Returns to the welcome screen
🌗 Theme	Switches between light and dark modes
🔊 Audio Settings	Controls sound effects and optional music
Some controls are available only at appropriate points during a match.

🧰 Technologies & Tools Used
Technology / Tool	Purpose
React 19	Interactive UI and reusable components
TypeScript 5.9	Type-safe game logic and application state
Vite 7	Development server and production build
Tailwind CSS 4 + CSS	Responsive styling and themes
Motion	Transitions and animations
Lucide React	Interface icons
Web Audio API	Game sounds and ambient audio
LocalStorage	Browser-based settings, scores, and history
Vitest + Testing Library	Automated logic and UI tests
Git & GitHub	Version control and source hosting
Vercel	Live website hosting
⚙️ Requirements & Installation
To play online: A phone, tablet, or computer with a modern browser and internet connection is enough.

To run the source code locally: Install Node.js 22.12+, npm, and Git.

1️⃣ Clone the Repository
git clone https://github.com/Priyam-Patil/Tic-Tac-Toe-Neon-Arena.git
2️⃣ Open the Project Folder
cd Tic-Tac-Toe-Neon-Arena
3️⃣ Install Dependencies
npm ci
4️⃣ Start the Development Server
npm run dev
Open the local address shown in the terminal (usually http://localhost:5173/).

🧪 Test & Build
npm test                 # Automated tests
npm run security:check   # Project security checks
npm run build            # Production build
npm run preview          # Preview the build
📂 Project Structure
Tic-Tac-Toe-Neon-Arena/
├── public/                    # Static assets
├── src/
│   ├── components/            # Game UI, dialogs, scoreboard, replay
│   ├── game/
│   │   ├── logic.ts           # Rules and AI moves
│   │   └── store.ts           # State, scores, persistence
│   ├── hooks/useAudio.ts      # Sounds and music
│   ├── App.tsx                # Main screens and interactions
│   ├── main.tsx               # React entry point
│   └── styles.css             # Themes and layout
├── scripts/                   # Security and production checks
├── docs/
│   ├── PROJECT_DOCUMENTATION.md
│   ├── Tic-Tac-Toe-Neon-Arena-Documentation.pdf
│   ├── Neon_Arena_Complete_How_to_Play_Guide.pdf
│   └── screenshots/
├── package.json
├── vercel.json
└── README.md
🧠 Game Logic
The game uses a 3×3 board. Each cell is empty or contains X or O. After every move, the game checks the three rows, three columns, and two diagonals for a winning line. A full board without a winner results in a draw.

Easy AI: Random valid moves.
Medium AI: Immediate win/block checks with a mix of strategic and random choices.
Hard AI: Cached Minimax/Negamax-based search for optimal moves.
📊 Statistics, History & Replay
Track wins, losses, draws, and winning streaks. Review recent completed matches and use replay controls to move through recorded turns. Preferences and history are stored locally in your browser and do not automatically sync between devices.

🧪 Project Verification
The project's documented verification reported 59 passing automated tests, successful TypeScript and production-build checks, and zero reported vulnerabilities in its dependency audit at the time of testing.

🌐 Deployment
The frontend-only game is deployed on Vercel. No backend server or database is required.

🎮 Launch the Live Website

📚 Documentation & Guides
📖 How to Play — Beginner PDF Guide — Simple step-by-step playing instructions (4 pages)
📚 Technical Project Documentation — Architecture, game logic, and testing details
📄 Full Project Documentation (PDF) — Detailed project report
🚀 Possible Future Improvements
Online multiplayer, leaderboards, achievements, cloud-based statistics, more themes, and Progressive Web App support are possible future enhancements, not features of the current version.

👨‍💻 Developed by Priyam Patil
GitHub: @Priyam-Patil | Project: Tic Tac Toe — Neon Arena




