import { BoardMatrix, Difficulty } from './types';
import { solveSudoku, countSolutions } from './solver';
import { isValidPlacement } from './validator';

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates a full valid 9x9 Sudoku solution.
 */
export function generateFullSolution(): BoardMatrix {
  const board: BoardMatrix = Array(9)
    .fill(0)
    .map(() => Array(9).fill(0));

  function fillBoard(b: BoardMatrix): boolean {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (b[r][c] === 0) {
          const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (const num of numbers) {
            if (isValidPlacement(b, r, c, num)) {
              b[r][c] = num;
              if (fillBoard(b)) return true;
              b[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  fillBoard(board);
  return board;
}

/**
 * Creates a puzzle by removing numbers from a full solution,
 * based on selected difficulty.
 */
export function generatePuzzle(difficulty: Difficulty): {
  puzzle: BoardMatrix;
  solution: BoardMatrix;
} {
  const solution = generateFullSolution();
  const puzzle = solution.map((row) => [...row]);

  // Target number of clues:
  // Easy: ~38 clues (remove ~43)
  // Medium: ~30 clues (remove ~51)
  // Hard: ~24 clues (remove ~57)
  let cellsToRemove = difficulty === 'easy' ? 42 : difficulty === 'medium' ? 50 : 56;

  const positions: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push([r, c]);
    }
  }
  const shuffledPositions = shuffle(positions);

  for (const [r, c] of shuffledPositions) {
    if (cellsToRemove <= 0) break;

    const backup = puzzle[r][c];
    puzzle[r][c] = 0;

    // Check if unique solution remains
    if (countSolutions(puzzle, 2) !== 1) {
      puzzle[r][c] = backup; // Restore if it breaks uniqueness
    } else {
      cellsToRemove--;
    }
  }

  return { puzzle, solution };
}
