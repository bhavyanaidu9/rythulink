import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const Button = ({ title, onPress, disabled, style, textStyle }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16, // Large touch target
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56, // Minimum touch target size
  },
  disabled: {
    backgroundColor: colors.border,
  },
  text: {
    color: colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Button;
