import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Linking, Alert } from 'react-native';
import { colors } from '../theme/colors';

const ContactButtons = ({ phoneNumber }) => {
  const handleCall = () => {
    if (!phoneNumber) return;
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert('Error', 'Unable to make a call from this device');
    });
  };

  const handleWhatsApp = () => {
    if (!phoneNumber) return;
    Linking.openURL(`whatsapp://send?phone=${phoneNumber}`).catch(() => {
      Alert.alert('Error', 'WhatsApp is not installed on your device');
    });
  };

  if (!phoneNumber) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, styles.callButton]} onPress={handleCall}>
        <Text style={styles.icon}>📞</Text>
        <Text style={styles.buttonText}>Call Shop</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.waButton]} onPress={handleWhatsApp}>
        <Text style={styles.icon}>💬</Text>
        <Text style={[styles.buttonText, { color: '#075E54' }]}>WhatsApp</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  callButton: {
    backgroundColor: colors.primaryLight + '20',
    borderColor: colors.primary,
  },
  waButton: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  buttonText: {
    fontWeight: 'bold',
    color: colors.primary,
  },
});

export default ContactButtons;
