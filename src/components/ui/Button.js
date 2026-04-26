import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'large', 
  loading = false, 
  disabled = false,
  style 
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.96);
  };

  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  const getButtonStyle = () => {
    const base = [styles.button, styles[size]];
    if (variant === 'outline') base.push(styles.outline);
    if (variant === 'secondary') base.push(styles.secondary);
    if (variant === 'text') base.push(styles.textVariant);
    if (disabled) base.push(styles.disabled);
    return base;
  };

  const getTextStyle = () => {
    const base = [styles.buttonText, styles[`${size}Text`]];
    if (variant === 'outline' || variant === 'text') base.push(styles.outlineText);
    if (disabled) base.push(styles.disabledText);
    return base;
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <Animated.View style={[getButtonStyle(), animatedStyle, style]}>
        {loading ? (
          <ActivityIndicator color={variant === 'outline' ? colors.primary : '#FFF'} />
        ) : (
          <Text style={getTextStyle()}>{title}</Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.secondary },
  outline: { 
    backgroundColor: 'transparent', 
    borderWidth: 2, 
    borderColor: colors.primary 
  },
  textVariant: { backgroundColor: 'transparent' },
  disabled: { backgroundColor: colors.border },
  
  // Sizes
  small: { paddingVertical: 8, paddingHorizontal: 12 },
  medium: { paddingVertical: 12, paddingHorizontal: 20 },
  large: { paddingVertical: 16, paddingHorizontal: 24 },
  
  buttonText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  smallText: { fontSize: 14 },
  mediumText: { fontSize: 16 },
  largeText: { fontSize: 18 },
  
  outlineText: { color: colors.primary },
  disabledText: { color: colors.textSecondary },
});

export default Button;
