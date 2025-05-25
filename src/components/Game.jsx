import { useState, useEffect } from "react";

function Game({
  player1Name,
  player2Name,
  player1Category,
  player2Category,
  onGameEnd,
  player1Emojis,
  player2Emojis,
}) {
  const [gameState, setGameState] = useState({
    currentPlayer: 1,
    board: Array(9).fill(null),
    winner: null,
    player1Emojis: [],
    player2Emojis: [],
    vanishingEmoji: null,
    vanishingIndex: null,
    firstEmojiPositions: {
      player1: null,
      player2: null,
    },
  });

  useEffect(() => {
    console.log("Initial emojis:", { player1Emojis, player2Emojis });
  }, [player1Emojis, player2Emojis]);

  const handleCellClick = (index) => {
    if (gameState.board[index] || gameState.winner) return;

    // Get the current player's emojis
    const isPlayer1 = gameState.currentPlayer === 1;
    const currentPlayerEmojis = isPlayer1
      ? gameState.player1Emojis
      : gameState.player2Emojis;
    const selectedEmojis = isPlayer1 ? player1Emojis : player2Emojis;
    const playerKey = isPlayer1 ? 'player1' : 'player2';

    if (!selectedEmojis || selectedEmojis.length === 0) {
      console.error("No emojis available for player", gameState.currentPlayer);
      return;
    }

    // If player already has 3 emojis, check if they're trying to place on their first emoji position
    if (currentPlayerEmojis.length >= 3 && index === gameState.firstEmojiPositions[playerKey]) {
      alert("You cannot place your emoji where your first emoji was placed!");
      return;
    }

    // If player already has 3 emojis, remove the oldest one
    let updatedEmojis = [...currentPlayerEmojis];
    let newBoard = [...gameState.board];
    let vanishingEmoji = null;
    let vanishingIndex = null;

    if (updatedEmojis.length >= 3) {
      const oldestEmoji = updatedEmojis[0];
      // Find all positions of the oldest emoji in the board
      const oldestEmojiPositions = newBoard.reduce((acc, emoji, idx) => {
        if (emoji === oldestEmoji) acc.push(idx);
        return acc;
      }, []);

      // Remove the oldest emoji from the first position found
      if (oldestEmojiPositions.length > 0) {
        vanishingIndex = oldestEmojiPositions[0];
        vanishingEmoji = oldestEmoji;
        newBoard[vanishingIndex] = null;
      }
      updatedEmojis = updatedEmojis.slice(1);
    }

    // Add new emoji from selected emojis
    const newEmoji = selectedEmojis[Math.floor(Math.random() * selectedEmojis.length)];
    updatedEmojis.push(newEmoji);
    newBoard[index] = newEmoji;

    // If this is the first emoji for this player, store its position
    const firstEmojiPositions = { ...gameState.firstEmojiPositions };
    if (currentPlayerEmojis.length === 0) {
      firstEmojiPositions[playerKey] = index;
    }

    const newGameState = {
      ...gameState,
      board: newBoard,
      currentPlayer: isPlayer1 ? 2 : 1,
      [playerKey === 'player1' ? 'player1Emojis' : 'player2Emojis']: updatedEmojis,
      vanishingEmoji,
      vanishingIndex,
      firstEmojiPositions,
    };

    // Check for winner
    const winner = checkWinner(newBoard);
    if (winner) {
      newGameState.winner = {
        player: gameState.currentPlayer,
        emoji: newEmoji,
        line: winner,
      };
      onGameEnd(newGameState.winner);
    }

    setGameState(newGameState);
  };

  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return line;
      }
    }
    return null;
  };

  const resetGame = () => {
    setGameState({
      currentPlayer: 1,
      board: Array(9).fill(null),
      winner: null,
      player1Emojis: [],
      player2Emojis: [],
      vanishingEmoji: null,
      vanishingIndex: null,
      firstEmojiPositions: {
        player1: null,
        player2: null,
      },
    });
  };

  return (
    <div className="bg-white rounded-md shadow-lg p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div
              className={`w-3 h-3 rounded-full ${
                gameState.currentPlayer === 1 ? "bg-purple-500" : "bg-pink-500"
              } animate-pulse`}
            />
            <span className="text-lg font-medium text-gray-800">
              {gameState.currentPlayer === 1 ? player1Name : player2Name}'s Turn
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {gameState.currentPlayer === 1 ? player1Category : player2Category}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 w-[400px] mx-auto">
          {gameState.board.map((cell, index) => {
            const isPlayer1FirstEmoji = index === gameState.firstEmojiPositions.player1;
            const isPlayer2FirstEmoji = index === gameState.firstEmojiPositions.player2;
            
            return (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                className={`aspect-square text-3xl bg-gray-50 rounded-lg transition-all duration-300 ${
                  gameState.winner?.line?.includes(index)
                    ? "bg-green-100 text-green-600 scale-105"
                    : index === gameState.vanishingIndex
                    ? "bg-red-50 text-red-600 scale-95"
                    : isPlayer1FirstEmoji
                    ? "bg-purple-50 border-2 border-purple-200"
                    : isPlayer2FirstEmoji
                    ? "bg-pink-50 border-2 border-pink-200"
                    : "hover:bg-gray-100"
                }`}
                title={
                  isPlayer1FirstEmoji
                    ? `${player1Name}'s first emoji position`
                    : isPlayer2FirstEmoji
                    ? `${player2Name}'s first emoji position`
                    : ""
                }
              >
                {cell || ""}
              </button>
            );
          })}
        </div>

        {gameState.winner && (
          <div className="text-center mt-4">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {gameState.winner.player === 1 ? player1Name : player2Name} Wins! 🎉
            </div>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Play Again
            </button>
          </div>
        )}

        {!gameState.winner && (
          <button
            onClick={resetGame}
            className="w-[200px] py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors mt-2 mx-auto"
          >
            Reset Game
          </button>
        )}
      </div>
    </div>
  );
}

export default Game;
