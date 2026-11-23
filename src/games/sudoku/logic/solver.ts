import { BoardMatrix } from './types';
import { isValidPlacement } from './validator';

/**
 * Solves a 9x9 Sudoku board in-place using backtracking.
 * Returns true if solvable, false otherwise.
 */
export function solveSudoku(board: BoardMatrix): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValidPlacement(board, r, c, num)) {
            board[r][c] = num;
            if (solveSudoku(board)) {
              return true;
            }
            board[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

/**
 * Counts the number of solutions for a board up to maxLimit (used to ensure unique solution).
 */
export function countSolutions(board: BoardMatrix, limit = 2): number {
  let count = 0;

  function backtrack(b: BoardMatrix): boolean {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (b[r][c] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(b, r, c, num)) {
              b[r][c] = num;
              if (backtrack(b)) return true;
              b[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    count++;
    return count >= limit;
  }

  const copy = board.map((row) => [...row]);
  backtrack(copy);
  return count;
}
