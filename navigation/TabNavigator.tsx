import React, { useState } from 'react';
import { View, Pressable, StyleSheet, Platform, Text, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import HomeStack from './HomeStack';
import CommunityStack from './CommunityStack';
import AIChatStack from './AIChatStack';
import SettingsMenu from '../components/modals/SettingsMenu';
import Icon from '../components/ui/Icon';
import { theme } from '../utils/theme';
import { useSidebar } from '../contexts/SidebarContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Tab = createBottomTabNavigator();
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.View;

// --- Custom Header Component matching screenshot
const CustomHeader = () => {
  const navigation = useNavigation();
  const [showSettings, setShowSettings] = useState(false);
  const { toggleSidebar } = useSidebar();
  const [currentTab, setCurrentTab] = useState('AITab');

  // Listen to navigation state to detect current tab
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('state', (e: any) => {
      const state = e.data?.state;
      if (state && state.routes && state.index !== undefined) {
        const route = state.routes[state.index];
        if (route && route.state && route.state.routes && route.state.index !== undefined) {
          const tabRoute = route.state.routes[route.state.index];
          if (tabRoute && tabRoute.name) {
            setCurrentTab(tabRoute.name);
          }
        }
      }
    });
    return unsubscribe;
  }, [navigation]);

  const handleMenuPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Only toggle sidebar if on Community tab
    if (currentTab === 'CommunityTab' || currentTab === 'CommunityHomeScreen') {
      toggleSidebar();
    } else {
      // For other tabs, could open different menus
      console.log('Menu pressed on', currentTab);
    }
  };

  const handleSearchPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('SearchScreen' as never);
  };

  const handleBookmarkPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('JournalStack' as never);
  };

  const handleChatPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('ChatStack' as never);
  };

  return (
    <>
      <SafeAreaView edges={['top']} style={styles.safeAreaTop}>
        {/* Light grey header bar */}
        <View style={styles.headerBar}>
          {/* Left Side - Menu & Search */}
          <View style={styles.headerLeft}>
            <Pressable
              onPress={handleMenuPress}
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.iconButtonPressed,
              ]}
            >
              <Icon
                name="Menu"
                color="#000000"
                size={24}
                strokeWidth={2}
              />
            </Pressable>

            <Pressable
              onPress={handleSearchPress}
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.iconButtonPressed,
              ]}
            >
              <Icon
                name="Search"
                color="#000000"
                size={24}
                strokeWidth={2}
              />
            </Pressable>
          </View>

          {/* Right Side - Bookmark & Chat */}
          <View style={styles.headerRight}>
            <Pressable
              onPress={handleBookmarkPress}
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.iconButtonPressed,
              ]}
            >
              <Icon
                name="BookOpen"
                color="#000000"
                size={24}
                strokeWidth={2}
              />
            </Pressable>

            <Pressable
              onPress={handleChatPress}
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.iconButtonPressed,
              ]}
            >
              <Icon
                name="MessageSquare"
                color="#000000"
                size={24}
                strokeWidth={2}
              />
            </Pressable>
          </View>
        </View>

        {/* AI Companion Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>AI Companion</Text>
        </View>
      </SafeAreaView>

      {/* Settings Menu Modal */}
      <SettingsMenu
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
};

// --- Tab Icon Component
const TabIcon = ({ name, focused, routeName }: { name: string; focused: boolean; routeName: string }) => {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = focused
      ? withSpring(1.1, { damping: 10 })
      : withSpring(1, { damping: 10 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const color = focused ? theme.colors.primary.purple : theme.colors.text.secondary;

  return (
    <AnimatedView style={animatedStyle}>
      <Icon name={name} color={color} size={24} strokeWidth={focused ? 2 : 1.5} />
    </AnimatedView>
  );
};



// --- Main Tab Navigator Component
const TabNavigator = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('AITab');

  const handleSettingsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowSettings(true);
  };

  return (
    <>
      <View style={styles.container}>
        <CustomHeader />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false, // No default headers
            tabBarActiveTintColor: theme.colors.primary.purple,
            tabBarInactiveTintColor: theme.colors.text.secondary,
            tabBarStyle: {
              backgroundColor: theme.colors.bg.navBar,
              borderTopWidth: 0,
              height: Platform.OS === 'ios' ? 88 : 72,
              paddingBottom: Platform.OS === 'ios' ? 28 : 10,
              paddingTop: 10,
              paddingHorizontal: 8,
              elevation: 0,
            },
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: '500',
              marginTop: 4,
            },
            tabBarIcon: ({ focused }) => {
              let iconName: string;

              switch (route.name) {
                case 'HomeTab':
                  iconName = 'HouseHeart';
                  break;
                case 'CommunityTab':
                  iconName = 'Users';
                  break;
                case 'CreateTab':
                  iconName = 'Plus';
                  break;
                case 'AITab':
                  iconName = 'Bot';
                  break;
                case 'SettingsTab':
                  iconName = 'Settings';
                  break;
                default:
                  iconName = 'HouseHeart';
              }

              return <TabIcon name={iconName} focused={focused} routeName={route.name} />;
            },
          })}
          screenListeners={{
            state: (e: any) => {
              const state = e.data?.state;
              if (state) {
                const route = state.routes[state.index];
                setActiveTab(route.name);
              }
            },
          }}
        >
          <Tab.Screen
            name="HomeTab"
            component={HomeStack}
            options={{ title: 'Home', tabBarLabel: 'Home' }}
          />

          <Tab.Screen
            name="CommunityTab"
            component={CommunityStack}
            options={{ title: 'Community', tabBarLabel: 'Community' }}
          />

          <Tab.Screen
            name="CreateTab"
            component={HomeStack}
            options={{
              title: 'Create',
              tabBarLabel: 'Create',
            }}
            listeners={{
              tabPress: (e) => {
                e.preventDefault();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                // navigation.navigate('CreateModal' as never);
              },
            }}
          />

          <Tab.Screen
            name="AITab"
            component={AIChatStack}
            options={{ title: 'AI', tabBarLabel: 'AI' }}
          />

          <Tab.Screen
            name="SettingsTab"
            component={HomeStack}
            options={{ title: 'Settings', tabBarLabel: 'Settings' }}
            listeners={{
              tabPress: (e) => {
                e.preventDefault();
                handleSettingsPress();
              },
            }}
          />
        </Tab.Navigator>

      
      </View>

      {/* Settings Menu Modal */}
      <SettingsMenu
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
  safeAreaTop: {
    backgroundColor: theme.colors.bg.header,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 0,
    backgroundColor: theme.colors.bg.header, // Light grey
    minHeight: 48,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  iconButtonPressed: {
    backgroundColor: 'rgba(21, 4, 4, 0.1)',
  },
  titleContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: theme.colors.bg.primary,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 88 : 72,
    height: 8,
    width: 90,
    alignItems: 'center',
    pointerEvents: 'none',
  },
});

export default TabNavigator;
