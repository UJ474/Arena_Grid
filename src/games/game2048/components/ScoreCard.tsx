import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { theme } from '@/theme';

interface ScoreCardProps {
  score: number;
  bestScore: number;
  onRestart: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  score,
  bestScore,
  onRestart,
  onUndo,
  canUndo,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.scoresRow}>
        <View style={styles.scoreBlock}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>

        <View style={styles.scoreBlock}>
          <Text style={styles.scoreLabel}>BEST</Text>
          <Text style={styles.scoreValue}>{bestScore}</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <Pressable
          onPress={onUndo}
          disabled={!canUndo}
          style={({ pressed }) => [
            styles.actionBtn,
            !canUndo && styles.btnDisabled,
            pressed && canUndo && styles.btnPressed,
          ]}
        >
          <Text style={[styles.actionBtnText, !canUndo && styles.textDisabled]}>
            ⟲ UNDO
          </Text>
        </Pressable>

        <Pressable
          onPress={onRestart}
          style={({ pressed }) => [
            styles.actionBtn,
            styles.resetBtn,
            pressed && styles.btnPressed,
          ]}
        >
          <Text style={styles.resetBtnText}>NEW GAME</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 380,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
  },
  scoresRow: {
    flexDirection: 'row',
    gap: 8,
  },
  scoreBlock: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderBottomWidth: 3,
    borderBottomColor: theme.colors.borderStrong,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignItems: 'center',
    minWidth: 74,
  },
  scoreLabel: {
    color: theme.colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  scoreValue: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 1,
    fontVariant: ['tabular-nums'],
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderBottomWidth: 3,
    borderBottomColor: theme.colors.borderStrong,
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetBtn: {
    backgroundColor: theme.colors.surfaceHover,
    borderColor: theme.colors.borderStrong,
  },
  actionBtnText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  resetBtnText: {
    color: theme.colors.textPrimary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  btnDisabled: {
    opacity: 0.35,
    borderBottomWidth: 1,
  },
  textDisabled: {
    color: theme.colors.textMuted,
  },
  btnPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 1,
  },
});
