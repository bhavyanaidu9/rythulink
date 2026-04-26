import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '../i18n';
import Button from '../components/Button';
import Input from '../components/Input';
import { colors } from '../theme/colors';
import { sendOTP } from '../services/auth';

const PhoneInputScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    // Validate length (approximate for India)
    if (phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    try {
      const formattedPhone = `+91${phone}`; // Force country code
      await sendOTP(formattedPhone);
      navigation.navigate('OTPVerification', { phone: formattedPhone });
    } catch (error) {
      Alert.alert('Error', error.detail || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('welcome')}</Text>
      
      <Input
        label={t('enterPhone')}
        value={phone}
        onChangeText={setPhone}
        placeholder="98765 43210"
        keyboardType="phone-pad"
        prefix="+91"
        maxLength={10}
      />

      <View style={styles.spacer} />

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <Button 
          title={t('sendOTP')} 
          onPress={handleSendOTP} 
          disabled={phone.length < 10}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 40,
  },
  spacer: {
    height: 40,
  },
});

export default PhoneInputScreen;
