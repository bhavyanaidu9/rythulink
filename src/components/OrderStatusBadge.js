import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from '../i18n';
import { colors } from '../theme/colors';

const OrderStatusBadge = ({ status }) => {
  const { t } = useTranslation();
  
  let backgroundColor = colors.border;
  let textColor = colors.textSecondary;

  switch (status) {
    case 'PENDING':
      backgroundColor = '#FFF3E0'; // Light Orange
      textColor = '#E65100';
      break;
    case 'CONFIRMED':
      backgroundColor = '#E3F2FD'; // Light Blue
      textColor = '#1565C0';
      break;
    case 'IN_TRANSIT':
      backgroundColor = '#FFF8E1'; // Light Yellow
      textColor = '#F57F17';
      break;
    case 'DELIVERED':
    case 'COMPLETED':
      backgroundColor = '#E8F5E9'; // Light Green
      textColor = '#2E7D32';
      break;
    case 'CANCELLED':
      backgroundColor = '#FFEBEE'; // Light Red
      textColor = '#C62828';
      break;
  }

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]}>
        {t(`status_${status}`) || status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default OrderStatusBadge;
