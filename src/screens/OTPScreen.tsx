import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {RootStackParamList} from '../navigation/RootNavigator';
import {authApi} from '../services/authApi';
import {setTokens} from '../store/authSlice';
import {storage} from '../services/api';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'OTP'>;
  route: RouteProp<RootStackParamList, 'OTP'>;
};

export function OTPScreen({navigation, route}: Props) {
  const {phoneNumber} = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleVerify = async () => {
    setLoading(true);
    try {
      const {data} = await authApi.verifyOTP(phoneNumber, otp);
      storage.set('access_token', data.access_token);
      storage.set('refresh_token', data.refresh_token);
      dispatch(setTokens({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        userId: data.user_id,
        role: 'farmer',
      }));
    } catch {
      Alert.alert('తప్పు OTP. మళ్ళీ ప్రయత్నించండి.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP నమోదు చేయండి</Text>
      <Text style={styles.subtitle}>{phoneNumber} కి పంపబడింది</Text>
      <TextInput
        style={styles.input}
        placeholder="6-అంకె OTP"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
      />
      <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'వేచి ఉండండి...' : 'ధృవీకరించండి'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f5f5f0'},
  title: {fontSize: 28, fontWeight: 'bold', color: '#2d7a2d', textAlign: 'center', marginBottom: 8},
  subtitle: {fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 40},
  input: {borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 14, fontSize: 24, textAlign: 'center', marginBottom: 16, backgroundColor: '#fff', letterSpacing: 8},
  button: {backgroundColor: '#2d7a2d', padding: 16, borderRadius: 8, alignItems: 'center'},
  buttonText: {color: '#fff', fontSize: 18, fontWeight: '600'},
});
