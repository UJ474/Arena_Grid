import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  PanResponder,
  useWindowDimensions,
} from 'react-native';
import { BoardMatrix, Direction } from '../logic/types';
import { Tile } from './Tile';
import { theme } from '@/theme';

interface Board2048Props {
  board: BoardMatrix;
  onSwipe: (direction: Direction) => void;
}

export const Board2048: React.FC<Board2048Props> = React.memo(
  ({ board, onSwipe }) => {
    const { width } = useWindowDimensions();
    const boardPadding = theme.spacing.lg;
    const maxBoardWidth = Math.min(width - boardPadding * 2, 380);
    const gap = 8;
    const tileSize = Math.floor((maxBoardWidth - gap * 5 - 8) / 4);
    const finalBoardSize = tileSize * 4 + gap * 5 + 8;

    // Zero-lag PanResponder swipe detector
    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          // Require at least 8px movement before capturing gesture
          return (
            Math.abs(gestureState.dx) > 8 || Math.abs(gestureState.dy) > 8
          );
        },
        onPanResponderRelease: (_, gestureState) => {
          const { dx, dy } = gestureState;
          const minSwipeDistance = 20;

          if (
            Math.abs(dx) < minSwipeDistance &&
            Math.abs(dy) < minSwipeDistance
          ) {
            return;
          }

          if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal swipe
            if (dx > 0) {
              onSwipe('RIGHT');
            } else {
              onSwipe('LEFT');
            }
          } else {
            // Vertical swipe
            if (dy > 0) {
              onSwipe('DOWN');
            } else {
              onSwipe('UP');
            }
          }
        },
      })
    ).current;

    return (
      <View
        {...panResponder.panHandlers}
        style={[
          styles.boardContainer,
          {
            width: finalBoardSize,
            height: finalBoardSize,
          },
        ]}
      >
        {board.map((row, rIdx) => (
          <View key={rIdx} style={styles.row}>
            {row.map((val, cIdx) => (
              <View key={cIdx} style={styles.tileSlot}>
                <Tile value={val} size={tileSize} />
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  boardContainer: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.borderStrong,
    borderBottomWidth: 5,
    borderBottomColor: theme.colors.border,
    padding: 8,
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tileSlot: {
    margin: 2,
  },
});
