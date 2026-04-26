import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nProvider } from './src/i18n';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <I18nProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </I18nProvider>
    </SafeAreaProvider>
  );
};

export default App;
