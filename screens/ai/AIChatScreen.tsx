import React, { useState, useRef, useCallback } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  Text,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import AIChatBubble from '@/components/ai/AIChatBubble';
import ChatInput from '@/components/chat/ChatInput';
import Icon from '@/components/ui/Icon';
import { theme } from '@/utils/theme';

interface Message {
  id: string;
  message: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  sentiment?: {
    type: 'positive' | 'neutral' | 'negative' | 'anxious' | 'calm';
    score?: number;
  };
}

const SUGGESTIONS = [
  "How are you feeling?",
  "I need support",
  "Let's talk",
];

const AnimatedView = Animated.View;

const AIChatScreen: React.FC = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      message: 'How are you feeling?',
      role: 'user',
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: '2',
      message: "I'm here for you. Thank you for sharing. Your well-being matters, and taking this step shows real strength. How can I support you right now?",
      role: 'assistant',
      timestamp: new Date(Date.now() - 240000),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const getAIResponse = async (userMessage: string): Promise<Message> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const lowerMessage = userMessage.toLowerCase();
    let sentiment: Message['sentiment'] = { type: 'neutral', score: 70 };

    if (lowerMessage.includes('anxious') || lowerMessage.includes('stress')) {
      sentiment = { type: 'anxious', score: 72 };
    } else if (lowerMessage.includes('happy') || lowerMessage.includes('good')) {
      sentiment = { type: 'positive', score: 85 };
    } else if (lowerMessage.includes('sad') || lowerMessage.includes('alone')) {
      sentiment = { type: 'negative', score: 58 };
    } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      sentiment = { type: 'calm', score: 78 };
    }

    const responses = {
      anxious: "I understand anxiety can be overwhelming. Let's practice a grounding technique: notice 5 things you can see, 4 you can hear, 3 you can touch, 2 you can smell, and 1 you can taste. You're doing great by reaching out. 💙",
      positive: "That's wonderful to hear! It's beautiful that you're recognizing these positive moments. Keep nurturing this good feeling and celebrate the small wins! 😊",
      negative: "I hear you, and your feelings are completely valid. It's okay to struggle sometimes. Would you like to explore what's weighing on you? I'm here to listen.",
      default: "I'm here for you. Thank you for sharing. Your well-being matters, and taking this step shows real strength. How can I support you right now?",
    };

    const responseKey = sentiment.type as keyof typeof responses;
    const responseMessage = responses[responseKey] || responses.default;

    return {
      id: Date.now().toString(),
      message: responseMessage,
      role: 'assistant',
      timestamp: new Date(),
      sentiment,
    };
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMessage: Message = {
      id: Date.now().toString(),
      message: text,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    setIsTyping(true);

    const aiResponse = await getAIResponse(text);
    setIsTyping(false);
    setMessages((prev) => [...prev, aiResponse]);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSuggestionPress = (suggestion: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleSend(suggestion);
  };

  const renderMessage = useCallback(
    ({ item, index }: { item: Message; index: number }) => (
      <Animated.View entering={FadeIn.delay(index * 50).duration(300)}>
        <AIChatBubble
          message={item.message}
          role={item.role}
          timestamp={item.timestamp}
          sentiment={item.sentiment}
          onCopy={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            console.log('Copied:', item.message);
          }}
          onRegenerate={
            item.role === 'assistant' 
              ? () => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  console.log('Regenerate');
                }
              : undefined
          }
        />
      </Animated.View>
    ),
    []
  );

  const keyExtractor = useCallback((item: Message) => item.id, []);

  const EmptyState = () => (
    <Animated.View 
      entering={FadeInDown.duration(400)}
      style={styles.emptyState}
    >
      <Text style={styles.emptyTitle}>Soul AI</Text>
      <Text style={styles.emptySubtitle}>
        Your private, supportive AI companion. How are you feeling today?
      </Text>

      {/* Privacy Statement */}
      <Text style={styles.privacyText}>
        Your conversations are private and encrypted.
      </Text>

      {/* Suggestions */}
      <View style={styles.suggestions}>
        {SUGGESTIONS.map((suggestion, index) => (
          <Animated.View
            key={index}
            entering={FadeInDown.delay(100 + index * 100).duration(300)}
          >
            <Pressable
              onPress={() => handleSuggestionPress(suggestion)}
              style={({ pressed }) => [
                styles.suggestionButton,
                pressed && styles.suggestionButtonPressed,
              ]}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Chat-specific header - only this header, no extra spacing */}
      <View style={styles.chatHeader}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }}
          hitSlop={12}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
        >
          <Icon
            name="ArrowLeft"
            color="#FFFFFF"
            size={24}
            strokeWidth={2}
          />
        </Pressable>
        <Text style={styles.headerTitle}>Soul AI</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            messages.length === 0 && !isTyping ? <EmptyState /> : null
          }
          ListFooterComponent={
            isTyping ? (
              <AIChatBubble
                message=""
                role="assistant"
                timestamp={new Date()}
                isTyping={true}
              />
            ) : null
          }
        />

        <ChatInput
          onSend={handleSend}
          placeholder="Type your message..."
          showMediaButton={false}
          showVoiceButton={false}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.bg.primary,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
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
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: '#A0AEC0',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  privacyText: {
    color: '#A0AEC0',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  suggestions: {
    width: '100%',
    gap: 16,
  },
  suggestionButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    alignItems: 'center',
  },
  suggestionButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  suggestionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
  },
});

export default AIChatScreen;
