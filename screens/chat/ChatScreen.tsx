import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Icon from '@/components/ui/Icon';
import MessageBubble from '@/components/chat/MessageBubble';
import ChatInput from '@/components/chat/ChatInput';
import { theme } from '@/utils/theme';

interface Message {
  id: string;
  message: string;
  role: 'user' | 'other';
  timestamp: Date;
  mediaUri?: string;
}

const AnimatedView = Animated.View;

const ChatScreen: React.FC<{ route: any }> = ({ route }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      message: 'Hey! How are you doing?',
      role: 'other',
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: '2',
      message: "I'm doing great! Just finished a meditation session.",
      role: 'user',
      timestamp: new Date(Date.now() - 240000),
    },
    {
      id: '3',
      message: 'That sounds wonderful. I should try that too!',
      role: 'other',
      timestamp: new Date(Date.now() - 180000),
    },
    {
      id: '4',
      message: 'Check out this beautiful view from my hike today!',
      role: 'other',
      timestamp: new Date(Date.now() - 120000),
      mediaUri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600',
    },
  ]);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = (message: string, mediaUri?: string) => {
    if (message.trim() || mediaUri) {
      const newMessage: Message = {
        id: Date.now().toString(),
        message,
        role: 'user',
        timestamp: new Date(),
        mediaUri,
      };

      setMessages((prev) => [...prev, newMessage]);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      // Simulate response
      setTimeout(() => {
        const responses = [
          'That sounds interesting!',
          'I totally agree with you.',
          'Tell me more about that.',
          'Sounds good to me!',
        ];
        const randomResponse =
          responses[Math.floor(Math.random() * responses.length)];

        const response: Message = {
          id: (Date.now() + 1).toString(),
          message: randomResponse,
          role: 'other',
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, response]);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, 1000);
    }
  };

  const renderMessage = useCallback(
    ({ item, index }: { item: Message; index: number }) => (
      <Animated.View entering={FadeIn.delay(index * 50).duration(300)}>
        <MessageBubble
          {...item}
          userName={item.role === 'other' ? 'Alex' : 'You'}
          userAvatar={item.role === 'other' ? 'https://i.pravatar.cc/150?img=5' : 'https://i.pravatar.cc/150?img=6'}
          onCopy={() => {
            Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Success
            );
            console.log('Copied:', item.message);
          }}
        />
      </Animated.View>
    ),
    []
  );

  const keyExtractor = useCallback((item: Message) => item.id, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <AnimatedView
          entering={FadeIn.duration(300)}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                // TODO: Navigate back
              }}
              hitSlop={12}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.backButtonPressed,
              ]}
            >
              <Icon
                name="ChevronLeft"
                color="#FFFFFF"
                size={24}
                strokeWidth={2}
              />
            </Pressable>

            <View style={styles.chatHeader}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=5' }}
                style={styles.headerAvatar}
              />
              <Text style={styles.chatName}>Alex</Text>
            </View>

            <Pressable
              hitSlop={12}
              style={({ pressed }) => [
                styles.headerIcon,
                pressed && styles.headerIconPressed,
              ]}
            >
              <Icon
                name="Lock"
                color="#FFFFFF"
                size={24}
                strokeWidth={2}
              />
            </Pressable>
          </View>
        </AnimatedView>

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />

          {/* Input */}
          <ChatInput
            onSend={handleSend}
            placeholder="Type your message..."
            showMediaButton={true}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A201E', // Dark green-grey background
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1A201E',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  backButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  chatHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  chatName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  headerIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  headerIconPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  keyboardView: {
    flex: 1,
  },
  messagesList: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexGrow: 1,
  },
});

export default ChatScreen;
