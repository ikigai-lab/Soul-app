import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CommunityHomeScreen from '@/screens/community/CommunityHomeScreen';
import CommunityDetailScreen from '@/screens/community/CommunityDetailScreen';
import type { CommunityStackParamList } from '@/types/navigation.types';

const Stack = createNativeStackNavigator<CommunityStackParamList>();

const CommunityStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // No header - handled by TabNavigator
      }}
    >
      <Stack.Screen
        name="CommunityHomeScreen"
        component={CommunityHomeScreen}
      />
      <Stack.Screen
        name="CommunityDetailScreen"
        component={CommunityDetailScreen}
      />
    </Stack.Navigator>
  );
};

export default CommunityStack;
