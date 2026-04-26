import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert} from 'react-native';
import {useDispatch} from 'react-redux';
import {farmerApi} from '../services/farmerApi';
import {setProfileComplete} from '../store/authSlice';

const DISTRICTS = [
  'Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam',
  'Nalgonda', 'Mahbubnagar', 'Adilabad', 'Rangareddy', 'Medak',
];

export function ProfileSetupScreen() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({name: '', village: '', mandal: '', district: '', land_area_acres: ''});
  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) => setForm(f => ({...f, [key]: value}));

  const handleSubmit = async () => {
    if (!form.name || !form.village || !form.mandal || !form.district) {
      Alert.alert('అన్ని వివరాలు నమోదు చేయండి');
      return;
    }
    setLoading(true);
    try {
      await farmerApi.createProfile({
        ...form,
        land_area_acres: form.land_area_acres ? parseFloat(form.land_area_acres) : undefined,
      });
      dispatch(setProfileComplete(true));
    } catch {
      Alert.alert('ప్రొఫైల్ సేవ్ కాలేదు. మళ్ళీ ప్రయత్నించండి.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>మీ వివరాలు నమోదు చేయండి</Text>
      {[
        {key: 'name', label: 'పేరు', placeholder: 'మీ పూర్తి పేరు'},
        {key: 'village', label: 'గ్రామం', placeholder: 'గ్రామం పేరు'},
        {key: 'mandal', label: 'మండలం', placeholder: 'మండలం పేరు'},
        {key: 'district', label: 'జిల్లా', placeholder: 'జిల్లా ఎంచుకోండి'},
        {key: 'land_area_acres', label: 'భూమి (ఎకరాలు)', placeholder: 'ఐచ్ఛికం', keyboard: 'numeric'},
      ].map(field => (
        <View key={field.key} style={styles.fieldGroup}>
          <Text style={styles.label}>{field.label}</Text>
          <TextInput
            style={styles.input}
            placeholder={field.placeholder}
            value={(form as any)[field.key]}
            onChangeText={v => update(field.key, v)}
            keyboardType={(field as any).keyboard || 'default'}
          />
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'సేవ్ అవుతోంది...' : 'సేవ్ చేయండి'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f0'},
  content: {padding: 24},
  title: {fontSize: 22, fontWeight: 'bold', color: '#2d7a2d', marginBottom: 24},
  fieldGroup: {marginBottom: 16},
  label: {fontSize: 14, color: '#555', marginBottom: 6},
  input: {borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#fff'},
  button: {backgroundColor: '#2d7a2d', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8},
  buttonText: {color: '#fff', fontSize: 18, fontWeight: '600'},
});
