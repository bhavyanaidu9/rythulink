import { Platform } from 'react-native';

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 34,
    color: '#212121',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 30,
    color: '#212121',
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
    color: '#212121',
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 22,
    color: '#212121',
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: 20,
    color: '#757575',
  },
  telugu: {
    fontFamily: Platform.select({ android: 'NotoSansTelugu-Regular' }),
  }
};
