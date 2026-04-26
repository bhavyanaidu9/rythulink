import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/RootNavigator';
import {authApi} from '../services/authApi';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export function LoginScreen({navigation}: Props) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    const formatted = phone.startsWith('+91') ? phone : `+91${phone}`;
    if (formatted.length < 13) {
      Alert.alert('దయచేసి సరైన మొబైల్ నంబర్ నమోదు చేయండి');
      return;
    }
    setLoading(true);
    try {
      await authApi.sendOTP(formatted);
      navigation.navigate('OTP', {phoneNumber: formatted});
    } catch {
      Alert.alert('OTP పంపడం విఫలమైంది. మళ్ళీ ప్రయత్నించండి.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>రైతులింక్</Text>
      <Text style={styles.subtitle}>రైతుల యాప్</Text>
      <TextInput
        style={styles.input}
        placeholder="మొబైల్ నంబర్"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        maxLength={10}
      />
      <TouchableOpacity style={styles.button} onPress={handleSendOTP} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'వేచి ఉండండి...' : 'OTP పంపండి'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f5f5f0'},
  title: {fontSize: 36, fontWeight: 'bold', color: '#2d7a2d', textAlign: 'center', marginBottom: 8},
  subtitle: {fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40},
  input: {borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 14, fontSize: 18, marginBottom: 16, backgroundColor: '#fff'},
  button: {backgroundColor: '#2d7a2d', padding: 16, borderRadius: 8, alignItems: 'center'},
  buttonText: {color: '#fff', fontSize: 18, fontWeight: '600'},
});
