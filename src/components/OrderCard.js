import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from '../i18n';
import { colors } from '../theme/colors';
import OrderStatusBadge from './OrderStatusBadge';

const OrderCard = ({ order, onPress }) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.orderNumber}>{order.order_number}</Text>
        <OrderStatusBadge status={order.status} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.shopName}>🏪 {order.shop?.shop_name || 'Shop Name'}</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Crop:</Text>
          <Text style={styles.value}>{order.listing?.crop_name || 'Crop'}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Quantity:</Text>
          <Text style={styles.value}>{order.quantity_ordered_kg} kg</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Total Price:</Text>
          <Text style={styles.valueTotal}>₹{order.total_amount}</Text>
        </View>

        {order.delivery_address && (
          <View style={styles.addressContainer}>
            <Text style={styles.label}>📍 Delivery to:</Text>
            <Text style={styles.addressText} numberOfLines={2}>{order.delivery_address}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    gap: 8,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  value: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  valueTotal: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  addressText: {
    color: colors.text,
    fontSize: 14,
    marginTop: 4,
  },
});

export default OrderCard;
