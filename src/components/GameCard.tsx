import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TiltCard } from './TiltCard';
import { GameDefinition } from '@/games/types';
import { theme } from '@/theme';

interface GameCardProps {
  game: GameDefinition;
  onPress: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onPress }) => {
  return (
    <TiltCard
      onPress={onPress}
      disabled={game.comingSoon}
      style={[
        styles.card,
        game.comingSoon && styles.cardDisabled,
      ]}
    >
      {/* Top Header inside Card */}
      <View style={styles.headerRow}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>{game.icon}</Text>
        </View>

        {game.comingSoon ? (
          <View style={styles.badgeSoon}>
            <Text style={styles.badgeSoonText}>SOON</Text>
          </View>
        ) : (
          <View style={styles.badgeLive}>
            <Text style={styles.badgeLiveText}>PLAY</Text>
          </View>
        )}
      </View>

      {/* Title & Description */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {game.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {game.description}
        </Text>
      </View>

      {/* Bottom Architectural Line */}
      <View style={[styles.bottomBar, { backgroundColor: game.accentColor }]} />
    </TiltCard>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.borderStrong,
    // 3D physical rim on bottom
    borderBottomWidth: 4,
    borderBottomColor: theme.colors.border,
    padding: theme.spacing.lg,
    minHeight: 160,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  cardDisabled: {
    opacity: 0.55,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconText: {
    fontSize: 22,
    color: theme.colors.textPrimary,
  },
  badgeLive: {
    backgroundColor: theme.colors.textPrimary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeLiveText: {
    color: theme.colors.textInverse,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  badgeSoon: {
    backgroundColor: theme.colors.surfaceHover,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  badgeSoonText: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  content: {
    marginTop: theme.spacing.md,
  },
  title: {
    ...theme.typography.title1,
    color: theme.colors.textPrimary,
    letterSpacing: 1.5,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
  bottomBar: {
    height: 3,
    width: '100%',
    borderRadius: 1.5,
    marginTop: theme.spacing.md,
    opacity: 0.8,
  },
});
