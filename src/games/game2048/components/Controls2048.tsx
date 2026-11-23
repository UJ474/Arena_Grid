import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Direction } from '../logic/types';
import { theme } from '@/theme';

interface Controls2048Props {
  onMove: (direction: Direction) => void;
}

export const Controls2048: React.FC<Controls2048Props> = ({ onMove }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.swipeTip}>SWIPE ON GRID OR TAP ARROWS</Text>
      <View style={styles.dpad}>
        {/* UP BUTTON */}
        <View style={styles.centerRow}>
          <Pressable
            onPress={() => onMove('UP')}
            style={({ pressed }) => [styles.arrowBtn, pressed && styles.btnPressed]}
          >
            <Text style={styles.arrowText}>▲</Text>
          </Pressable>
        </View>

        {/* LEFT / DOWN / RIGHT ROW */}
        <View style={styles.arrowRow}>
          <Pressable
            onPress={() => onMove('LEFT')}
            style={({ pressed }) => [styles.arrowBtn, pressed && styles.btnPressed]}
          >
            <Text style={styles.arrowText}>◀</Text>
          </Pressable>

          <Pressable
            onPress={() => onMove('DOWN')}
            style={({ pressed }) => [styles.arrowBtn, pressed && styles.btnPressed]}
          >
            <Text style={styles.arrowText}>▼</Text>
          </Pressable>

          <Pressable
            onPress={() => onMove('RIGHT')}
            style={({ pressed }) => [styles.arrowBtn, pressed && styles.btnPressed]}
          >
            <Text style={styles.arrowText}>▶</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  swipeTip: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: theme.spacing.sm,
  },
  dpad: {
    alignItems: 'center',
    gap: 6,
  },
  centerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  arrowRow: {
    flexDirection: 'row',
    gap: 8,
  },
  arrowBtn: {
    width: 62,
    height: 48,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderBottomWidth: 4,
    borderBottomColor: theme.colors.borderStrong,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
  },
  btnPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 1,
  },
});
