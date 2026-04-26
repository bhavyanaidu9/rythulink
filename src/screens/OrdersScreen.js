import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from '../i18n';
import OrderCard from '../components/OrderCard';
import { getMyOrders } from '../services/orders';
import { colors } from '../theme/colors';

const TABS = ['PENDING', 'CONFIRMED', 'COMPLETED'];

const OrdersScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  
  const [activeTab, setActiveTab] = useState('PENDING');
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      // Map COMPLETED tab to DELIVERED backend status to match requirements
      const statusFilter = activeTab === 'COMPLETED' ? 'DELIVERED' : activeTab;
      const data = await getMyOrders(statusFilter, 1);
      setOrders(data.items || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [activeTab])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
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
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <OrderCard 
            order={item} 
            onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })} 
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={() => (
          !loading && <Text style={styles.emptyText}>No orders found.</Text>
        )}
      />
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
    paddingBottom: 40,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: colors.textSecondary,
    fontSize: 16,
  },
});

export default OrdersScreen;
