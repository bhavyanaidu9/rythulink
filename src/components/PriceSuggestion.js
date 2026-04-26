import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from '../i18n';
import { colors } from '../theme/colors';

const PriceSuggestion = ({ prediction, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Analyzing market trends...</Text>
      </View>
    );
  }

  if (!prediction || prediction.predicted_price_7days === 0) {
    return null;
  }

  const min = prediction.confidence_interval[0];
  const max = prediction.confidence_interval[1];

  const suggestionText = t('suggestedPrice')
    .replace('{{min}}', min.toString())
    .replace('{{max}}', max.toString());

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>💡</Text>
      <Text style={styles.text}>{suggestionText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD', // Light blue for info
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#90CAF9',
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  text: {
    flex: 1,
    color: '#1565C0',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default PriceSuggestion;
