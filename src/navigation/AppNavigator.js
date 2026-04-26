import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import SplashScreen from '../screens/SplashScreen';
import LanguageSelectionScreen from '../screens/LanguageSelectionScreen';
import PhoneInputScreen from '../screens/PhoneInputScreen';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import HomeScreen from '../screens/HomeScreen';
import MyListingsScreen from '../screens/MyListingsScreen';
import CreateListingScreen from '../screens/CreateListingScreen';
import ListingDetailScreen from '../screens/ListingDetailScreen';
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import { colors } from '../theme/colors';
import { setupNotificationListeners } from '../services/notifications';
import * as Linking from 'expo-linking';

const Stack = createNativeStackNavigator();

// Define deep linking config
const linking = {
  prefixes: [Linking.createURL('/'), 'rythulink://'],
  config: {
    screens: {
      Home: 'home',
      OrderDetail: 'orders/:orderId',
    },
  },
};

const AppNavigator = () => {
  const { userToken, user, isLoading } = useAuth();
  const navigationRef = React.useRef();

  React.useEffect(() => {
    // Start listening for Expo push notifications
    let subs;
    if (navigationRef.current) {
      subs = setupNotificationListeners(navigationRef.current);
    }
    return () => {
      if (subs) {
        subs.foregroundSubscription.remove();
        subs.responseSubscription.remove();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#FFF',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        {userToken == null ? (
          // No token found, user isn't signed in
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
            <Stack.Screen name="PhoneInput" component={PhoneInputScreen} />
            <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
          </>
        ) : (
          // User is signed in
          <>
            {(!user || !user.name) ? (
              // User has token but incomplete profile
              <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
            ) : (
              // Fully authenticated app flow
              <>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="MyListings" component={MyListingsScreen} options={{ headerShown: true, title: 'My Listings' }} />
                <Stack.Screen name="CreateListing" component={CreateListingScreen} options={{ headerShown: true, title: 'Add Listing' }} />
                <Stack.Screen name="ListingDetail" component={ListingDetailScreen} options={{ headerShown: true, title: 'Listing Details' }} />
                <Stack.Screen name="Orders" component={OrdersScreen} options={{ headerShown: true, title: 'My Orders' }} />
                <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ headerShown: true, title: 'Order Details' }} />
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
