import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

const Badge = ({ label, type = 'success', style }) => {
  const getBadgeStyle = () => {
    switch (type) {
      case 'warning': return { backgroundColor: '#FFF3E0', borderColor: colors.warning };
      case 'error': return { backgroundColor: '#FFEBEE', borderColor: colors.error };
      case 'info': return { backgroundColor: '#E3F2FD', borderColor: colors.primary };
      default: return { backgroundColor: '#E8F5E9', borderColor: colors.success };
    }
  };

  const getTextStyle = () => {
    switch (type) {
      case 'warning': return { color: '#E65100' };
      case 'error': return { color: colors.error };
      case 'info': return { color: colors.primary };
      default: return { color: colors.primary };
    }
  };

  return (
    <View style={[styles.badge, getBadgeStyle(), style]}>
      <Text style={[styles.text, getTextStyle()]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default Badge;
