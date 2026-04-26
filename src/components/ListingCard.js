import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTranslation } from '../i18n';
import { colors } from '../theme/colors';

const ListingCard = ({ listing, onPress }) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <FastImage
        source={{ uri: listing.photo_url || 'https://via.placeholder.com/150' }}
        style={styles.image}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{listing.crop_name}</Text>
        <Text style={styles.detail}>
          {t('quantity')}: {listing.quantity_kg} kg
        </Text>
        <Text style={styles.detail}>
          {t('pricePerKg')}: ₹{listing.price_per_kg}
        </Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {t(listing.status.toLowerCase()) || listing.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: 100,
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: colors.primaryLight + '30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ListingCard;
