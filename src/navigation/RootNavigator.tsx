import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import {RootState} from '../store';

import {LoginScreen} from '../screens/LoginScreen';
import {OTPScreen} from '../screens/OTPScreen';
import {ProfileSetupScreen} from '../screens/ProfileSetupScreen';
import {DashboardScreen} from '../screens/DashboardScreen';
import {MyProductsScreen} from '../screens/MyProductsScreen';
import {AddProductScreen} from '../screens/AddProductScreen';
import {OrdersScreen} from '../screens/OrdersScreen';
import {PricesScreen} from '../screens/PricesScreen';
import {ProfileScreen} from '../screens/ProfileScreen';

export type RootStackParamList = {
  Login: undefined;
  OTP: {phoneNumber: string};
  ProfileSetup: undefined;
  Main: undefined;
  AddProduct: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  MyProducts: undefined;
  Orders: undefined;
  Prices: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="MyProducts" component={MyProductsScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Prices" component={PricesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const profileComplete = useSelector((state: RootState) => state.auth.profileComplete);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!token ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="OTP" component={OTPScreen} />
          </>
        ) : !profileComplete ? (
          <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="AddProduct" component={AddProductScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
