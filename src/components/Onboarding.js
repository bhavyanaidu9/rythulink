import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  interpolate, 
  Extrapolate 
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import Button from './ui/Button';

const { width } = Dimensions.get('window');

const SLIDES = [
  { id: '1', title: 'Direct Access', desc: 'Sell your crops directly to shops without middlemen.', icon: '🚜' },
  { id: '2', title: 'Smart Pricing', desc: 'Get AI-driven price suggestions based on market trends.', icon: '📈' },
  { id: '3', title: 'Easy Tracking', desc: 'Manage your orders and deliveries in real-time.', icon: '📦' }
];

const Onboarding = ({ onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const onScroll = (event) => {
    scrollX.value = event.nativeEvent.contentOffset.x;
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.desc}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={SLIDES}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
      />

      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {SLIDES.map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.dot, 
                currentIndex === i && styles.activeDot
              ]} 
            />
          ))}
        </View>

        <Button 
          title={currentIndex === SLIDES.length - 1 ? "Get Started" : "Next"} 
          onPress={currentIndex === SLIDES.length - 1 ? onFinish : () => {}} 
          style={styles.btn}
        />
        
        <TouchableOpacity onPress={onFinish} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  slide: { width, alignItems: 'center', justifyContent: 'center', padding: 40 },
  icon: { fontSize: 80, marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 16, textAlign: 'center' },
  desc: { fontSize: 18, color: colors.textSecondary, textAlign: 'center', lineHeight: 26 },
  footer: { padding: 40, alignItems: 'center' },
  indicatorContainer: { flexDirection: 'row', gap: 8, marginBottom: 40 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  activeDot: { width: 24, backgroundColor: colors.primary },
  btn: { width: '100%', marginBottom: 20 },
  skipBtn: { padding: 10 },
  skipText: { color: colors.textSecondary, fontWeight: 'bold' }
});

export default Onboarding;
