import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import {farmerApi} from '../services/farmerApi';

export function DashboardScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    farmerApi.getMyProfile()
      .then(res => setProfile(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <ActivityIndicator style={styles.center} size="large" color="#2d7a2d" />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>నమస్కారం, {profile?.name || 'రైతు'}</Text>
        <Text style={styles.subtext}>{profile?.village}, {profile?.district}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{profile?.total_orders ?? 0}</Text>
          <Text style={styles.statLabel}>మొత్తం ఆర్డర్లు</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{profile?.rating?.toFixed(1) ?? '0.0'}</Text>
          <Text style={styles.statLabel}>రేటింగ్</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{profile?.land_area_acres ?? '--'}</Text>
          <Text style={styles.statLabel}>ఎకరాలు</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f0'},
  center: {flex: 1, justifyContent: 'center'},
  header: {backgroundColor: '#2d7a2d', padding: 24, paddingTop: 48},
  greeting: {fontSize: 24, color: '#fff', fontWeight: 'bold'},
  subtext: {fontSize: 14, color: '#c8e6c9', marginTop: 4},
  statsRow: {flexDirection: 'row', margin: 16, gap: 12},
  statCard: {flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', elevation: 2},
  statValue: {fontSize: 28, fontWeight: 'bold', color: '#2d7a2d'},
  statLabel: {fontSize: 12, color: '#888', marginTop: 4},
});
