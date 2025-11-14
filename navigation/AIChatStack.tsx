import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AIChatScreen from '@/screens/ai/AIChatScreen';

const Stack = createNativeStackNavigator();

const AIChatStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // No header - handled by screen itself
      }}
    >
      <Stack.Screen
        name="AIChatScreen"
        component={AIChatScreen}
      />
    </Stack.Navigator>
  );
};

export default AIChatStack;
