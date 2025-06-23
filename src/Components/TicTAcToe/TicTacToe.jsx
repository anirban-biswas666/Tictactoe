import React, { useState, useEffect } from 'react';
import './TicTacToe.css';
import circle_icon from '../assets/circle.png';
import cross_icon from '../assets/cross.png';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Handle AI moves after player moves
  useEffect(() => {
    if (gameStarted && !isPlayerTurn && !gameOver && !isProcessing) {
      const timer = setTimeout(() => {
        makeAiMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, gameOver, isProcessing, gameStarted]);

  const checkWinner = (currentBoard) => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }

    if (!currentBoard.includes("")) {
      return "draw";
    }

    return null;
  };

  const minimax = (currentBoard, depth, isMaximizing) => {
    const result = checkWinner(currentBoard);
    
    if (result === "x") return { score: -10 + depth };
    if (result === "o") return { score: 10 - depth };
    if (result === "draw") return { score: 0 };

    if (isMaximizing) {
      let bestScore = -Infinity;
      let bestMove = -1;
      
      for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === "") {
          currentBoard[i] = "o";
          const score = minimax(currentBoard, depth + 1, false).score;
          currentBoard[i] = "";
          if (score > bestScore) {
            bestScore = score;
            bestMove = i;
          }
        }
      }
      return { score: bestScore, move: bestMove };
    } else {
      let bestScore = Infinity;
      let bestMove = -1;
      
      for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === "") {
          currentBoard[i] = "x";
          const score = minimax(currentBoard, depth + 1, true).score;
          currentBoard[i] = "";
          if (score < bestScore) {
            bestScore = score;
            bestMove = i;
          }
        }
      }
      return { score: bestScore, move: bestMove };
    }
  };

  const makeAiMove = () => {
    setIsProcessing(true);
    const move = minimax([...board], 0, true).move;
    
    if (move !== -1) {
      const newBoard = [...board];
      newBoard[move] = "o";
      setBoard(newBoard);
      
      const gameResult = checkWinner(newBoard);
      if (gameResult) {
        setGameOver(true);
        setWinner(gameResult);
      } else {
        setIsPlayerTurn(true);
      }
    }
    setIsProcessing(false);
  };

  const handleClick = (index) => {
    if (!gameStarted || gameOver || !isPlayerTurn || board[index] !== "" || isProcessing) return;
    
    setIsProcessing(true);
    const newBoard = [...board];
    newBoard[index] = "x";
    setBoard(newBoard);
    
    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setGameOver(true);
      setWinner(gameResult);
    } else {
      setIsPlayerTurn(false);
    }
    setIsProcessing(false);
  };

  const startGame = () => {
    setGameStarted(true);
    setIsPlayerTurn(true);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(""));
    setIsPlayerTurn(true);
    setGameOver(false);
    setWinner(null);
    setIsProcessing(false);
    setGameStarted(false);
  };

  const renderBox = (index) => {
    return (
      <div 
        className={`boxes ${!gameStarted || !isPlayerTurn || gameOver || board[index] !== "" ? 'disabled' : ''}`}
        onClick={() => handleClick(index)}
      >
        {board[index] === "x" && <img src={cross_icon} alt="X" />}
        {board[index] === "o" && <img src={circle_icon} alt="O" />}
      </div>
    );
  };

  return (
    <div className='container'>
      <h1 className="title">Tic Tac Toe <span>React</span></h1>
      {gameOver && (
        <div className="game-over">
          {winner === "draw" ? "He He He LOOSERR!!" : `Player ${winner} wins!`}
        </div>
      )}
      <div className="board">
        <div className="row1">
          {renderBox(0)}
          {renderBox(1)}
          {renderBox(2)}
        </div>
        <div className="row2">
          {renderBox(3)}
          {renderBox(4)}
          {renderBox(5)}
        </div>
        <div className="row3">
          {renderBox(6)}
          {renderBox(7)}
          {renderBox(8)}
        </div>
      </div>
      {!gameStarted ? (
        <button className="start" onClick={startGame}>Start Game</button>
      ) : (
        <button className="reset" onClick={resetGame}>Reset</button>
      )}
    </div>
  );
};

export default TicTacToe;