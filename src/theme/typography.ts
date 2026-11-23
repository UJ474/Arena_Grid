import { TextStyle } from 'react-native';

export const typography = {
  hero: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
  } as TextStyle,
  title1: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  } as TextStyle,
  title2: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.8,
  } as TextStyle,
  body: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  } as TextStyle,
  caption: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  } as TextStyle,
  micro: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  } as TextStyle,
};
