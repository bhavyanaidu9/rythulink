import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import {api} from '../services/api';

interface Order {
  id: string;
  order_number: string;
  shop_id: string;
  status: string;
  total_amount: number;
  delivery_address: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#ff9800',
  confirmed: '#2196f3',
  packed: '#9c27b0',
  out_for_delivery: '#00bcd4',
  delivered: '#4caf50',
  cancelled: '#f44336',
  disputed: '#ff5722',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'పెండింగ్',
  confirmed: 'నిర్ధారించబడింది',
  packed: 'ప్యాక్ చేయబడింది',
  out_for_delivery: 'డెలివరీలో',
  delivered: 'డెలివరీ అయింది',
  cancelled: 'రద్దు',
  disputed: 'వివాదంలో',
};

const NEXT_STATUS: Record<string, string> = {
  pending: 'confirmed',
  confirmed: 'packed',
  packed: 'out_for_delivery',
  out_for_delivery: 'delivered',
};

export function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    api.get('/api/v1/orders/')
      .then(res => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const advanceStatus = async (order: Order) => {
    const next = NEXT_STATUS[order.status];
    if (!next) {return;}
    try {
      await api.patch(`/api/v1/orders/${order.id}/status`, {status: next});
      setOrders(prev => prev.map(o => o.id === order.id ? {...o, status: next} : o));
    } catch {
      Alert.alert('స్థితి అప్డేట్ కాలేదు');
    }
  };

  if (loading) {
    return <ActivityIndicator style={{flex: 1}} size="large" color="#2d7a2d" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>నా ఆర్డర్లు</Text>
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        onRefresh={fetchOrders}
        refreshing={loading}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.orderNum}>#{item.order_number}</Text>
              <View style={[styles.statusBadge, {backgroundColor: STATUS_COLORS[item.status] || '#888'}]}>
                <Text style={styles.statusText}>{STATUS_LABELS[item.status] || item.status}</Text>
              </View>
            </View>
            <Text style={styles.amount}>₹{item.total_amount.toFixed(2)}</Text>
            <Text style={styles.address} numberOfLines={1}>{item.delivery_address}</Text>
            <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString('te-IN')}</Text>
            {NEXT_STATUS[item.status] && (
              <TouchableOpacity style={styles.advanceBtn} onPress={() => advanceStatus(item)}>
                <Text style={styles.advanceBtnText}>
                  {STATUS_LABELS[NEXT_STATUS[item.status]]} గా మార్చండి →
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>ఇంకా ఆర్డర్లు లేవు</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f0'},
  title: {fontSize: 20, fontWeight: 'bold', color: '#2d7a2d', padding: 16, paddingTop: 48},
  list: {padding: 16, gap: 12},
  card: {backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 2},
  cardHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8},
  orderNum: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  statusBadge: {paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12},
  statusText: {color: '#fff', fontSize: 12, fontWeight: '600'},
  amount: {fontSize: 22, fontWeight: 'bold', color: '#2d7a2d'},
  address: {color: '#666', marginTop: 4, fontSize: 13},
  date: {color: '#aaa', fontSize: 12, marginTop: 4},
  advanceBtn: {
    marginTop: 12,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d7a2d',
  },
  advanceBtnText: {color: '#2d7a2d', fontWeight: '600'},
  empty: {textAlign: 'center', color: '#999', marginTop: 60, fontSize: 16},
});