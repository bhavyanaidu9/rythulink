import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from '../i18n';
import { colors } from '../theme/colors';

const ImagePickerComponent = ({ imageUri, onImageSelected }) => {
  const { t } = useTranslation();

  const handleCamera = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.5, // Image compression to save mobile data
      maxWidth: 800,
      maxHeight: 800,
    });
    
    if (result.assets && result.assets.length > 0) {
      onImageSelected(result.assets[0]);
    }
  };

  const handleGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.5, // Image compression
      maxWidth: 800,
      maxHeight: 800,
    });

    if (result.assets && result.assets.length > 0) {
      onImageSelected(result.assets[0]);
    }
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.preview} />
          <TouchableOpacity style={styles.retakeButton} onPress={handleCamera}>
            <Text style={styles.retakeText}>{t('takePhoto')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.actionContainer}>
          <Text style={styles.qualityTips}>{t('qualityTips')}</Text>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={handleCamera}>
              <Text style={styles.buttonText}>📷 {t('takePhoto')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={handleGallery}>
              <Text style={[styles.buttonText, styles.outlineText]}>🖼️ {t('chooseFromGallery')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  actionContainer: {
    padding: 24,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  qualityTips: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 14,
  },
  buttons: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonText: {
    color: colors.background,
    fontWeight: 'bold',
  },
  outlineText: {
    color: colors.primary,
  },
  previewContainer: {
    position: 'relative',
  },
  preview: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  retakeButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  retakeText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ImagePickerComponent;
