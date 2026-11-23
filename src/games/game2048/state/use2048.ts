import { useState, useCallback, useRef } from 'react';
import { BoardMatrix, Direction, BoardHistory } from '../logic/types';
import {
  initializeBoard,
  moveBoard,
  spawnRandomTile,
  canMove,
  hasWon,
} from '../logic/board';

export function use2048() {
  const [board, setBoard] = useState<BoardMatrix>(() => initializeBoard());
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [history, setHistory] = useState<BoardHistory[]>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [hasDismissedWin, setHasDismissedWin] = useState<boolean>(false);

  // Prevent multiple moves processing at the exact same millisecond
  const isMovingRef = useRef(false);

  const move = useCallback(
    (direction: Direction) => {
      if (isGameOver || isMovingRef.current) return;
      isMovingRef.current = true;

      setBoard((currentBoard) => {
        const { board: movedBoard, scoreGained, hasChanged } = moveBoard(
          currentBoard,
          direction
        );

        if (!hasChanged) {
          isMovingRef.current = false;
          return currentBoard;
        }

        // Spawn a new tile
        const nextBoard = spawnRandomTile(movedBoard);

        // Update score
        setScore((prevScore) => {
          const nextScore = prevScore + scoreGained;
          setBestScore((prevBest) => Math.max(prevBest, nextScore));
          return nextScore;
        });

        // Record history for undo (keep max 10 moves to avoid memory bloat)
        setHistory((prevHistory) => [
          ...prevHistory.slice(-9),
          {
            board: currentBoard.map((r) => [...r]),
            score,
          },
        ]);

        // Check Win condition (first time reaching 2048)
        if (!hasDismissedWin && hasWon(nextBoard, 2048)) {
          setIsWon(true);
        }

        // Check Game Over condition
        if (!canMove(nextBoard)) {
          setIsGameOver(true);
        }

        isMovingRef.current = false;
        return nextBoard;
      });
    },
    [isGameOver, hasDismissedWin, score]
  );

  const undo = useCallback(() => {
    if (history.length === 0 || isGameOver) return;
    const lastState = history[history.length - 1];

    setBoard(lastState.board);
    setScore(lastState.score);
    setHistory((prev) => prev.slice(0, -1));
    setIsGameOver(false);
  }, [history, isGameOver]);

  const restart = useCallback(() => {
    const newBoard = initializeBoard();
    setBoard(newBoard);
    setScore(0);
    setHistory([]);
    setIsGameOver(false);
    setIsWon(false);
    setHasDismissedWin(false);
    isMovingRef.current = false;
  }, []);

  const continuePlaying = useCallback(() => {
    setIsWon(false);
    setHasDismissedWin(true);
  }, []);

  return {
    board,
    score,
    bestScore,
    isGameOver,
    isWon,
    canUndo: history.length > 0,
    move,
    undo,
    restart,
    continuePlaying,
  };
}
