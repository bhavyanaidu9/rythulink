import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from '../i18n';
import Button from '../components/Button';
import Input from '../components/Input';
import ImagePickerComponent from '../components/ImagePicker';
import PriceSuggestion from '../components/PriceSuggestion';
import { createListing, getSuggestedPrice } from '../services/listings';
import { colors } from '../theme/colors';

const CROPS = ['Tomato', 'Onion', 'Potato', 'Paddy', 'Cotton', 'Chilli'];

const CreateListingScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [cropName, setCropName] = useState(CROPS[0]);
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [photo, setPhoto] = useState(null);
  
  const [prediction, setPrediction] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPrice = async () => {
      setLoadingPrice(true);
      const data = await getSuggestedPrice(cropName);
      setPrediction(data);
      setLoadingPrice(false);
    };
    fetchPrice();
  }, [cropName]);

  const handleSubmit = async () => {
    if (!quantity || !price || !photo) {
      Alert.alert('Error', 'Please fill all fields and add a photo');
      return;
    }

    const formData = new FormData();
    formData.append('crop_name', cropName);
    formData.append('quantity_kg', quantity);
    formData.append('price_per_kg', price);
    formData.append('available_date', new Date().toISOString()); // For MVP, using today
    
    formData.append('photo', {
      name: photo.fileName || 'photo.jpg',
      type: photo.type || 'image/jpeg',
      uri: photo.uri,
    });

    setSubmitting(true);
    try {
      await createListing(formData);
      Alert.alert('Success', 'Listing created successfully');
      navigation.goBack();
    } catch (error) {
      if (error.message === 'OFFLINE_DRAFT_SAVED') {
        Alert.alert('Offline', t('noInternet'));
        navigation.goBack();
      } else {
        Alert.alert('Error', error.detail || 'Failed to create listing');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>{t('selectCrop')}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={cropName}
          onValueChange={(itemValue) => setCropName(itemValue)}
          style={styles.picker}
        >
          {CROPS.map(c => <Picker.Item key={c} label={t(c) || c} value={c} />)}
        </Picker>
      </View>

      <PriceSuggestion prediction={prediction} loading={loadingPrice} />

      <Input
        label={t('quantity')}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        placeholder="100"
      />

      <Input
        label={t('pricePerKg')}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        placeholder="20"
        prefix="₹"
      />

      <Text style={[styles.label, { marginTop: 12 }]}>{t('takePhoto')}</Text>
      <ImagePickerComponent 
        imageUri={photo?.uri} 
        onImageSelected={setPhoto} 
      />

      <View style={styles.spacer} />

      {submitting ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <Button 
          title={t('submitListing')} 
          onPress={handleSubmit} 
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  label: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    marginBottom: 16,
  },
  picker: {
    height: 56,
  },
  spacer: {
    height: 24,
  },
});

export default CreateListingScreen;
