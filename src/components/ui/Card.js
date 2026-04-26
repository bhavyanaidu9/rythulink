import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const Card = ({ children, style, padding = 'md' }) => {
  return (
    <View style={[styles.card, { padding: spacing[padding] }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android elevation
    elevation: 3,
  },
});

export default Card;
