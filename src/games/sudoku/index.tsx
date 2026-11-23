import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Modal,
} from 'react-native';
import { Board } from './components/Board';
import { NumberPad } from './components/NumberPad';
import { Controls } from './components/Controls';
import { useSudoku } from './state/useSudoku';
import { Difficulty } from './logic/types';
import { theme } from '@/theme';

export function SudokuGame() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const {
    board,
    initialBoard,
    difficulty,
    notes,
    selectedCell,
    setSelectedCell,
    isNoteMode,
    setIsNoteMode,
    conflictingKeys,
    remainingCounts,
    timer,
    mistakes,
    isWon,
    inputNumber,
    eraseCell,
    undo,
    giveHint,
    startNewGame,
  } = useSudoku(selectedDifficulty);

  // Format timer into mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDifficultyChange = (diff: Difficulty) => {
    setSelectedDifficulty(diff);
    startNewGame(diff);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {/* Top Bar: Difficulty Selector */}
      <View style={styles.difficultyRow}>
        {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => {
          const isActive = difficulty === d;
          return (
            <Pressable
              key={d}
              onPress={() => handleDifficultyChange(d)}
              style={({ pressed }) => [
                styles.diffBtn,
                isActive && styles.diffBtnActive,
                pressed && styles.btnPressed,
              ]}
            >
              <Text
                style={[
                  styles.diffText,
                  isActive && styles.diffTextActive,
                ]}
              >
                {d.toUpperCase()}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Info Stats Bar: Mistakes & Timer */}
      <View style={styles.statsBar}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>MISTAKES</Text>
          <Text style={[styles.statValue, mistakes > 0 && { color: theme.colors.error }]}>
            {mistakes}
          </Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>TIME</Text>
          <Text style={styles.statValue}>{formatTime(timer)}</Text>
        </View>

        <Pressable
          onPress={() => startNewGame(difficulty)}
          style={({ pressed }) => [
            styles.restartBtn,
            pressed && styles.btnPressed,
          ]}
        >
          <Text style={styles.restartText}>RESET</Text>
        </Pressable>
      </View>

      {/* 9x9 Board */}
      <Board
        board={board}
        initialBoard={initialBoard}
        selectedCell={selectedCell}
        conflictingKeys={conflictingKeys}
        notes={notes}
        onSelectCell={(row, col) => setSelectedCell({ row, col })}
      />

      {/* Controls: Undo, Erase, Notes, Hint */}
      <Controls
        isNoteMode={isNoteMode}
        onToggleNote={() => setIsNoteMode((prev) => !prev)}
        onErase={eraseCell}
        onUndo={undo}
        onHint={giveHint}
      />

      {/* Number Pad (1-9) */}
      <NumberPad
        remainingCounts={remainingCounts}
        onNumberPress={inputNumber}
      />

      {/* Victory Modal */}
      <Modal visible={isWon} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalIcon}>🏆</Text>
            <Text style={styles.modalTitle}>PUZZLE COMPLETED</Text>
            <Text style={styles.modalSub}>
              You conquered {difficulty.toUpperCase()} mode!
            </Text>

            <View style={styles.modalStats}>
              <View style={styles.modalStatItem}>
                <Text style={styles.modalStatLabel}>TIME</Text>
                <Text style={styles.modalStatValue}>{formatTime(timer)}</Text>
              </View>
              <View style={styles.modalStatItem}>
                <Text style={styles.modalStatLabel}>MISTAKES</Text>
                <Text style={styles.modalStatValue}>{mistakes}</Text>
              </View>
            </View>

            <Pressable
              onPress={() => startNewGame(difficulty)}
              style={({ pressed }) => [
                styles.modalBtn,
                pressed && styles.btnPressed,
              ]}
            >
              <Text style={styles.modalBtnText}>PLAY AGAIN</Text>
            </Pressable>
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
  difficultyRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  diffBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  diffBtnActive: {
    backgroundColor: theme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
  },
  diffText: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  diffTextActive: {
    color: theme.colors.textPrimary,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 420,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  statBox: {
    alignItems: 'flex-start',
  },
  statLabel: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  statValue: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  restartBtn: {
    backgroundColor: theme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderBottomWidth: 3,
    borderBottomColor: theme.colors.borderStrong,
  },
  restartText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  btnPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 1,
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
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
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
    fontWeight: '800',
    marginTop: 4,
  },
  modalBtn: {
    backgroundColor: theme.colors.textPrimary,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
  },
  modalBtnText: {
    color: theme.colors.textInverse,
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
});
