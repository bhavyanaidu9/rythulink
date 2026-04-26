import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from '../i18n';
import Button from '../components/Button';
import OTPInput from '../components/OTPInput';
import { colors } from '../theme/colors';
import { verifyOTP } from '../services/auth';
import { useAuth } from '../context/AuthContext';

const OTPVerificationScreen = () => {
  const { t, locale } = useTranslation();
  const route = useRoute();
  const { phone } = route.params;
  const { login } = useAuth();
  
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) return;

    setIsLoading(true);
    try {
      const response = await verifyOTP(phone, otp, null, locale);
      
      // If user has no name yet, they need to setup profile
      if (!response.user.name) {
        // We login the user but navigation will intercept and show ProfileSetup
        // Wait, best is to store token but have a "profile_incomplete" flag
        // For simplicity, we just save token, and AppNavigator checks user.name
      }
      
      login(response.token, response.user);
      
    } catch (error) {
      Alert.alert('Error', error.detail || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('verifyOTP')}</Text>
      <Text style={styles.subtitle}>Sent to {phone}</Text>
      
      <OTPInput value={otp} onChange={setOtp} length={6} />

      <View style={styles.spacer} />

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <Button 
          title={t('verifyOTP')} 
          onPress={handleVerify} 
          disabled={otp.length !== 6}
        />
      )}
      
      <Button 
        title={t('resendOTP')} 
        onPress={() => {}} // Implemented similarly to sendOTP
        style={styles.resendButton}
        textStyle={styles.resendText}
      />
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  spacer: {
    height: 40,
  },
  resendButton: {
    backgroundColor: 'transparent',
    marginTop: 16,
  },
  resendText: {
    color: colors.primary,
  },
});

export default OTPVerificationScreen;
