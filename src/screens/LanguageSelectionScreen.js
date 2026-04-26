import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '../i18n';
import Button from '../components/Button';
import { colors } from '../theme/colors';

const LanguageSelectionScreen = () => {
  const { t, locale, changeLanguage } = useTranslation();
  const navigation = useNavigation();

  const handleContinue = () => {
    navigation.navigate('PhoneInput');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('chooseLanguage')}</Text>

      <View style={styles.languageContainer}>
        <TouchableOpacity
          style={[styles.langCard, locale === 'te' && styles.langCardSelected]}
          onPress={() => changeLanguage('te')}
          activeOpacity={0.8}
        >
          <Text style={[styles.langText, locale === 'te' && styles.langTextSelected]}>
            {t('telugu')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.langCard, locale === 'en' && styles.langCardSelected]}
          onPress={() => changeLanguage('en')}
          activeOpacity={0.8}
        >
          <Text style={[styles.langText, locale === 'en' && styles.langTextSelected]}>
            {t('english')}
          </Text>
        </TouchableOpacity>
      </View>

      <Button title={t('continue')} onPress={handleContinue} style={styles.continueButton} />
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
  languageContainer: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 48,
  },
  langCard: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  langCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '20', // slight tint
  },
  langText: {
    fontSize: 24,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  langTextSelected: {
    color: colors.primary,
  },
  continueButton: {
    marginTop: 'auto',
  },
});

export default LanguageSelectionScreen;
