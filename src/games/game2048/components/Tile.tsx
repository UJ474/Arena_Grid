import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/theme';

interface TileProps {
  value: number;
  size: number;
}

// Clean brutalist palette for tile values (strictly no purple, no glow)
const TILE_CONFIG: Record<
  number,
  { bg: string; text: string; border: string; bottomBorder: string }
> = {
  2: {
    bg: '#181C22',
    text: '#E2E8F0',
    border: '#2A303C',
    bottomBorder: '#1E242E',
  },
  4: {
    bg: '#1F242C',
    text: '#F1F5F9',
    border: '#333B4A',
    bottomBorder: '#262D38',
  },
  8: {
    bg: '#1E3246',
    text: '#F8FAFC',
    border: '#2B4865',
    bottomBorder: '#162738',
  },
  16: {
    bg: '#163E59',
    text: '#FFFFFF',
    border: '#24597D',
    bottomBorder: '#102F44',
  },
  32: {
    bg: '#0F4C5C',
    text: '#FFFFFF',
    border: '#1B6A80',
    bottomBorder: '#0A3742',
  },
  64: {
    bg: '#005F73',
    text: '#FFFFFF',
    border: '#0A849F',
    bottomBorder: '#004757',
  },
  128: {
    bg: '#0A7056',
    text: '#FFFFFF',
    border: '#129674',
    bottomBorder: '#06523F',
  },
  256: {
    bg: '#944400',
    text: '#FFFFFF',
    border: '#BD5700',
    bottomBorder: '#6E3200',
  },
  512: {
    bg: '#A83210',
    text: '#FFFFFF',
    border: '#D44218',
    bottomBorder: '#7E240A',
  },
  1024: {
    bg: '#A61C1C',
    text: '#FFFFFF',
    border: '#D32727',
    bottomBorder: '#7A1313',
  },
  2048: {
    bg: '#F59E0B',
    text: '#090A0C',
    border: '#FBBF24',
    bottomBorder: '#D97706',
  },
};

export const Tile: React.FC<TileProps> = React.memo(({ value, size }) => {
  if (value === 0) {
    return (
      <View
        style={[
          styles.emptyTile,
          {
            width: size,
            height: size,
          },
        ]}
      />
    );
  }

  const config =
    TILE_CONFIG[value] || {
      bg: '#FFFFFF',
      text: '#090A0C',
      border: '#E2E8F0',
      bottomBorder: '#CBD5E1',
    };

  // Adjust font size for larger numbers
  let fontSize = Math.floor(size * 0.44);
  if (value >= 100 && value < 1000) {
    fontSize = Math.floor(size * 0.36);
  } else if (value >= 1000 && value < 10000) {
    fontSize = Math.floor(size * 0.28);
  } else if (value >= 10000) {
    fontSize = Math.floor(size * 0.22);
  }

  return (
    <View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          backgroundColor: config.bg,
          borderColor: config.border,
          borderBottomColor: config.bottomBorder,
        },
      ]}
    >
      <Text
        style={[
          styles.tileText,
          {
            color: config.text,
            fontSize,
          },
        ]}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  emptyTile: {
    backgroundColor: theme.colors.surface,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tile: {
    borderRadius: 6,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  tileText: {
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
});
