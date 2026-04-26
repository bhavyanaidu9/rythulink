import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator} from 'react-native';
import {api} from '../services/api';

interface PredictionRow {
  date: string;
  predicted_price: number;
  lower_bound: number;
  upper_bound: number;
}

const COMMODITIES = ['tomato', 'onion', 'potato', 'chilli', 'brinjal', 'okra'];
const DISTRICTS = ['Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad', 'Khammam'];

export function PricesScreen() {
  const [commodity, setCommodity] = useState('tomato');
  const [district, setDistrict] = useState('Hyderabad');
  const [predictions, setPredictions] = useState<PredictionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [modelVersion, setModelVersion] = useState('');

  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const {data} = await api.post('/api/v1/prices/predict', {commodity, district, days_ahead: 7});
      setPredictions(data.predictions);
      setModelVersion(data.model_version);
    } catch {
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ధర అంచనా</Text>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>ఉత్పత్తి ఎంచుకోండి</Text>
        <FlatList
          horizontal
          data={COMMODITIES}
          keyExtractor={i => i}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[styles.chip, commodity === item && styles.chipActive]}
              onPress={() => setCommodity(item)}>
              <Text style={[styles.chipText, commodity === item && styles.chipTextActive]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>జిల్లా ఎంచుకోండి</Text>
        <FlatList
          horizontal
          data={DISTRICTS}
          keyExtractor={i => i}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[styles.chip, district === item && styles.chipActive]}
              onPress={() => setDistrict(item)}>
              <Text style={[styles.chipText, district === item && styles.chipTextActive]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={fetchPrediction} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'లోడ్ అవుతోంది...' : 'ధర చూపండి'}</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator style={{marginTop: 24}} color="#2d7a2d" />}

      {predictions.length > 0 && (
        <>
          <Text style={styles.modelNote}>మోడల్: {modelVersion}</Text>
          <FlatList
            data={predictions}
            keyExtractor={r => r.date}
            contentContainerStyle={{paddingBottom: 40}}
            renderItem={({item}) => (
              <View style={styles.row}>
                <Text style={styles.rowDate}>{item.date}</Text>
                <Text style={styles.rowPrice}>₹{item.predicted_price.toFixed(2)}</Text>
                <Text style={styles.rowRange}>
                  ₹{item.lower_bound.toFixed(0)} – ₹{item.upper_bound.toFixed(0)}
                </Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f0', padding: 16, paddingTop: 48},
  title: {fontSize: 22, fontWeight: 'bold', color: '#2d7a2d', marginBottom: 20},
  section: {marginBottom: 16},
  sectionLabel: {fontSize: 14, color: '#555', marginBottom: 8},
  chip: {paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#e0e0e0', marginRight: 8},
  chipActive: {backgroundColor: '#2d7a2d'},
  chipText: {color: '#555'},
  chipTextActive: {color: '#fff', fontWeight: '600'},
  button: {backgroundColor: '#2d7a2d', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8},
  buttonText: {color: '#fff', fontSize: 16, fontWeight: '600'},
  modelNote: {color: '#aaa', fontSize: 12, marginTop: 16, marginBottom: 8},
  row: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
  },
  rowDate: {color: '#555', fontSize: 13, flex: 1},
  rowPrice: {fontSize: 18, fontWeight: 'bold', color: '#2d7a2d', flex: 1, textAlign: 'center'},
  rowRange: {color: '#888', fontSize: 12, flex: 1, textAlign: 'right'},
});