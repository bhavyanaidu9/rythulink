import React, {useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootState} from '../store';
import {setProducts, setLoading} from '../store/productsSlice';
import {productsApi} from '../services/productsApi';
import {RootStackParamList} from '../navigation/RootNavigator';
import FastImage from 'react-native-fast-image';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Main'>;
};

export function MyProductsScreen({navigation}: Props) {
  const dispatch = useDispatch();
  const {items, loading} = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(setLoading(true));
    productsApi.list()
      .then(res => dispatch(setProducts(res.data.items)))
      .finally(() => dispatch(setLoading(false)));
  }, [dispatch]);

  if (loading) {
    return <ActivityIndicator style={{flex: 1}} size="large" color="#2d7a2d" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>నా పంట ఉత్పత్తులు</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddProduct')}>
          <Text style={styles.addBtnText}>+ జోడించండి</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <View style={styles.card}>
            {item.image_urls?.[0] && (
              <FastImage style={styles.image} source={{uri: item.image_urls[0]}} />
            )}
            <View style={styles.info}>
              <Text style={styles.name}>{item.name_telugu || item.name}</Text>
              <Text style={styles.price}>₹{item.price_per_kg}/కేజీ</Text>
              <Text style={styles.qty}>{item.quantity_kg} కేజీలు అందుబాటులో</Text>
              {item.quality_grade && (
                <View style={[styles.gradeBadge, {backgroundColor: item.quality_grade === 'A' ? '#4caf50' : item.quality_grade === 'B' ? '#ff9800' : '#f44336'}]}>
                  <Text style={styles.gradeText}>గ్రేడ్ {item.quality_grade}</Text>
                </View>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>ఇంకా ఉత్పత్తులు జోడించలేదు</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f0'},
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 48},
  title: {fontSize: 20, fontWeight: 'bold', color: '#2d7a2d'},
  addBtn: {backgroundColor: '#2d7a2d', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8},
  addBtnText: {color: '#fff', fontWeight: '600'},
  list: {padding: 16, gap: 12},
  card: {backgroundColor: '#fff', borderRadius: 12, flexDirection: 'row', elevation: 2, overflow: 'hidden'},
  image: {width: 90, height: 90},
  info: {flex: 1, padding: 12},
  name: {fontSize: 16, fontWeight: '600'},
  price: {fontSize: 18, color: '#2d7a2d', fontWeight: 'bold', marginTop: 4},
  qty: {fontSize: 13, color: '#888', marginTop: 2},
  gradeBadge: {marginTop: 6, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4},
  gradeText: {color: '#fff', fontSize: 12, fontWeight: '600'},
  empty: {textAlign: 'center', color: '#999', marginTop: 60, fontSize: 16},
});
