import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView} from 'react-native';
import {useDispatch} from 'react-redux';
import {farmerApi} from '../services/farmerApi';
import {logout} from '../store/authSlice';
import {storage} from '../services/api';
import FastImage from 'react-native-fast-image';

export function ProfileScreen() {
  const dispatch = useDispatch();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    farmerApi.getMyProfile()
      .then(res => setProfile(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    Alert.alert('లాగ్ అవుట్', 'మీరు ఖచ్చితంగా లాగ్ అవుట్ చేయాలనుకుంటున్నారా?', [
      {text: 'రద్దు', style: 'cancel'},
      {
        text: 'లాగ్ అవుట్',
        style: 'destructive',
        onPress: () => {
          storage.clearAll();
          dispatch(logout());
        },
      },
    ]);
  };

  if (loading) {
    return <ActivityIndicator style={{flex: 1}} size="large" color="#2d7a2d" />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {profile?.profile_photo_url ? (
          <FastImage
            style={styles.avatar}
            source={{uri: profile.profile_photo_url}}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>{profile?.name?.[0] || 'R'}</Text>
          </View>
        )}
        <Text style={styles.name}>{profile?.name || 'రైతు'}</Text>
        <Text style={styles.location}>{profile?.village}, {profile?.mandal}, {profile?.district}</Text>
      </View>

      <View style={styles.infoSection}>
        {[
          {label: 'రేటింగ్', value: `${profile?.rating?.toFixed(1) ?? '0.0'} ⭐`},
          {label: 'మొత్తం ఆర్డర్లు', value: profile?.total_orders ?? 0},
          {label: 'భూమి', value: profile?.land_area_acres ? `${profile.land_area_acres} ఎకరాలు` : 'నమోదు కాలేదు'},
          {label: 'బ్యాంక్ అకౌంట్', value: profile?.bank_account ? '✓ నమోదయింది' : 'నమోదు కాలేదు'},
        ].map(item => (
          <View key={item.label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{item.label}</Text>
            <Text style={styles.infoValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>లాగ్ అవుట్</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f0'},
  header: {backgroundColor: '#2d7a2d', padding: 32, alignItems: 'center'},
  avatar: {width: 80, height: 80, borderRadius: 40, marginBottom: 12},
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#c8e6c9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarInitial: {fontSize: 32, fontWeight: 'bold', color: '#2d7a2d'},
  name: {fontSize: 22, fontWeight: 'bold', color: '#fff'},
  location: {fontSize: 14, color: '#c8e6c9', marginTop: 4},
  infoSection: {backgroundColor: '#fff', margin: 16, borderRadius: 12, overflow: 'hidden', elevation: 2},
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {color: '#777', fontSize: 15},
  infoValue: {color: '#333', fontSize: 15, fontWeight: '600'},
  logoutBtn: {
    margin: 16,
    backgroundColor: '#ffebee',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ef9a9a',
  },
  logoutText: {color: '#c62828', fontSize: 16, fontWeight: '600'},
});