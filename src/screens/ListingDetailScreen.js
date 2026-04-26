import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, ActivityIndicator, Linking } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTranslation } from '../i18n';
import Button from '../components/Button';
import api from '../services/api';
import { deleteListing } from '../services/listings';
import { colors } from '../theme/colors';

const ListingDetailScreen = () => {
  const { t } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const { listingId } = route.params;

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // Backend doesn't have a specific GET /listings/{id} in the prompt, 
        // so we might filter it from my-listings or add a generic fetch
        // Assuming we can fetch the listing:
        const response = await api.get('/listings/my-listings', { params: { status: 'active', page: 1, limit: 100 } });
        const item = response.data.items.find(i => i.id === listingId);
        
        // Also check other tabs if not found in active
        setListing(item);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [listingId]);

  const handleDelete = () => {
    Alert.alert(
      t('delete'),
      'Are you sure you want to delete this listing?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: t('delete'), 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteListing(listingId);
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete listing');
            }
          }
        }
      ]
    );
  };

  const handleShare = () => {
    if (!listing) return;
    const msg = t('shareMessage')
      .replace('{{crop}}', t(listing.crop_name) || listing.crop_name)
      .replace('{{quantity}}', listing.quantity_kg)
      .replace('{{price}}', listing.price_per_kg);
      
    const url = `whatsapp://send?text=${encodeURIComponent(msg)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'WhatsApp is not installed on your device');
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} color={colors.primary} />;
  }

  if (!listing) {
    return <Text style={styles.errorText}>Listing not found</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <FastImage
        source={{ uri: listing.photo_url || 'https://via.placeholder.com/400' }}
        style={styles.image}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{t(listing.crop_name) || listing.crop_name}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{t(listing.status.toLowerCase()) || listing.status}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>{t('quantity')}</Text>
            <Text style={styles.statValue}>{listing.quantity_kg} kg</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>{t('pricePerKg')}</Text>
            <Text style={styles.statValue}>₹{listing.price_per_kg}</Text>
          </View>
        </View>

        {listing.quality_score && (
          <View style={styles.qualityBox}>
            <Text style={styles.qualityText}>Quality Score: {Math.round(listing.quality_score * 100)}%</Text>
          </View>
        )}

        <View style={styles.actions}>
          <Button 
            title={t('share')} 
            onPress={handleShare} 
            style={styles.shareButton} 
            textStyle={{ color: colors.primary }}
          />
          <View style={styles.row}>
            <Button 
              title={t('edit')} 
              onPress={() => {}} // Placeholder for Edit
              style={[styles.halfButton, { backgroundColor: colors.secondary }]} 
            />
            <Button 
              title={t('delete')} 
              onPress={handleDelete} 
              style={[styles.halfButton, { backgroundColor: colors.error }]} 
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  statusBadge: {
    backgroundColor: colors.primaryLight + '30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  statValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  qualityBox: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: 'center',
  },
  qualityText: {
    color: colors.success,
    fontWeight: 'bold',
    fontSize: 16,
  },
  actions: {
    gap: 16,
  },
  shareButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfButton: {
    flex: 1,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: colors.error,
  },
});

export default ListingDetailScreen;
