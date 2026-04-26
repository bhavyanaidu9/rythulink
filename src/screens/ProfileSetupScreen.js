import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useTranslation } from '../i18n';
import Button from '../components/Button';
import Input from '../components/Input';
import { colors } from '../theme/colors';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProfileSetupScreen = () => {
  const { t } = useTranslation();
  const { user, login, userToken } = useAuth();
  
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [cropsGrown, setCropsGrown] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveProfile = async () => {
    if (!name || !village || !district || !cropsGrown) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, you would have a PUT /auth/me or PUT /farmers/me endpoint
      // Assuming a generic profile update endpoint here:
      // const response = await api.put('/farmers/me', { name, village, district, crops_grown: cropsGrown.split(',') });
      
      // Update local context to bypass ProfileSetup screen
      login(userToken, { ...user, name }); 
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('profileSetup')}</Text>
      
      <Input
        label={t('fullName')}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Rama Rao"
      />
      
      <Input
        label={t('village')}
        value={village}
        onChangeText={setVillage}
        placeholder="e.g. Palakurthi"
      />
      
      <Input
        label={t('district')}
        value={district}
        onChangeText={setDistrict}
        placeholder="e.g. Warangal"
      />
      
      <Input
        label={t('cropsGrown')}
        value={cropsGrown}
        onChangeText={setCropsGrown}
        placeholder="e.g. Tomato, Cotton"
      />

      <Button 
        title={t('completeSetup')} 
        onPress={handleSaveProfile} 
        style={styles.submitButton}
        disabled={isLoading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
    marginTop: 40,
  },
  submitButton: {
    marginTop: 32,
  },
});

export default ProfileSetupScreen;
