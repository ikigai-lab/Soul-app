import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatHomeScreen from '@/screens/chat/ChatHomeScreen';
import ChatScreen from '@/screens/chat/ChatScreen';
import type { ChatStackParamList } from '@/types/navigation.types';

const Stack = createNativeStackNavigator<ChatStackParamList>();

const ChatStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // No header - handled by screens themselves
      }}
    >
      <Stack.Screen
        name="ChatHomeScreen"
        component={ChatHomeScreen}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
      />
    </Stack.Navigator>
  );
};

export default ChatStack;
