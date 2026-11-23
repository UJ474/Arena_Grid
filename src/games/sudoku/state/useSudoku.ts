import { useState, useEffect, useCallback, useRef } from 'react';
import { BoardMatrix, CellCoord, Difficulty, MoveRecord } from '../logic/types';
import { generatePuzzle } from '../logic/generator';
import { findConflictingCells, isBoardCompleted } from '../logic/validator';

export function useSudoku(initialDifficulty: Difficulty = 'easy') {
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [board, setBoard] = useState<BoardMatrix>(() => Array(9).fill(0).map(() => Array(9).fill(0)));
  const [initialBoard, setInitialBoard] = useState<BoardMatrix>(() => Array(9).fill(0).map(() => Array(9).fill(0)));
  const [solution, setSolution] = useState<BoardMatrix>(() => Array(9).fill(0).map(() => Array(9).fill(0)));
  const [notes, setNotes] = useState<Map<string, number[]>>(() => new Map());

  const [selectedCell, setSelectedCell] = useState<CellCoord | null>(null);
  const [isNoteMode, setIsNoteMode] = useState(false);
  const [history, setHistory] = useState<MoveRecord[]>([]);

  const [timer, setTimer] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize game
  const startNewGame = useCallback((diff: Difficulty = difficulty) => {
    const { puzzle, solution: sol } = generatePuzzle(diff);
    setDifficulty(diff);
    setBoard(puzzle.map((row) => [...row]));
    setInitialBoard(puzzle.map((row) => [...row]));
    setSolution(sol);
    setNotes(new Map());
    setSelectedCell(null);
    setHistory([]);
    setMistakes(0);
    setIsWon(false);
    setTimer(0);
  }, [difficulty]);

  useEffect(() => {
    startNewGame(initialDifficulty);
  }, []);

  // Timer ticker
  useEffect(() => {
    if (isWon) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isWon]);

  // Key helper
  const cellKey = (r: number, c: number) => `${r},${c}`;

  // Conflicts calculation
  const conflictingKeys = findConflictingCells(board);

  // Remaining counts for 1-9
  const remainingCounts = (() => {
    const counts: Record<number, number> = {};
    for (let i = 1; i <= 9; i++) counts[i] = 9;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = board[r][c];
        if (val >= 1 && val <= 9) {
          counts[val] = Math.max(0, counts[val] - 1);
        }
      }
    }
    return counts;
  })();

  // Place number or note
  const inputNumber = useCallback(
    (num: number) => {
      if (!selectedCell || isWon) return;
      const { row, col } = selectedCell;

      // Given cells cannot be modified
      if (initialBoard[row][col] !== 0) return;

      const key = cellKey(row, col);

      if (isNoteMode) {
        // Toggle note
        setNotes((prev) => {
          const next = new Map(prev);
          const currentNotes = next.get(key) || [];
          if (currentNotes.includes(num)) {
            next.set(key, currentNotes.filter((n) => n !== num));
          } else {
            next.set(key, [...currentNotes, num].sort());
          }
          return next;
        });
      } else {
        const prevVal = board[row][col];
        const prevNotes = notes.get(key) || [];

        if (prevVal === num) return; // No change

        // Check if mistake against solution
        if (solution[row][col] !== num) {
          setMistakes((m) => m + 1);
        }

        const newBoard = board.map((r, rIdx) =>
          rIdx === row ? r.map((c, cIdx) => (cIdx === col ? num : c)) : [...r]
        );

        setBoard(newBoard);

        // Record history
        setHistory((prev) => [
          ...prev,
          {
            row,
            col,
            prevValue: prevVal,
            newValue: num,
            prevNotes,
            newNotes: [],
          },
        ]);

        // Clear notes on this cell
        setNotes((prev) => {
          const next = new Map(prev);
          next.delete(key);
          return next;
        });

        // Check completion
        if (isBoardCompleted(newBoard)) {
          setIsWon(true);
        }
      }
    },
    [selectedCell, isWon, initialBoard, isNoteMode, board, notes, solution]
  );

  // Erase current cell
  const eraseCell = useCallback(() => {
    if (!selectedCell || isWon) return;
    const { row, col } = selectedCell;
    if (initialBoard[row][col] !== 0) return;

    const key = cellKey(row, col);
    const prevVal = board[row][col];
    const prevNotes = notes.get(key) || [];

    if (prevVal === 0 && prevNotes.length === 0) return;

    const newBoard = board.map((r, rIdx) =>
      rIdx === row ? r.map((c, cIdx) => (cIdx === col ? 0 : c)) : [...r]
    );
    setBoard(newBoard);

    setHistory((prev) => [
      ...prev,
      {
        row,
        col,
        prevValue: prevVal,
        newValue: 0,
        prevNotes,
        newNotes: [],
      },
    ]);

    setNotes((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  }, [selectedCell, isWon, initialBoard, board, notes]);

  // Undo last move
  const undo = useCallback(() => {
    if (history.length === 0 || isWon) return;
    const lastMove = history[history.length - 1];
    const { row, col, prevValue, prevNotes } = lastMove;

    setBoard((prev) =>
      prev.map((r, rIdx) =>
        rIdx === row ? r.map((c, cIdx) => (cIdx === col ? prevValue : c)) : [...r]
      )
    );

    const key = cellKey(row, col);
    setNotes((prev) => {
      const next = new Map(prev);
      if (prevNotes.length > 0) {
        next.set(key, prevNotes);
      } else {
        next.delete(key);
      }
      return next;
    });

    setSelectedCell({ row, col });
    setHistory((prev) => prev.slice(0, -1));
  }, [history, isWon]);

  // Provide hint for selected or next empty cell
  const giveHint = useCallback(() => {
    if (isWon) return;
    let target = selectedCell;
    if (!target || initialBoard[target.row][target.col] !== 0 || board[target.row][target.col] !== 0) {
      // Find first empty cell
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (board[r][c] === 0) {
            target = { row: r, col: c };
            break;
          }
        }
        if (target && board[target.row][target.col] === 0) break;
      }
    }

    if (!target) return;

    const { row, col } = target;
    const correctVal = solution[row][col];
    setSelectedCell({ row, col });

    const newBoard = board.map((r, rIdx) =>
      rIdx === row ? r.map((c, cIdx) => (cIdx === col ? correctVal : c)) : [...r]
    );
    setBoard(newBoard);

    const key = cellKey(row, col);
    setNotes((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });

    if (isBoardCompleted(newBoard)) {
      setIsWon(true);
    }
  }, [isWon, selectedCell, initialBoard, board, solution]);

  return {
    board,
    initialBoard,
    difficulty,
    notes,
    selectedCell,
    setSelectedCell,
    isNoteMode,
    setIsNoteMode,
    conflictingKeys,
    remainingCounts,
    timer,
    mistakes,
    isWon,
    inputNumber,
    eraseCell,
    undo,
    giveHint,
    startNewGame,
  };
}
