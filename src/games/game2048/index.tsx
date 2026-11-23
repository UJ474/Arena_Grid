import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Modal,
} from 'react-native';
import { use2048 } from './state/use2048';
import { Board2048 } from './components/Board2048';
import { ScoreCard } from './components/ScoreCard';
import { Controls2048 } from './components/Controls2048';
import { theme } from '@/theme';

export function Game2048() {
  const {
    board,
    score,
    bestScore,
    isGameOver,
    isWon,
    canUndo,
    move,
    undo,
    restart,
    continuePlaying,
  } = use2048();

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {/* Score Header */}
      <ScoreCard
        score={score}
        bestScore={bestScore}
        onRestart={restart}
        onUndo={undo}
        canUndo={canUndo}
      />

      {/* 4x4 Swipeable Board */}
      <Board2048 board={board} onSwipe={move} />

      {/* Tactile D-Pad Controls */}
      <Controls2048 onMove={move} />

      {/* Game Over Modal */}
      <Modal visible={isGameOver} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalIcon}>💀</Text>
            <Text style={styles.modalTitle}>NO MORE MOVES</Text>
            <Text style={styles.modalSub}>
              Grid locked! Your final score is {score}.
            </Text>

            <View style={styles.modalStats}>
              <View style={styles.modalStatItem}>
                <Text style={styles.modalStatLabel}>SCORE</Text>
                <Text style={styles.modalStatValue}>{score}</Text>
              </View>
              <View style={styles.modalStatItem}>
                <Text style={styles.modalStatLabel}>BEST</Text>
                <Text style={styles.modalStatValue}>{bestScore}</Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              {canUndo && (
                <Pressable
                  onPress={undo}
                  style={({ pressed }) => [
                    styles.secondaryBtn,
                    pressed && styles.btnPressed,
                  ]}
                >
                  <Text style={styles.secondaryBtnText}>UNDO LAST MOVE</Text>
                </Pressable>
              )}

              <Pressable
                onPress={restart}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  pressed && styles.btnPressed,
                ]}
              >
                <Text style={styles.primaryBtnText}>TRY AGAIN</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* 2048 Victory Modal */}
      <Modal visible={isWon} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalIcon}>🏆</Text>
            <Text style={styles.modalTitle}>2048 REACHED!</Text>
            <Text style={styles.modalSub}>
              Master strategist. You merged the golden 2048 tile!
            </Text>

            <View style={styles.modalStats}>
              <View style={styles.modalStatItem}>
                <Text style={styles.modalStatLabel}>SCORE</Text>
                <Text style={styles.modalStatValue}>{score}</Text>
              </View>
              <View style={styles.modalStatItem}>
                <Text style={styles.modalStatLabel}>BEST</Text>
                <Text style={styles.modalStatValue}>{bestScore}</Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                onPress={continuePlaying}
                style={({ pressed }) => [
                  styles.secondaryBtn,
                  pressed && styles.btnPressed,
                ]}
              >
                <Text style={styles.secondaryBtnText}>KEEP GOING</Text>
              </Pressable>

              <Pressable
                onPress={restart}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  pressed && styles.btnPressed,
                ]}
              >
                <Text style={styles.primaryBtnText}>NEW GAME</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.borderStrong,
    borderBottomWidth: 6,
    borderBottomColor: theme.colors.border,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.sm,
  },
  modalTitle: {
    ...theme.typography.title1,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  modalSub: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 18,
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalStatItem: {
    alignItems: 'center',
  },
  modalStatLabel: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  modalStatValue: {
    color: theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 4,
  },
  modalButtons: {
    width: '100%',
    gap: 8,
  },
  primaryBtn: {
    backgroundColor: theme.colors.textPrimary,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
  },
  primaryBtnText: {
    color: theme.colors.textInverse,
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
  },
  secondaryBtn: {
    backgroundColor: theme.colors.surfaceHover,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderBottomWidth: 3,
    borderBottomColor: theme.colors.border,
  },
  secondaryBtnText: {
    color: theme.colors.textSecondary,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.8,
  },
  btnPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 1,
  },
});
