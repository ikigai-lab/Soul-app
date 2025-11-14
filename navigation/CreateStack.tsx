import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreatePostScreen from '@/screens/create/CreatePostScreen';
import CreateCommunityScreen from '@/screens/create/CreateCommunityScreen';
import UploadMediaScreen from '@/screens/create/UploadMediaScreen';
import { theme } from '@/utils/theme';

const Stack = createNativeStackNavigator();

const CreateStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen name="CreatePostScreen" component={CreatePostScreen} />
      <Stack.Screen name="CreateCommunityScreen" component={CreateCommunityScreen} />
      <Stack.Screen name="UploadMediaScreen" component={UploadMediaScreen} />
    </Stack.Navigator>
  );
};

export default CreateStack;
