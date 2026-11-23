import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
}) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        {showBack && (
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={styles.backText}>← BACK</Text>
          </Pressable>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  backBtn: {
    marginRight: theme.spacing.md,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderBottomWidth: 3,
    borderBottomColor: theme.colors.borderStrong,
  },
  backText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  btnPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 1,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...theme.typography.hero,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginTop: theme.spacing.xs,
  },
});
