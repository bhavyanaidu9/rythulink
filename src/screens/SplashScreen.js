import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Artificial delay to show logo, then navigate to Language Selection
    const timer = setTimeout(() => {
      navigation.replace('LanguageSelection');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* Placeholder for RythuLink Logo */}
        <Text style={styles.logoText}>RythuLink</Text>
        <Text style={styles.tagline}>Farmer-to-Shop Direct Supply</Text>
      </View>
      <ActivityIndicator size="large" color={colors.background} style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: colors.background,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: colors.surface,
  },
  loader: {
    marginTop: 40,
  },
});

export default SplashScreen;
