export type Difficulty = 'easy' | 'medium' | 'hard';

export type BoardMatrix = number[][]; // 9x9 matrix (0 represents empty)

export interface CellCoord {
  row: number;
  col: number;
}

export interface CellData {
  row: number;
  col: number;
  value: number;
  given: boolean; // Part of the initial puzzle (cannot be edited)
  notes: number[]; // Pencil notes
  hasConflict: boolean;
}

export interface MoveRecord {
  row: number;
  col: number;
  prevValue: number;
  newValue: number;
  prevNotes: number[];
  newNotes: number[];
}
