import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  easing 
} from 'react-native-reanimated';
import { colors } from '../theme/colors';

const LoadingSpinner = ({ size = 40 }) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1500,
        easing: easing.linear,
      }),
      -1 // Infinite repeat
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.icon, animatedStyle, { fontSize: size }]}>
        🌱
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    color: colors.primary,
  },
});

export default LoadingSpinner;
