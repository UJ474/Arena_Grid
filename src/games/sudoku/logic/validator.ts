import { BoardMatrix, CellCoord } from './types';

/**
 * Checks if placing a number at board[row][col] is valid according to Sudoku rules.
 */
export function isValidPlacement(
  board: BoardMatrix,
  row: number,
  col: number,
  num: number
): boolean {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === num) return false;
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === num) return false;
  }

  // Check 3x3 block
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const curR = startRow + r;
      const curC = startCol + c;
      if ((curR !== row || curC !== col) && board[curR][curC] === num) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Identifies all cells that currently violate row, column, or 3x3 box uniqueness.
 */
export function findConflictingCells(board: BoardMatrix): Set<string> {
  const conflicts = new Set<string>();

  // Helper to serialize coordinates
  const key = (r: number, c: number) => `${r},${c}`;

  // Check rows
  for (let r = 0; r < 9; r++) {
    const seen = new Map<number, number[]>();
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      if (val !== 0) {
        if (!seen.has(val)) seen.set(val, []);
        seen.get(val)!.push(c);
      }
    }
    seen.forEach((cols) => {
      if (cols.length > 1) {
        cols.forEach((c) => conflicts.add(key(r, c)));
      }
    });
  }

  // Check cols
  for (let c = 0; c < 9; c++) {
    const seen = new Map<number, number[]>();
    for (let r = 0; r < 9; r++) {
      const val = board[r][c];
      if (val !== 0) {
        if (!seen.has(val)) seen.set(val, []);
        seen.get(val)!.push(r);
      }
    }
    seen.forEach((rows) => {
      if (rows.length > 1) {
        rows.forEach((r) => conflicts.add(key(r, c)));
      }
    });
  }

  // Check 3x3 boxes
  for (let boxR = 0; boxR < 3; boxR++) {
    for (let boxC = 0; boxC < 3; boxC++) {
      const seen = new Map<number, CellCoord[]>();
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const actualR = boxR * 3 + r;
          const actualC = boxC * 3 + c;
          const val = board[actualR][actualC];
          if (val !== 0) {
            if (!seen.has(val)) seen.set(val, []);
            seen.get(val)!.push({ row: actualR, col: actualC });
          }
        }
      }
      seen.forEach((coords) => {
        if (coords.length > 1) {
          coords.forEach((coord) => conflicts.add(key(coord.row, coord.col)));
        }
      });
    }
  }

  return conflicts;
}

/**
 * Checks if the board is completely filled and valid.
 */
export function isBoardCompleted(board: BoardMatrix): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) return false;
    }
  }
  return findConflictingCells(board).size === 0;
}
