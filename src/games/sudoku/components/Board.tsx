import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Cell } from './Cell';
import { BoardMatrix, CellCoord } from '../logic/types';
import { theme } from '@/theme';

interface BoardProps {
  board: BoardMatrix;
  initialBoard: BoardMatrix;
  selectedCell: CellCoord | null;
  conflictingKeys: Set<string>;
  notes: Map<string, number[]>;
  onSelectCell: (row: number, col: number) => void;
}

export const Board: React.FC<BoardProps> = React.memo(
  ({
    board,
    initialBoard,
    selectedCell,
    conflictingKeys,
    notes,
    onSelectCell,
  }) => {
    const { width } = useWindowDimensions();
    // Leave margin on both sides
    const boardPadding = theme.spacing.md;
    const maxBoardWidth = Math.min(width - boardPadding * 2, 420);
    const cellSize = Math.floor((maxBoardWidth - 12) / 9);
    const finalBoardSize = cellSize * 9 + 8;

    const selectedValue =
      selectedCell && board[selectedCell.row]
        ? board[selectedCell.row][selectedCell.col]
        : 0;

    return (
      <View style={[styles.outerContainer, { width: finalBoardSize, height: finalBoardSize }]}>
        <View style={styles.boardGrid}>
          {board.map((row, rIdx) => (
            <View key={rIdx} style={styles.row}>
              {row.map((val, cIdx) => {
                const isSelected =
                  selectedCell !== null &&
                  selectedCell.row === rIdx &&
                  selectedCell.col === cIdx;

                const isSameNumber =
                  selectedValue !== 0 && val === selectedValue;

                const isRelated =
                  selectedCell !== null &&
                  (selectedCell.row === rIdx ||
                    selectedCell.col === cIdx ||
                    (Math.floor(selectedCell.row / 3) === Math.floor(rIdx / 3) &&
                      Math.floor(selectedCell.col / 3) === Math.floor(cIdx / 3)));

                const isGiven = initialBoard[rIdx][cIdx] !== 0;
                const key = `${rIdx},${cIdx}`;
                const hasConflict = conflictingKeys.has(key);
                const cellNotes = notes.get(key) || [];

                // 3x3 block borders
                const isBoxRight = (cIdx + 1) % 3 === 0 && cIdx !== 8;
                const isBoxBottom = (rIdx + 1) % 3 === 0 && rIdx !== 8;

                return (
                  <View
                    key={cIdx}
                    style={[
                      isBoxRight && styles.boxBorderRight,
                      isBoxBottom && styles.boxBorderBottom,
                    ]}
                  >
                    <Cell
                      row={rIdx}
                      col={cIdx}
                      value={val}
                      isGiven={isGiven}
                      isSelected={isSelected}
                      isSameNumber={isSameNumber}
                      isRelated={isRelated}
                      hasConflict={hasConflict}
                      notes={cellNotes}
                      cellSize={cellSize}
                      onPress={() => onSelectCell(rIdx, cIdx)}
                    />
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.borderStrong,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    // Simple 3D rim
    borderBottomWidth: 4,
    borderBottomColor: theme.colors.border,
  },
  boardGrid: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  boxBorderRight: {
    borderRightWidth: 2,
    borderRightColor: theme.colors.borderStrong,
    marginRight: 1,
  },
  boxBorderBottom: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.borderStrong,
    marginBottom: 1,
  },
});
