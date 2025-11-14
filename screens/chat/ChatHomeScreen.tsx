import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Icon from '@/components/ui/Icon';
import ChatSidebar from '@/components/chat/ChatSidebar';
import { theme } from '@/utils/theme';

interface ChatConnection {
  id: string;
  userName: string;
  lastMessage?: string;
  timestamp: Date;
  timeLeft?: string; // For day chats: "18h left", "12h left", etc.
  unreadCount?: number;
}

const AnimatedView = Animated.View;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Mock data
const MOCK_CONNECTIONS: ChatConnection[] = [
  {
    id: '1',
    userName: 'Alex',
    timestamp: new Date(Date.now() - 300000),
    unreadCount: 0,
  },
  {
    id: '2',
    userName: 'Jordan',
    timestamp: new Date(Date.now() - 3600000),
    unreadCount: 2,
  },
];

const MOCK_DAYCHATS: ChatConnection[] = [
  {
    id: 'd1',
    userName: 'Anonymous User',
    timestamp: new Date(Date.now() - 1800000),
    timeLeft: '18h left',
    unreadCount: 1,
  },
];




const ChatHomeScreen: React.FC = () => {
  const [activeChatId, setActiveChatId] = useState<string | undefined>();
  const [connections, setConnections] = useState(MOCK_CONNECTIONS);
  const [dayChats, setDayChats] = useState(MOCK_DAYCHATS);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useFocusEffect(
    useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, [])
  );

  const handleChatPress = (chat: ChatConnection) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveChatId(chat.id);
    // TODO: Navigate to ChatScreen with chat ID
    console.log('Chat pressed:', chat.id);
  };

  const handleNewChat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Navigate to create new connection flow
    console.log('New chat');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
 {/* Header */}
<AnimatedView
  entering={FadeIn.duration(300)}
  style={styles.header}
>
  <View style={styles.headerContent}>
    {/* Menu button - only show when sidebar is hidden */}
    {!isSidebarVisible && (
      <Pressable onPress={() => setIsSidebarVisible(true)} style={styles.menuButton}>
        <Icon name="Menu" color="#FFFFFF" size={24} strokeWidth={2.5} />
      </Pressable>
    )}
    
  
    
    {/* Plus button on the right */}
    <AnimatedPressable
      onPress={handleNewChat}
      style={({ pressed }) => [
        styles.newChatButton,
        pressed && styles.newChatButtonPressed,
      ]}
    >
      <Icon name="Plus" color="#FFFFFF" size={20} strokeWidth={2.5} />
    </AnimatedPressable>
  </View>
</AnimatedView>


        {/* Chat List - Sidebar on left, content on right */}

<View style={styles.content}>
  {isSidebarVisible && (
    <ChatSidebar
      connections={connections}
      dayChats={dayChats}
      activeChatId={activeChatId}
      onChatPress={handleChatPress}
      onClose={() => setIsSidebarVisible(false)}  // Add this
    />
  )}
  {/* Main chat area - placeholder for now */}
<View style={styles.chatArea}>
  <Text style={styles.placeholderText}>
    Select a conversation to start chatting
  </Text>
</View>

</View>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuButton: {
  width: 30,
  height: 30,
  marginTop: 4,
  borderRadius: 22,
  justifyContent: 'center',
  alignItems: 'center',
},
headerTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: -0.5,
  },
  newChatButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.interactive.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newChatButtonPressed: {
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  chatArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.bg.primary,
  },
  placeholderText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.base,
    fontStyle: 'italic',
  },
});

export default ChatHomeScreen;
