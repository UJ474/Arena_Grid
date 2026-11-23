import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  ViewStyle,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';

interface TiltCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
}

/**
 * 3D tactile card that applies a subtle perspective tilt & scale on press.
 * Clean, tactile, and simple — no glow, just physical depth.
 */
export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  style,
  onPress,
  disabled = false,
}) => {
  const animatedScale = useRef(new Animated.Value(1)).current;
  const animatedTiltX = useRef(new Animated.Value(0)).current;
  const animatedTiltY = useRef(new Animated.Value(0)).current;

  const handlePressIn = (event: GestureResponderEvent) => {
    if (disabled) return;
    const { locationX, locationY } = event.nativeEvent;
    // Slight tilt depending on where the card was pressed
    const tiltXVal = locationY > 80 ? 4 : -4;
    const tiltYVal = locationX > 80 ? -4 : 4;

    Animated.parallel([
      Animated.spring(animatedScale, {
        toValue: 0.96,
        useNativeDriver: true,
        speed: 20,
        bounciness: 4,
      }),
      Animated.spring(animatedTiltX, {
        toValue: tiltXVal,
        useNativeDriver: true,
        speed: 20,
        bounciness: 4,
      }),
      Animated.spring(animatedTiltY, {
        toValue: tiltYVal,
        useNativeDriver: true,
        speed: 20,
        bounciness: 4,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.spring(animatedScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 6,
      }),
      Animated.spring(animatedTiltX, {
        toValue: 0,
        useNativeDriver: true,
        speed: 20,
        bounciness: 6,
      }),
      Animated.spring(animatedTiltY, {
        toValue: 0,
        useNativeDriver: true,
        speed: 20,
        bounciness: 6,
      }),
    ]).start();
  };

  const rotateX = animatedTiltX.interpolate({
    inputRange: [-10, 10],
    outputRange: ['-10deg', '10deg'],
  });

  const rotateY = animatedTiltY.interpolate({
    inputRange: [-10, 10],
    outputRange: ['-10deg', '10deg'],
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={styles.pressable}
    >
      <Animated.View
        style={[
          style,
          {
            transform: [
              { perspective: 800 },
              { scale: animatedScale },
              { rotateX },
              { rotateY },
            ],
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
});
