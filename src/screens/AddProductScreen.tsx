import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useDispatch} from 'react-redux';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/RootNavigator';
import {productsApi} from '../services/productsApi';
import {addProduct} from '../store/productsSlice';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddProduct'>;
};

const CATEGORIES = ['vegetables', 'fruits', 'grains', 'pulses', 'spices', 'dairy', 'other'];

export function AddProductScreen({navigation}: Props) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: '',
    name_telugu: '',
    category: 'vegetables',
    quantity_kg: '',
    price_per_kg: '',
    min_order_kg: '1',
    description: '',
  });
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) => setForm(f => ({...f, [key]: value}));

  const pickImage = async () => {
    const result = await launchImageLibrary({mediaType: 'photo', quality: 0.8});
    if (result.assets?.[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.quantity_kg || !form.price_per_kg) {
      Alert.alert('పేరు, పరిమాణం మరియు ధర నమోదు చేయండి');
      return;
    }
    setLoading(true);
    try {
      const {data: product} = await productsApi.create({
        ...form,
        quantity_kg: parseFloat(form.quantity_kg),
        price_per_kg: parseFloat(form.price_per_kg),
        min_order_kg: parseFloat(form.min_order_kg || '1'),
      });

      if (imageUri) {
        const fd = new FormData();
        fd.append('files', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'product.jpg',
        } as any);
        await productsApi.uploadImages(product.id, fd);
      }

      dispatch(addProduct(product));
      Alert.alert('ఉత్పత్తి జోడించబడింది!');
      navigation.goBack();
    } catch {
      Alert.alert('ఉత్పత్తి సేవ్ కాలేదు. మళ్ళీ ప్రయత్నించండి.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>కొత్త ఉత్పత్తి జోడించండి</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {imageUri ? (
          <Image source={{uri: imageUri}} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imagePickerText}>📷 ఫోటో జోడించండి</Text>
        )}
      </TouchableOpacity>

      {[
        {key: 'name', label: 'ఉత్పత్తి పేరు (English)', placeholder: 'e.g. Tomato'},
        {key: 'name_telugu', label: 'ఉత్పత్తి పేరు (తెలుగు)', placeholder: 'e.g. టమాటా'},
        {key: 'quantity_kg', label: 'పరిమాణం (కేజీలు)', placeholder: '100', keyboard: 'decimal-pad'},
        {key: 'price_per_kg', label: 'ధర (₹/కేజీ)', placeholder: '15', keyboard: 'decimal-pad'},
        {key: 'min_order_kg', label: 'కనీస ఆర్డర్ (కేజీలు)', placeholder: '1', keyboard: 'decimal-pad'},
        {key: 'description', label: 'వివరణ (ఐచ్ఛికం)', placeholder: 'తాజా, సేంద్రీయ...'},
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

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>వర్గం</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, form.category === cat && styles.categoryChipActive]}
              onPress={() => update('category', cat)}>
              <Text style={[styles.categoryChipText, form.category === cat && styles.categoryChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'సేవ్ అవుతోంది...' : 'ఉత్పత్తి జోడించండి'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f0'},
  content: {padding: 24},
  title: {fontSize: 22, fontWeight: 'bold', color: '#2d7a2d', marginBottom: 20},
  imagePicker: {
    height: 160,
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2d7a2d',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  imagePreview: {width: '100%', height: '100%'},
  imagePickerText: {fontSize: 16, color: '#2d7a2d'},
  fieldGroup: {marginBottom: 16},
  label: {fontSize: 14, color: '#555', marginBottom: 6},
  input: {borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#fff'},
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginRight: 8,
  },
  categoryChipActive: {backgroundColor: '#2d7a2d'},
  categoryChipText: {color: '#555'},
  categoryChipTextActive: {color: '#fff', fontWeight: '600'},
  button: {backgroundColor: '#2d7a2d', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8},
  buttonText: {color: '#fff', fontSize: 18, fontWeight: '600'},
});