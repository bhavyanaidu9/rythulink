import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          {t('welcome')}, {user?.name || 'Farmer'}
        </Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => navigation.navigate('MyListings')}>
          <Text style={styles.cardIcon}>📦</Text>
          <Text style={styles.cardTitle}>{t('myListings')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => navigation.navigate('CreateListing')}>
          <Text style={styles.cardIcon}>➕</Text>
          <Text style={styles.cardTitle}>{t('addListing')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => navigation.navigate('Orders')}>
          <Text style={styles.cardIcon}>📋</Text>
          <Text style={styles.cardTitle}>{t('orders')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} activeOpacity={0.8}>
          <Text style={styles.cardIcon}>👤</Text>
          <Text style={styles.cardTitle}>{t('profile')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 24,
    paddingTop: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  welcomeText: {
    color: colors.background,
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: colors.background,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: colors.background,
    width: '47%',
    aspectRatio: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2, // shadow for Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
