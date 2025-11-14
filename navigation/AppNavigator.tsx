import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import CreateStack from './CreateStack';
import ChatStack from './ChatStack';
import JournalStack from './JournalStack';
import SearchScreen from '../screens/search/SearchScreen';
import RequestScreen from '../screens/settings/RequestScreen';

const RootStack = createNativeStackNavigator();

const AppNavigator = () => {
  const isAuthenticated = true;

  // ✅ Custom theme with proper font configuration
  const CustomTheme = {
    ...DefaultTheme,
    dark: true,
    colors: {
      ...DefaultTheme.colors,
      primary: '#3B82F6',
      background: '#000000',
      card: '#1A1A1A',
      text: '#FFFFFF',
      border: '#333333',
      notification: '#EF4444',
    },
    fonts: {
      regular: {
        fontFamily: 'System',
        fontWeight: '400' as const,
      },
      medium: {
        fontFamily: 'System',
        fontWeight: '500' as const,
      },
      bold: {
        fontFamily: 'System',
        fontWeight: '700' as const,
      },
      heavy: {
        fontFamily: 'System',
        fontWeight: '900' as const,
      },
    },
  };

  return (
    <NavigationContainer theme={CustomTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            <RootStack.Screen name="Main" component={TabNavigator}/>
            <RootStack.Screen name="CreateModal" component={CreateStack}/>
            <RootStack.Screen name="SearchScreen" component={SearchScreen}/>
            <RootStack.Screen name="ChatStack" component={ChatStack}/>
            <RootStack.Screen name="JournalStack" component={JournalStack}/>
            <RootStack.Screen name="RequestScreen" component={RequestScreen}/>
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
