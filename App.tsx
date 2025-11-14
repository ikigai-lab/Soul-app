import './global.css';
import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GluestackUIProvider } from './components/ui/gluestack-ui-provider';
import { SidebarProvider } from './contexts/SidebarContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <GluestackUIProvider mode="dark">
      <SidebarProvider>
        <StatusBar style="light" backgroundColor="#000000" />
        <AppNavigator />
      </SidebarProvider>
    </GluestackUIProvider>
  );
}
