import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GAME_REGISTRY } from '@/games/registry';
import { GameCategory } from '@/games/types';
import { GameCard } from '@/components/GameCard';
import { theme } from '@/theme';

export default function HomeScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'puzzle', 'strategy', 'arcade'];

  const filteredGames =
    selectedCategory === 'all'
      ? GAME_REGISTRY
      : GAME_REGISTRY.filter((g) => g.category === selectedCategory);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Rechabite-inspired Brutalist / Clean 3D Header */}
        <View style={styles.heroSection}>
          <Text style={styles.kicker}>ARCADE & LOGIC HUB</Text>
          <Text style={styles.brandTitle}>ARENA</Text>
          <Text style={styles.brandTitleSub}>GRID</Text>
          <Text style={styles.tagline}>
            Clean, tactical mind games under one roof. Pick your challenge.
          </Text>
        </View>

        {/* Category Filters */}
        <View style={styles.filterRow}>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={({ pressed }) => [
                  styles.filterChip,
                  isActive && styles.filterChipActive,
                  pressed && styles.btnPressed,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {cat.toUpperCase()}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* 2-Column Game Grid */}
        <View style={styles.grid}>
          {filteredGames.map((game) => (
            <View key={game.id} style={styles.gridItem}>
              <GameCard
                game={game}
                onPress={() => router.push(`/game/${game.id}`)}
              />
            </View>
          ))}
        </View>

        {/* Footer info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>ARENA GRID v1.0.0 • EXPO & EAS READY</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxxl,
  },
  heroSection: {
    marginBottom: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.lg,
  },
  kicker: {
    ...theme.typography.micro,
    color: theme.colors.textMuted,
    letterSpacing: 2,
    marginBottom: 4,
  },
  brandTitle: {
    fontSize: 44,
    fontWeight: '900',
    color: theme.colors.textPrimary,
    letterSpacing: 4,
    lineHeight: 46,
  },
  brandTitleSub: {
    fontSize: 44,
    fontWeight: '900',
    color: theme.colors.textSecondary,
    letterSpacing: 4,
    lineHeight: 46,
    marginBottom: theme.spacing.xs,
  },
  tagline: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    maxWidth: 320,
    marginTop: theme.spacing.xs,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
    gap: 8,
  },
  filterChip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderBottomWidth: 3,
    borderBottomColor: theme.colors.borderStrong,
  },
  filterChipActive: {
    backgroundColor: theme.colors.textPrimary,
    borderColor: theme.colors.borderActive,
    borderBottomColor: '#CBD5E1',
  },
  filterChipText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  filterChipTextActive: {
    color: theme.colors.textInverse,
  },
  btnPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: theme.spacing.lg,
  },
  footer: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerText: {
    ...theme.typography.micro,
    color: theme.colors.textMuted,
  },
});
