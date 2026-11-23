import { GameDefinition } from './types';
import { SudokuGame } from './sudoku';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/theme';

// Placeholder for future games
function PlaceholderGame({ name }: { name: string }) {
  return (
    <View style={placeholderStyles.container}>
      <Text style={placeholderStyles.icon}>🚧</Text>
      <Text style={placeholderStyles.title}>{name}</Text>
      <Text style={placeholderStyles.sub}>Under Construction</Text>
    </View>
  );
}

const placeholderStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  icon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.title1,
    color: theme.colors.textPrimary,
  },
  sub: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginTop: 6,
  },
});

export const GAME_REGISTRY: GameDefinition[] = [
  {
    id: 'sudoku',
    title: 'SUDOKU',
    description: 'Classic 9x9 logic puzzle. Fill the grid without repeats.',
    category: 'puzzle',
    icon: '▦',
    accentColor: theme.colors.tintSlate,
    component: SudokuGame,
    difficultyOptions: ['Easy', 'Medium', 'Hard'],
  },
  {
    id: '2048',
    title: '2048',
    description: 'Slide matching numbered tiles to reach the 2048 tile.',
    category: 'puzzle',
    icon: '⚂',
    accentColor: theme.colors.tintAmber,
    component: () => <PlaceholderGame name="2048" />,
    comingSoon: true,
  },
  {
    id: 'minesweeper',
    title: 'MINE GRID',
    description: 'Clear the minefield using deduction and numerical clues.',
    category: 'strategy',
    icon: '💣',
    accentColor: theme.colors.tintRose,
    component: () => <PlaceholderGame name="MINE GRID" />,
    comingSoon: true,
  },
  {
    id: 'wordgrid',
    title: 'WORD MATRIX',
    description: 'Link letters across the grid to discover hidden anagrams.',
    category: 'arcade',
    icon: '🔤',
    accentColor: theme.colors.tintEmerald,
    component: () => <PlaceholderGame name="WORD MATRIX" />,
    comingSoon: true,
  },
];

export function getGameById(id: string): GameDefinition | undefined {
  return GAME_REGISTRY.find((game) => game.id.toLowerCase() === id.toLowerCase());
}
