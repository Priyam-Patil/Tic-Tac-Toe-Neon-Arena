# Run and use Tic Tac Toe - Neon Arena

## Open the application in VS Code

For the existing local project, choose **File -> Open Folder** and select **tic-tac-toe-game**. For a clone, select **Tic-Tac-Toe-Neon-Arena**. In both cases package.json, index.html, vite.config.ts, and src must be directly inside the opened folder. There is no separate frontend/client subdirectory.

After repository publication, a new copy can be obtained with:

```sh
git clone https://github.com/Priyam-Patil/Tic-Tac-Toe-Neon-Arena.git
cd Tic-Tac-Toe-Neon-Arena
```

## Install and start

Install Node.js 22.12+ or a newer compatible LTS. In VS Code choose **Terminal -> New Terminal** and confirm that the terminal is in the folder containing package.json.

```sh
node --version
npm --version
npm ci
npm run dev
```

Open http://127.0.0.1:5173/ or the Local URL Vite prints if the port is occupied. Keep the terminal running. Stop with Ctrl+C.

If PowerShell blocks npm.ps1, use npm.cmd in place of npm, or use a Command Prompt terminal. No system execution-policy change is required. If OneDrive or another synced folder returns ENOENT for Node/Git writes, copy the project to a normal writable local folder and open that copy in VS Code.

## Local multiplayer

Select **Local Multiplayer**, enter the X/O player names, select X starts or O starts, and click **Start match**. Share the same device and take turns choosing empty squares. Three in a row, column, or diagonal win; a full board without a winner is a draw.

## Computer play

Select **Vs Computer**. Choose **Easy**, **Medium**, or **Hard**, pick X or O, enter your name, choose the first mark, and click **Start match**.

Easy chooses random legal moves. Medium takes immediate wins, blocks threats, and otherwise mixes optimal/random choices. Hard uses optimal cached Minimax/Negamax. It cannot be defeated in standard play. The AI opens automatically when it is first and shows a thinking indicator before its moves.

Changing setup options does not silently modify an existing match. Start match applies those settings to a fresh match. Quick Play immediately selects medium AI, human X, and X first.

## Themes, sound, and settings

The sun/moon header button switches themes. Speaker toggles effects, and the note toggles original ambient music independently. **Sound & appearance** in setup or **Preferences** in the footer opens all those controls plus **Animations**.

Preferences are saved on this browser/origin. A fresh installation starts in light mode. Audio starts only after interaction. Turning animations off reduces decorative motion; a system reduced-motion request always takes precedence.

**Edit players & match settings** closes preferences and focuses the name field. **Home** retains the current board and scores; **Play** returns to the focused arena.

## Scores and useful controls

- **Undo:** one local move or the latest human/AI turn. Works while the AI is thinking. Completed rounds are final.
- **Hint:** highlight an optimal move without placing it.
- **Restart:** confirm clearing the current board while retaining match scores.
- **Play again / Next round:** continue the same match.
- **Reset scores:** confirm a fresh match score; lifetime statistics/history remain.
- **Statistics:** view totals, streaks, and history. Select a result to replay; pause/resume, scrub moves, or restart playback.
- **Reset lifetime statistics:** confirm clearing lifetime totals/history while retaining current match scores.
- **How to play:** rules and keyboard help; Escape closes the dialog.

Match cards always track X, O, and draws. Lifetime victories/losses follow the human mark against AI or Player X in local multiplayer. The latest 100 replays are retained, while lifetime totals include all completed games. Device data does not sync to another browser.

## Keyboard and pointer controls

Tap/click a cell, or Tab to the board and use arrow keys, Enter/Space, and keys 1-9. Home/End focus the first/last cell. Controls have focus outlines and icon labels. Escape closes a dialog. Physical-device/browser differences should still be checked when releasing updates.

## Run tests and security checks

```sh
npm test
npm run test:watch
npm run security:check
```

The first command runs all automated tests once. The second watches changes. The security script reports credential-pattern locations/categories without displaying candidate values and also scans reachable local Git history. No standalone lint command is configured; strict TypeScript and unused-code checks run during build.

## Build and preview production

```sh
npm run build
npm run preview -- --port 4173 --strictPort
```

The build writes dist. Open http://127.0.0.1:4173/ while the preview terminal is running. In another terminal, check production HTTP assets/security headers with:

```sh
node scripts/check-production.mjs
```

Do not double-click dist/index.html as a substitute for HTTP preview.

## Deploy to Vercel

Only publish after the owner approves. Use the existing GitHub repository:

https://github.com/Priyam-Patil/Tic-Tac-Toe-Neon-Arena

In Vercel import the repository or reuse the matching existing project. Root is the package.json directory, framework is Vite, install is npm ci, build is npm run build, and output is dist. No environment variables or backend credentials are required. vercel.json contains those settings and security headers.

Wait for the build to succeed, open the actual URL, and verify assets and gameplay before reporting completion. The current release documentation explicitly records publication/deployment as pending until those actions occur.

## Complete technical documentation

See docs/PROJECT_DOCUMENTATION.md and docs/Tic-Tac-Toe-Neon-Arena-Documentation.pdf for architecture, logic, actual test results, screenshots, security considerations, and the deployment handoff.
