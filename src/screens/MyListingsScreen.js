import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from '../i18n';
import ListingCard from '../components/ListingCard';
import { getMyListings } from '../services/listings';
import { colors } from '../theme/colors';

const TABS = ['ACTIVE', 'SOLD', 'EXPIRED'];

const MyListingsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [listings, setListings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      const data = await getMyListings(activeTab, 1);
      setListings(data.items || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchListings();
    }, [activeTab])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchListings();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => {
              setLoading(true);
              setActiveTab(tab);
            }}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {t(tab.toLowerCase()) || tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={listings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListingCard 
            listing={item} 
            onPress={() => navigation.navigate('ListingDetail', { listingId: item.id })} 
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={() => (
          !loading && <Text style={styles.emptyText}>No listings found.</Text>
        )}
      />

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('CreateListing')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: colors.textSecondary,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 32,
    color: colors.background,
    marginTop: -2,
  },
});

export default MyListingsScreen;
