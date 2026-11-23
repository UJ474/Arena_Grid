import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { theme } from '@/theme';

interface CellProps {
  row: number;
  col: number;
  value: number;
  isGiven: boolean;
  isSelected: boolean;
  isSameNumber: boolean;
  isRelated: boolean;
  hasConflict: boolean;
  notes: number[];
  cellSize: number;
  onPress: () => void;
}

export const Cell: React.FC<CellProps> = React.memo(
  ({
    value,
    isGiven,
    isSelected,
    isSameNumber,
    isRelated,
    hasConflict,
    notes,
    cellSize,
    onPress,
  }) => {
    // Determine background color
    let bgColor = theme.colors.cellDefault;
    if (isSelected) {
      bgColor = theme.colors.cellSelected;
    } else if (hasConflict) {
      bgColor = theme.colors.cellError;
    } else if (isSameNumber && value !== 0) {
      bgColor = theme.colors.cellHighlight;
    } else if (isRelated) {
      bgColor = theme.colors.surfaceHover;
    } else if (isGiven) {
      bgColor = theme.colors.cellGiven;
    }

    // Determine text color
    let textColor = isGiven ? theme.colors.textPrimary : theme.colors.tintSlate;
    if (hasConflict) {
      textColor = theme.colors.cellErrorText;
    } else if (isSelected) {
      textColor = theme.colors.textPrimary;
    }

    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.cell,
          {
            width: cellSize,
            height: cellSize,
            backgroundColor: bgColor,
            borderColor: isSelected ? theme.colors.borderActive : theme.colors.border,
            borderWidth: isSelected ? 2 : StyleSheet.hairlineWidth,
            transform: pressed ? [{ scale: 0.94 }] : [{ scale: 1 }],
          },
        ]}
      >
        {value !== 0 ? (
          <Text
            style={[
              styles.cellText,
              {
                color: textColor,
                fontWeight: isGiven ? '800' : '600',
                fontSize: Math.floor(cellSize * 0.52),
              },
            ]}
          >
            {value}
          </Text>
        ) : (
          <View style={styles.notesGrid}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <View key={n} style={styles.noteSlot}>
                {notes.includes(n) && (
                  <Text
                    style={[
                      styles.noteText,
                      {
                        fontSize: Math.floor(cellSize * 0.22),
                      },
                    ]}
                  >
                    {n}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  cellText: {
    textAlign: 'center',
  },
  notesGrid: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 1,
  },
  noteSlot: {
    width: '33.33%',
    height: '33.33%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
    lineHeight: 10,
  },
});
