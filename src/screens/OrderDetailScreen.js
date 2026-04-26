import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, ActivityIndicator, Modal, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useTranslation } from '../i18n';
import Button from '../components/Button';
import OrderStatusBadge from '../components/OrderStatusBadge';
import ContactButtons from '../components/ContactButtons';
import ImagePickerComponent from '../components/ImagePicker';
import { getMyOrders, acceptOrder, rejectOrder, updateOrderStatus } from '../services/orders';
import { colors } from '../theme/colors';

const OrderDetailScreen = () => {
  const { t } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId } = route.params;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Modal states
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);
  const [proofPhoto, setProofPhoto] = useState(null);

  const fetchDetail = async () => {
    try {
      // Find order from API (in a real app, use GET /orders/{id})
      // Here we assume getMyOrders covers it or we have a generic fetch
      const statuses = ['PENDING', 'CONFIRMED', 'IN_TRANSIT', 'DELIVERED'];
      for (let s of statuses) {
        const response = await getMyOrders(s, 1);
        const item = response.items.find(i => i.id === orderId);
        if (item) {
          setOrder(item);
          break;
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [orderId]);

  const handleAction = (actionLabel, actionFunc) => {
    Alert.alert(
      actionLabel,
      `Are you sure you want to ${actionLabel.toLowerCase()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: async () => {
            setUpdating(true);
            try {
              await actionFunc();
              Alert.alert('Success', `${actionLabel} successful!`);
              fetchDetail();
            } catch (err) {
              Alert.alert('Error', err.detail || `Failed to ${actionLabel.toLowerCase()}`);
            } finally {
              setUpdating(false);
            }
          }
        }
      ]
    );
  };

  const handleReject = async () => {
    if (!rejectReason) {
      Alert.alert('Error', 'Please provide a reason');
      return;
    }
    setRejectModalVisible(false);
    setUpdating(true);
    try {
      await rejectOrder(orderId, rejectReason);
      Alert.alert('Success', 'Order rejected');
      fetchDetail();
    } catch (err) {
      Alert.alert('Error', err.detail || 'Failed to reject order');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelivery = async () => {
    if (!proofPhoto) {
      Alert.alert('Error', 'Please capture delivery proof photo');
      return;
    }
    setDeliveryModalVisible(false);
    setUpdating(true);
    try {
      // In real app, upload proofPhoto along with status update
      await updateOrderStatus(orderId, 'DELIVERED');
      Alert.alert('Success', 'Order marked as delivered and paid!');
      fetchDetail();
    } catch (err) {
      Alert.alert('Error', err.detail || 'Failed to mark as delivered');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} color={colors.primary} />;
  }

  if (!order) {
    return <Text style={styles.errorText}>Order not found</Text>;
  }

  // Assuming shop has location { lat, lng } for maps
  const hasLocation = order.shop && order.shop.lat && order.shop.lng;
  const shopCoord = hasLocation ? { latitude: order.shop.lat, longitude: order.shop.lng } : null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order {order.order_number}</Text>
        <OrderStatusBadge status={order.status} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shop Details</Text>
        <Text style={styles.infoText}>🏪 {order.shop?.shop_name || 'Shop Name'}</Text>
        <Text style={styles.infoText}>📍 {order.delivery_address || 'Address not provided'}</Text>
        
        {/* Contact Buttons */}
        <ContactButtons phoneNumber={order.shop?.phone_number || '1234567890'} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Crop</Text>
          <Text style={styles.value}>{order.listing?.crop_name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Quantity</Text>
          <Text style={styles.value}>{order.quantity_ordered_kg} kg</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Price per kg</Text>
          <Text style={styles.value}>₹{order.agreed_price_per_kg}</Text>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>₹{order.total_amount}</Text>
        </View>
      </View>

      {/* Map View */}
      {hasLocation && (
        <View style={styles.mapContainer}>
          <Text style={styles.sectionTitle}>Delivery Route</Text>
          <MapView 
            style={styles.map}
            initialRegion={{
              latitude: shopCoord.latitude,
              longitude: shopCoord.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker coordinate={shopCoord} title={order.shop.shop_name} />
          </MapView>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actionsContainer}>
        {updating && <ActivityIndicator size="small" color={colors.primary} style={{ marginBottom: 16 }} />}
        
        {order.status === 'PENDING' && (
          <View style={styles.buttonRow}>
            <Button 
              title="Accept Order" 
              style={[styles.flexBtn, { backgroundColor: colors.success }]} 
              onPress={() => handleAction('Accept Order', () => acceptOrder(orderId))} 
            />
            <Button 
              title="Reject" 
              style={[styles.flexBtn, { backgroundColor: colors.error }]} 
              onPress={() => setRejectModalVisible(true)} 
            />
          </View>
        )}

        {order.status === 'CONFIRMED' && (
          <Button 
            title="Mark In Transit" 
            style={{ backgroundColor: colors.secondary }}
            onPress={() => handleAction('Mark In Transit', () => updateOrderStatus(orderId, 'IN_TRANSIT'))} 
          />
        )}

        {order.status === 'IN_TRANSIT' && (
          <Button 
            title="Mark Delivered & Get Payment" 
            onPress={() => setDeliveryModalVisible(true)} 
          />
        )}
      </View>

      {/* Reject Modal */}
      <Modal visible={rejectModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reject Order</Text>
            <TextInput
              style={styles.input}
              placeholder="Reason for rejection..."
              value={rejectReason}
              onChangeText={setRejectReason}
              multiline
            />
            <View style={styles.buttonRow}>
              <Button title="Cancel" style={[styles.flexBtn, { backgroundColor: colors.border }]} onPress={() => setRejectModalVisible(false)} />
              <Button title="Confirm Reject" style={[styles.flexBtn, { backgroundColor: colors.error }]} onPress={handleReject} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Delivery Proof Modal */}
      <Modal visible={deliveryModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delivery Proof</Text>
            <Text style={styles.infoText}>Take a photo of the delivered goods to finalize payment.</Text>
            
            <ImagePickerComponent imageUri={proofPhoto?.uri} onImageSelected={setProofPhoto} />

            <View style={styles.buttonRow}>
              <Button title="Cancel" style={[styles.flexBtn, { backgroundColor: colors.border }]} onPress={() => setDeliveryModalVisible(false)} />
              <Button title="Complete Delivery" style={styles.flexBtn} onPress={handleDelivery} />
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderColor: colors.border },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  section: { padding: 24, borderBottomWidth: 1, borderColor: colors.border },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
  infoText: { fontSize: 16, color: colors.textSecondary, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  label: { fontSize: 16, color: colors.textSecondary },
  value: { fontSize: 16, color: colors.text, fontWeight: '500' },
  totalRow: { marginTop: 8, paddingTop: 16, borderTopWidth: 1, borderColor: colors.border },
  totalLabel: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: colors.primary },
  mapContainer: { height: 250, padding: 24 },
  map: { flex: 1, borderRadius: 12 },
  actionsContainer: { padding: 24, paddingBottom: 60 },
  buttonRow: { flexDirection: 'row', gap: 16 },
  flexBtn: { flex: 1 },
  errorText: { textAlign: 'center', marginTop: 50, fontSize: 18, color: colors.error },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modalContent: { backgroundColor: colors.background, padding: 24, borderRadius: 12 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, height: 100, textAlignVertical: 'top', marginBottom: 24 },
});

export default OrderDetailScreen;
