import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getGameById } from '@/games/registry';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/theme';

export default function GameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const game = id ? getGameById(id) : undefined;

  if (!game) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="UNKNOWN" showBack />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundIcon}>⚠️</Text>
          <Text style={styles.notFoundTitle}>GAME NOT FOUND</Text>
          <Text style={styles.notFoundText}>
            No game registered with identifier "{id}".
          </Text>
          <Pressable
            onPress={() => router.replace('/')}
            style={({ pressed }) => [
              styles.backHomeBtn,
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={styles.backHomeText}>RETURN TO ARENA</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const GameComponent = game.component;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title={game.title}
        subtitle={game.description}
        showBack
      />
      <View style={styles.gameWrapper}>
        <GameComponent />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gameWrapper: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  notFoundIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  notFoundTitle: {
    ...theme.typography.title1,
    color: theme.colors.textPrimary,
  },
  notFoundText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xl,
  },
  backHomeBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: theme.colors.textPrimary,
    borderRadius: 8,
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
  },
  backHomeText: {
    color: theme.colors.textInverse,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
  },
  btnPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 1,
  },
});
