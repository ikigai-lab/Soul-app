import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Icon from '@/components/ui/Icon';
import { theme } from '@/utils/theme';

type MessageRole = 'user' | 'assistant';

interface AIChatBubbleProps {
  message: string;
  role: MessageRole;
  timestamp: Date;
  sentiment?: {
    type: 'positive' | 'neutral' | 'negative' | 'anxious' | 'calm';
    score?: number;
  };
  onCopy?: () => void;
  onRegenerate?: () => void;
  isTyping?: boolean;
}

const AnimatedView = Animated.View;

const AIChatBubble: React.FC<AIChatBubbleProps> = ({
  message,
  role,
  timestamp,
  sentiment,
  onCopy,
  onRegenerate,
  isTyping = false,
}) => {
  const isUser = role === 'user';

  if (isTyping) {
    return (
      <AnimatedView
        entering={FadeIn.duration(300)}
        style={[styles.container, styles.otherContainer]}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.aiAvatar}>
            <Icon name="Bot" color="#000000" size={20} strokeWidth={2} />
          </View>
        </View>
        <View style={[styles.bubble, styles.aiBubble]}>
          <Text style={styles.typingText}>Soul AI is typing...</Text>
        </View>
      </AnimatedView>
    );
  }

  return (
    <AnimatedView
      entering={FadeIn.duration(300)}
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.otherContainer,
      ]}
    >
      {!isUser && (
        <View style={styles.avatarContainer}>
          <View style={styles.aiAvatar}>
            <Icon name="Bot" color="#000000" size={20} strokeWidth={2} />
          </View>
        </View>
      )}

      <View style={styles.bubbleWrapper}>
        <Text style={styles.senderName}>
          {isUser ? 'You' : 'Soul AI'}
        </Text>
        <View
          style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.aiBubble,
          ]}
        >
          <Text
            style={[
              styles.message,
              isUser ? styles.userMessage : styles.aiMessage,
            ]}
          >
            {message}
          </Text>
        </View>
      </View>

      {isUser && (
        <View style={styles.avatarContainer}>
          <View style={styles.userAvatar}>
            <Icon name="User" color="#FFFFFF" size={20} strokeWidth={2} />
          </View>
        </View>
      )}
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
    gap: 12,
    paddingHorizontal: 16,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  otherContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 32,
    height: 32,
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0', // Light grey
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50', // Green
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleWrapper: {
    maxWidth: '75%',
    gap: 4,
  },
  senderName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '400',
    paddingHorizontal: 4,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#2D3748', // Darker grey
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 16,
  },
  aiBubble: {
    backgroundColor: '#E0E0E0', // Light grey
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 16,
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
  userMessage: {
    color: '#FFFFFF',
  },
  aiMessage: {
    color: '#000000', // Dark text on light grey
  },
  typingText: {
    fontSize: 16,
    color: '#000000',
    fontStyle: 'italic',
  },
});

export default AIChatBubble;
