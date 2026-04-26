import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotificationsAsync = async () => {
  let token;
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2E7D32',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return;
  }
  
  token = (await Notifications.getExpoPushTokenAsync()).data;
  
  // In a real app, send this token to your backend via API
  // await api.post('/users/push-token', { token });
  
  return token;
};

// Hook or listener for foreground/background notifications
export const setupNotificationListeners = (navigationRef) => {
  // Listener for foreground notifications
  const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
    // Optionally trigger a local state refresh
    console.log('Received notification in foreground:', notification);
  });

  // Listener for user tapping on notification
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
    const data = response.notification.request.content.data;
    if (data && data.orderId) {
      // Deep link to specific order
      if (navigationRef.isReady()) {
        navigationRef.navigate('OrderDetail', { orderId: data.orderId });
      }
    }
  });

  return { foregroundSubscription, responseSubscription };
};
