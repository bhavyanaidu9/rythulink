import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  interpolate 
} from 'react-native-reanimated';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const SkeletonLoader = ({ count = 3 }) => {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(shimmer.value, [0, 1], [0.3, 0.7]);
    return { opacity };
  });

  const renderItem = (i) => (
    <View key={i} style={styles.card}>
      <Animated.View style={[styles.image, animatedStyle]} />
      <View style={styles.content}>
        <Animated.View style={[styles.title, animatedStyle]} />
        <Animated.View style={[styles.subtitle, animatedStyle]} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {[...Array(count)].map((_, i) => renderItem(i))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.border,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    height: 20,
    width: '60%',
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 8,
  },
  subtitle: {
    height: 14,
    width: '40%',
    backgroundColor: colors.border,
    borderRadius: 4,
  },
});

export default SkeletonLoader;
