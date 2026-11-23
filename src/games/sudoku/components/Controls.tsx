import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { theme } from '@/theme';

interface ControlsProps {
  isNoteMode: boolean;
  onToggleNote: () => void;
  onErase: () => void;
  onUndo: () => void;
  onHint: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isNoteMode,
  onToggleNote,
  onErase,
  onUndo,
  onHint,
}) => {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onUndo}
        style={({ pressed }) => [styles.actionBtn, pressed && styles.btnPressed]}
      >
        <Text style={styles.iconText}>⟲</Text>
        <Text style={styles.label}>UNDO</Text>
      </Pressable>

      <Pressable
        onPress={onErase}
        style={({ pressed }) => [styles.actionBtn, pressed && styles.btnPressed]}
      >
        <Text style={styles.iconText}>✕</Text>
        <Text style={styles.label}>ERASE</Text>
      </Pressable>

      <Pressable
        onPress={onToggleNote}
        style={({ pressed }) => [
          styles.actionBtn,
          isNoteMode && styles.activeBtn,
          pressed && styles.btnPressed,
        ]}
      >
        <Text
          style={[styles.iconText, isNoteMode && { color: theme.colors.textInverse }]}
        >
          ✎
        </Text>
        <Text
          style={[styles.label, isNoteMode && { color: theme.colors.textInverse }]}
        >
          {isNoteMode ? 'NOTES: ON' : 'NOTES'}
        </Text>
      </Pressable>

      <Pressable
        onPress={onHint}
        style={({ pressed }) => [styles.actionBtn, pressed && styles.btnPressed]}
      >
        <Text style={styles.iconText}>💡</Text>
        <Text style={styles.label}>HINT</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  actionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 8,
    backgroundColor: theme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 70,
    // 3D tactile depth
    borderBottomWidth: 3,
    borderBottomColor: theme.colors.borderStrong,
  },
  activeBtn: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.borderActive,
    borderBottomColor: '#CBD5E1',
  },
  btnPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 1,
  },
  iconText: {
    fontSize: 18,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  label: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 2,
  },
});
