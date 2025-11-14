import React , { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Text,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Icon from '@/components/ui/Icon';
import { theme } from '@/utils/theme';

interface ChatConnection {
  id: string;
  userName: string;
  lastMessage?: string;
  timestamp: Date;
  timeLeft?: string; // For day chats: "18h left", "12h left", etc.
  unreadCount?: number;
}

interface ChatSidebarProps {
  connections: ChatConnection[];
  dayChats: ChatConnection[];
  activeChatId?: string;
  onChatPress: (chat: ChatConnection) => void;
  onClose?: () => void;
}


const AnimatedView = Animated.View;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  connections,
  dayChats,
  activeChatId,
  onChatPress,
  onClose,
}) => {
  const handleChatPress = (chat: ChatConnection) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChatPress(chat);
  };

  const [expandedSections, setExpandedSections] = useState({
  connections: true,
  dayChats: true,
});


  return (
    <View style={styles.container}>
      {/* Close Button */}
      <View style={styles.closeButtonContainer}>
        <Pressable
          onPress={onClose}
          style={({ pressed }) => [
            styles.closeButton,
            pressed && styles.closeButtonPressed,
          ]}
        >
          <Icon name="X" color="#FFFFFF" size={24} strokeWidth={2} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* CONNECTIONS Section */}
<View style={styles.section}>
  <Pressable
    onPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setExpandedSections(prev => ({ ...prev, connections: !prev.connections }));
    }}
    style={styles.sectionHeaderContainer}
  >
    <Text style={styles.sectionHeader}>CONNECTIONS</Text>
  </Pressable>
  
  {expandedSections.connections && (
    <View style={styles.sectionContent}>
      {connections.length > 0 ? (
        connections.map((chat, index) => (
          <AnimatedView key={chat.id} entering={FadeInDown.delay(index * 50).duration(300)}>
            <Pressable onPress={() => handleChatPress(chat)} style={({ pressed }) => [styles.chatItem, pressed && styles.chatItemPressed]}>
  <View style={styles.chatRow}>
    <View style={styles.statusDot} />
    <Text style={styles.chatName}>{chat.userName}</Text>
  </View>
</Pressable>
          </AnimatedView>
        ))
      ) : (
        <Text style={styles.emptyText}>No connections</Text>
      )}
    </View>
  )}
</View>


        {/* DAY CHAT Section */}
<View style={styles.section}>
  <Pressable
    onPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setExpandedSections(prev => ({ ...prev, dayChats: !prev.dayChats }));
    }}
    style={styles.sectionHeaderContainer}
  >
    <Text style={styles.sectionHeader}>DAY CHAT</Text>
  </Pressable>
  
  {expandedSections.dayChats && (
    <View style={styles.sectionContent}>
      {dayChats.length > 0 ? (
        dayChats.map((chat, index) => (
          <AnimatedView key={chat.id} entering={FadeInDown.delay(index * 50).duration(300)}>
           <Pressable onPress={() => handleChatPress(chat)} style={({ pressed }) => [styles.chatItem, pressed && styles.chatItemPressed]}>
  <View style={styles.chatRow}>
    <Icon name="Clock" color="#FFA500" size={20} strokeWidth={2} />
    <Text style={styles.chatName}>{chat.userName}</Text>
    {chat.timeLeft && <Text style={styles.timeLeft}>{chat.timeLeft}</Text>}
  </View>
</Pressable>

          </AnimatedView>
        ))
      ) : (
        <Text style={styles.emptyText}>No day chats</Text>
      )}
    </View>
  )}
</View>


        {/* Placeholder Section */}
        

          <View style={styles.sectionContent}>
            <Text style={styles.placeholderText}>
              Your daily chats and connections will appear here once they've created.
            </Text>
          </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280, // Fixed width for sidebar
    backgroundColor: theme.colors.bg.drawer,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border.default,
    ...theme.shadows.drawer,
  },
  closeButtonContainer: {
    paddingTop: 20,
    paddingRight: 20,
    alignItems: 'flex-end',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  closeButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    color: '#A9A9A9', // Light grey
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  sectionHeaderContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 8,
},
  sectionContent: {
    gap: 0,
  },
  chatItem: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  flex: 1,
  },
  chatRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  flex: 1,
},
  chatItemPressed: {
    opacity: 0.7,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00FF00', // Bright green
  },
chatName: {
  flex: 1,
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: '400',
},
timeLeft: {
  color: '#FFA500',
  fontSize: 14,
  fontWeight: '400',
  marginLeft: 8,
},

  emptyText: {
    color: '#808080',
    fontSize: 14,
    fontStyle: 'italic',
    paddingVertical: 16,
  },
  placeholderText: {
    color: '#808080',
    fontSize: 14,
    fontStyle: 'italic',
    paddingVertical: 16,
    lineHeight: 20,
  },
});

export default ChatSidebar;
