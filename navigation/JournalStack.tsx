import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import JournalHomeScreen from '@/screens/journal/JournalHomeScreen';
import JournalDetailScreen from '@/screens/journal/JournalDetailScreen';

const Stack = createNativeStackNavigator();

const JournalStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // No header - handled by screens themselves
      }}
    >
      <Stack.Screen
        name="JournalHomeScreen"
        component={JournalHomeScreen}
      />
      <Stack.Screen
        name="JournalDetailScreen"
        component={JournalDetailScreen}
      />
    </Stack.Navigator>
  );
};

export default JournalStack;
