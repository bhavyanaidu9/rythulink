import React, { useEffect } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import LottieView from 'lottie-react-native';

const SuccessAnimation = ({ visible, onAnimationFinish }) => {
  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.container}>
        <LottieView
          source={require('../../assets/animations/success-check.json')}
          autoPlay
          loop={false}
          style={styles.lottie}
          onAnimationFinish={onAnimationFinish}
          speed={0.8}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 250,
    height: 250,
  },
});

export default SuccessAnimation;
