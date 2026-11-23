import { BoardMatrix, Direction, MoveResult } from './types';

export const BOARD_SIZE = 4;

/**
 * Creates an empty 4x4 board
 */
export function createEmptyBoard(): BoardMatrix {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
}

/**
 * Returns all empty [row, col] coordinates
 */
export function getEmptyCoordinates(board: BoardMatrix): [number, number][] {
  const emptyCoords: [number, number][] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === 0) {
        emptyCoords.push([r, c]);
      }
    }
  }
  return emptyCoords;
}

/**
 * Spawns a random tile (90% chance of 2, 10% chance of 4) in an empty coordinate
 */
export function spawnRandomTile(board: BoardMatrix): BoardMatrix {
  const emptyCoords = getEmptyCoordinates(board);
  if (emptyCoords.length === 0) return board;

  const randomIndex = Math.floor(Math.random() * emptyCoords.length);
  const [row, col] = emptyCoords[randomIndex];
  const value = Math.random() < 0.9 ? 2 : 4;

  const newBoard = board.map((r) => [...r]);
  newBoard[row][col] = value;
  return newBoard;
}

/**
 * Initializes a new board with 2 random tiles
 */
export function initializeBoard(): BoardMatrix {
  let board = createEmptyBoard();
  board = spawnRandomTile(board);
  board = spawnRandomTile(board);
  return board;
}

/**
 * Compresses and merges a single line (row/column) to the left
 */
function slideAndMergeLine(line: number[]): { line: number[]; score: number } {
  // 1. Remove zeros
  const nonZeros = line.filter((val) => val !== 0);
  const merged: number[] = [];
  let score = 0;

  let i = 0;
  while (i < nonZeros.length) {
    if (i + 1 < nonZeros.length && nonZeros[i] === nonZeros[i + 1]) {
      const mergedVal = nonZeros[i] * 2;
      merged.push(mergedVal);
      score += mergedVal;
      i += 2; // Skip both merged tiles
    } else {
      merged.push(nonZeros[i]);
      i += 1;
    }
  }

  // 2. Pad remaining positions with 0
  while (merged.length < BOARD_SIZE) {
    merged.push(0);
  }

  return { line: merged, score };
}

/**
 * Rotates a 4x4 matrix 90 degrees clockwise
 */
function rotateClockwise(board: BoardMatrix): BoardMatrix {
  const rotated = createEmptyBoard();
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      rotated[c][BOARD_SIZE - 1 - r] = board[r][c];
    }
  }
  return rotated;
}

/**
 * Rotates a 4x4 matrix 90 degrees counter-clockwise
 */
function rotateCounterClockwise(board: BoardMatrix): BoardMatrix {
  const rotated = createEmptyBoard();
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      rotated[BOARD_SIZE - 1 - c][r] = board[r][c];
    }
  }
  return rotated;
}

/**
 * Compares two boards for exact equality
 */
export function areBoardsEqual(b1: BoardMatrix, b2: BoardMatrix): boolean {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (b1[r][c] !== b2[r][c]) return false;
    }
  }
  return true;
}

/**
 * Executes a move in a specific direction.
 * Highly optimized, zero memory overhead.
 */
export function moveBoard(board: BoardMatrix, direction: Direction): MoveResult {
  let currentBoard = board.map((r) => [...r]);
  let totalScoreGained = 0;

  // Transform matrix so we always slide LEFT
  let rotations = 0;
  if (direction === 'UP') {
    currentBoard = rotateCounterClockwise(currentBoard);
    rotations = 1;
  } else if (direction === 'RIGHT') {
    currentBoard = rotateClockwise(rotateClockwise(currentBoard));
    rotations = 2;
  } else if (direction === 'DOWN') {
    currentBoard = rotateClockwise(currentBoard);
    rotations = 3;
  }

  // Slide all rows to the left
  const newRows: number[][] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    const { line, score } = slideAndMergeLine(currentBoard[r]);
    newRows.push(line);
    totalScoreGained += score;
  }

  // Rotate back to original orientation
  let resultBoard = newRows;
  if (rotations === 1) {
    resultBoard = rotateClockwise(resultBoard);
  } else if (rotations === 2) {
    resultBoard = rotateClockwise(rotateClockwise(resultBoard));
  } else if (rotations === 3) {
    resultBoard = rotateCounterClockwise(resultBoard);
  }

  const hasChanged = !areBoardsEqual(board, resultBoard);

  return {
    board: resultBoard,
    scoreGained: totalScoreGained,
    hasChanged,
  };
}

/**
 * Checks if any valid move is possible (empty cells or adjacent matching tiles)
 */
export function canMove(board: BoardMatrix): boolean {
  // If there are empty cells, moves are possible
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === 0) return true;
    }
  }

  // Check adjacent cells for identical values (horizontal & vertical)
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const val = board[r][c];
      // Check right neighbor
      if (c + 1 < BOARD_SIZE && board[r][c + 1] === val) return true;
      // Check bottom neighbor
      if (r + 1 < BOARD_SIZE && board[r + 1][c] === val) return true;
    }
  }

  return false;
}

/**
 * Checks if any cell has reached 2048
 */
export function hasWon(board: BoardMatrix, target = 2048): boolean {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] >= target) return true;
    }
  }
  return false;
}
