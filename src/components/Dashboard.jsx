import { useState } from "react";
import Game from "./Game";

const EMOJI_CATEGORIES = {
  animals: ["🐶", "🐱", "🐵", "🐰"],
  food: ["🍕", "🍟", "🍔", "🍩"],
  sports: ["⚽️", "🏀", "🏈", "🎾"],
  nature: ["🌸", "🌺", "🌹", "🌻"],
};

function Dashboard() {
  const [gameState, setGameState] = useState({
    player1Name: "",
    player2Name: "",
    player1Category: null,
    player2Category: null,
    currentPlayer: 1,
    board: Array(9).fill(null),
    gameStarted: false,
    winner: null,
    player1Emojis: [],
    player2Emojis: [],
  });

  const [showDropdown, setShowDropdown] = useState({
    player1: false,
    player2: false,
  });

  const [showHelp, setShowHelp] = useState(false);

  const handleNameChange = (player, name) => {
    setGameState((prev) => ({
      ...prev,
      [`player${player}Name`]: name,
    }));
  };

  const handleCategorySelect = (player, category) => {
    const otherPlayer = player === 1 ? 2 : 1;
    const otherPlayerCategory = gameState[`player${otherPlayer}Category`];

    if (otherPlayerCategory === category) {
      alert("This category is already selected by the other player!");
      return;
    }

    setGameState((prev) => ({
      ...prev,
      [`player${player}Category`]: category,
    }));

    setShowDropdown((prev) => ({
      ...prev,
      [`player${player}`]: true,
    }));
  };

  const handleEmojiSelect = (player, emoji) => {
    setGameState((prev) => {
      const updatedEmojis = [...prev[`player${player}Emojis`], emoji];
      const finalEmojis = updatedEmojis.slice(0, 3);

      const newShowDropdown = { ...showDropdown };
      if (finalEmojis.length === 3) {
        newShowDropdown[`player${player}`] = false;
      }

      setShowDropdown(newShowDropdown);

      return {
        ...prev,
        [`player${player}Emojis`]: finalEmojis,
      };
    });
  };

  const startGame = () => {
    if (
      !gameState.player1Name ||
      !gameState.player2Name ||
      !gameState.player1Category ||
      !gameState.player2Category ||
      gameState.player1Emojis.length !== 3 ||
      gameState.player2Emojis.length !== 3
    ) {
      alert(
        "Please fill in all fields, select categories, and choose 3 emojis for both players!"
      );
      return;
    }
    setGameState((prev) => ({
      ...prev,
      gameStarted: true,
    }));
  };

  if (!gameState.gameStarted) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-5xl font-bold text-center text-purple-800">
              Blink Tac Toe!
            </h1>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              {showHelp ? "Hide Help" : "Show Help"}
            </button>
          </div>

          {showHelp && (
            <div className="bg-white rounded-lg p-6 mb-8 shadow-md">
              <h2 className="text-2xl font-semibold text-purple-700 mb-4">
                How to Play
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  1. Each player selects a unique emoji category and 3 emojis
                </p>
                <p>
                  2. Players take turns placing their emojis on the 3x3 grid
                </p>
                <p>
                  3. Each player can have only 3 emojis on the board at any time
                </p>
                <p>
                  4. When placing a 4th emoji, your oldest emoji will vanish
                </p>
                <p>
                  5. Win by creating a line of 3 matching emojis (horizontal,
                  vertical, or diagonal)
                </p>
                <p>6. The game continues until one player wins</p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Player 1 Section */}
            <div className="bg-white rounded-md p-8 text-black">
              <h2 className="text-3xl font-semibold text-purple-700 mb-6">
                Player 1
              </h2>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={gameState.player1Name}
                  onChange={(e) => handleNameChange(1, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="Enter your name"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Choose Your Emoji Category
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(EMOJI_CATEGORIES).map(
                    ([category, emojis]) => (
                      <div key={category} className="relative">
                        <button
                          onClick={() => handleCategorySelect(1, category)}
                          className={`w-full p-4 rounded-lg border-2 transition-all ${
                            gameState.player1Category === category
                              ? "border-purple-500 bg-purple-50 transform scale-105"
                              : "border-gray-200 hover:border-purple-300"
                          }`}
                        >
                          <div className="text-2xl mb-2">{emojis[0]}</div>
                          <div className="text-sm font-medium text-gray-600 capitalize">
                            {category}
                          </div>
                        </button>
                        {showDropdown.player1 &&
                          gameState.player1Category === category && (
                            <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border-2 border-purple-200">
                              <div className="p-2">
                                <p className="text-sm text-gray-600 mb-2">
                                  Select 1 emoji:
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                  {emojis.map((emoji, index) => (
                                    <button
                                      key={index}
                                      onClick={() =>
                                        handleEmojiSelect(1, emoji)
                                      }
                                      disabled={gameState.player1Emojis.includes(
                                        emoji
                                      )}
                                      className={`p-2 text-2xl rounded-lg ${
                                        gameState.player1Emojis.includes(emoji)
                                          ? "bg-purple-100 cursor-not-allowed"
                                          : "hover:bg-purple-50"
                                      }`}
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                      </div>
                    )
                  )}
                </div>
                {gameState.player1Emojis.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Selected emoji:
                    </p>
                    <div className="flex gap-2">
                      {gameState.player1Emojis.map((emoji, index) => (
                        <span key={index} className="text-2xl">
                          {emoji}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Player 2 Section */}
            <div className="bg-white rounded-md p-8 text-black">
              <h2 className="text-3xl font-semibold text-pink-700 mb-6">
                Player 2
              </h2>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={gameState.player2Name}
                  onChange={(e) => handleNameChange(2, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-pink-200 focus:border-pink-500 focus:outline-none transition-colors"
                  placeholder="Enter your name"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Choose Your Emoji Category
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(EMOJI_CATEGORIES).map(
                    ([category, emojis]) => (
                      <div key={category} className="relative">
                        <button
                          onClick={() => handleCategorySelect(2, category)}
                          className={`w-full p-4 rounded-lg border-2 transition-all ${
                            gameState.player2Category === category
                              ? "border-pink-500 bg-pink-50 transform scale-105"
                              : "border-gray-200 hover:border-pink-300"
                          }`}
                        >
                          <div className="text-2xl mb-2">{emojis[0]}</div>
                          <div className="text-sm font-medium text-gray-600 capitalize">
                            {category}
                          </div>
                        </button>
                        {showDropdown.player2 &&
                          gameState.player2Category === category && (
                            <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border-2 border-pink-200">
                              <div className="p-2">
                                <p className="text-sm text-gray-600 mb-2">
                                  Select 1 emoji:
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                  {emojis.map((emoji, index) => (
                                    <button
                                      key={index}
                                      onClick={() =>
                                        handleEmojiSelect(2, emoji)
                                      }
                                      disabled={gameState.player2Emojis.includes(
                                        emoji
                                      )}
                                      className={`p-2 text-2xl rounded-lg ${
                                        gameState.player2Emojis.includes(emoji)
                                          ? "bg-pink-100 cursor-not-allowed"
                                          : "hover:bg-pink-50"
                                      }`}
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                      </div>
                    )
                  )}
                </div>
                {gameState.player2Emojis.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Selected emoji:
                    </p>
                    <div className="flex gap-2">
                      {gameState.player2Emojis.map((emoji, index) => (
                        <span key={index} className="text-2xl">
                          {emoji}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={startGame}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-lg font-semibold"
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Game
          player1Name={gameState.player1Name}
          player2Name={gameState.player2Name}
          player1Category={gameState.player1Category}
          player2Category={gameState.player2Category}
          player1Emojis={gameState.player1Emojis}
          player2Emojis={gameState.player2Emojis}
          onGameEnd={(winner) => {
            setGameState((prev) => ({
              ...prev,
              winner,
            }));
          }}
        />
      </div>
    </div>
  );
}

export default Dashboard;
