🎮 Blink Tac Toe - Technical Documentation
🧩 Overview
Blink Tac Toe is a modern twist on the classic Tic Tac Toe game, built with React.js and styled using Tailwind CSS. It introduces emoji-based gameplay and a unique "vanishing emoji" rule, adding strategic depth to the traditional format.

🛠 Tech Stack
Technology	Purpose
React.js	Frontend UI Framework
Tailwind CSS	Utility-first CSS Styling
React Hooks	State & Lifecycle Management
Vite	Lightning-fast Build Tool
npm	Package Manager

🌟 Core Features
1. 👤 Player Setup
Players input names

Each selects a unique emoji category

Choose 3 emojis from the category

Game starts only after all selections are complete

2. 🎯 Game Mechanics
🧸 Emoji Categories
javascript
Copy
Edit
const EMOJI_CATEGORIES = {
  animals: ["🐶", "🐱", "🐵", "🐰"],
  food: ["🍕", "🍟", "🍔", "🍩"],
  sports: ["⚽️", "🏀", "🏈", "🎾"],
  nature: ["🌸", "🌺", "🌹", "🌻"],
};
4 unique emoji categories

Players must pick exactly 3 emojis to proceed

💨 Vanishing Emoji Rule
The vanishing rule uses a FIFO (First In, First Out) system:

After placing 3 emojis, the 4th emoji removes the first

The first emoji’s position becomes off-limits

Visual feedback highlights the vanishing cell

javascript
Copy
Edit
const [gameState, setGameState] = useState({
  // ...other properties
  firstEmojiPositions: {
    player1: null,
    player2: null,
  },
});
3. 🔄 Game State Management
📦 Core State
javascript
Copy
Edit
{
  currentPlayer: 1 | 2,
  board: Array(9).fill(null),
  winner: null | { player, emoji, line },
  player1Emojis: [],
  player2Emojis: [],
  vanishingEmoji: null,
  vanishingIndex: null,
  firstEmojiPositions: {
    player1: null,
    player2: null,
  },
}
✅ State Behavior
Immutability maintained with each update

Validations prevent invalid moves

Winner detection after each emoji placement

4. 💅 UI/UX Features
🎨 Visual Feedback
Current turn indicator with animation

Highlighted vanishing emoji

Special styling for:

Winning line

First emoji positions

Last move

Color-coded themes per player

📱 Responsive Design
Mobile-first grid layout

Touch-friendly buttons

Scales across screen sizes

5. 🧠 Game Logic
🏆 Winning Conditions
javascript
Copy
Edit
const checkWinner = (board) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6],           // diagonals
  ];
  // Check for matching emojis across lines
};
❌ Move Validation Rules
Cell must be empty

Game must not be already won

Emoji must be from valid selection

Cannot place on your first emoji’s cell after it vanishes
