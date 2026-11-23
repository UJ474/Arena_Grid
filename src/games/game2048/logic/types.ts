export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type BoardMatrix = number[][]; // 4x4 matrix (0 represents empty)

export interface MoveResult {
  board: BoardMatrix;
  scoreGained: number;
  hasChanged: boolean;
}

export interface BoardHistory {
  board: BoardMatrix;
  score: number;
}
