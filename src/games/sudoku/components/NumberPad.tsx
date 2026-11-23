import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { theme } from '@/theme';

interface NumberPadProps {
  remainingCounts: Record<number, number>;
  onNumberPress: (num: number) => void;
}

export const NumberPad: React.FC<NumberPadProps> = ({
  remainingCounts,
  onNumberPress,
}) => {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
        const remaining = remainingCounts[num] ?? 0;
        const isComplete = remaining === 0;

        return (
          <Pressable
            key={num}
            disabled={isComplete}
            onPress={() => onNumberPress(num)}
            style={({ pressed }) => [
              styles.btn,
              isComplete && styles.btnComplete,
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={[styles.numText, isComplete && styles.textComplete]}>
              {num}
            </Text>
            <Text style={[styles.subText, isComplete && styles.textComplete]}>
              {isComplete ? '✓' : remaining}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  btn: {
    flex: 1,
    height: 48,
    marginHorizontal: 3,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    // 3D tactile push feel
    borderBottomWidth: 3,
    borderBottomColor: theme.colors.borderStrong,
  },
  btnPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 1,
  },
  btnComplete: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    opacity: 0.35,
    borderBottomWidth: 1,
  },
  numText: {
    color: theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  subText: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    marginTop: -2,
  },
  textComplete: {
    color: theme.colors.textMuted,
  },
});
