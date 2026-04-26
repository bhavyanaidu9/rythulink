import * as Sentry from '@sentry/react-native';
import { Platform } from 'react-native';

export const initSentry = () => {
  Sentry.init({
    dsn: "https://your-dsn@sentry.io/project-id",
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,
    debug: __DEV__,
    environment: __DEV__ ? 'development' : 'production',
    beforeSend(event) {
      // Don't send errors in development unless explicitly needed
      if (__DEV__ && !event.exception) return null;
      return event;
    },
  });
};

export const captureError = (error, context = {}) => {
  Sentry.withScope((scope) => {
    Object.keys(context).forEach((key) => {
      scope.setExtra(key, context[key]);
    });
    Sentry.captureException(error);
  });
};

export const setUserContext = (user) => {
  if (user) {
    Sentry.setUser({
      id: user.id,
      username: user.name,
      email: user.phone_number,
      ip_address: "{{auto}}",
    });
  } else {
    Sentry.setUser(null);
  }
};
