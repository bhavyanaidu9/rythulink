import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../../theme/colors';

const Avatar = ({ uri, name, size = 50 }) => {
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      {uri ? (
        <Image source={{ uri }} style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]} />
      ) : (
        <View style={[styles.fallback, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.initials, { fontSize: size * 0.4 }]}>{initials}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: colors.border,
  },
  image: {
    resizeMode: 'cover',
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: 'bold',
    color: colors.primary,
  },
});

export default Avatar;
