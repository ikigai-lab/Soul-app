import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Icon from '@/components/ui/Icon';
import { theme } from '@/utils/theme';

type MessageRole = 'user' | 'other';

interface MessageBubbleProps {
  message: string;
  role: MessageRole;
  timestamp: Date;
  userName?: string;
  userAvatar?: string;
  onCopy?: () => void;
  mediaUri?: string;
}

const AnimatedView = Animated.View;

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  role,
  timestamp,
  userName,
  userAvatar,
  onCopy,
  mediaUri,
}) => {
  const isUser = role === 'user';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleCopy = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCopy?.();
  };

  return (
    <AnimatedView
      entering={FadeIn.duration(300)}
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.otherContainer,
      ]}
    >
      {/* Profile Picture */}
      {!isUser && (
        <Image
          source={{ uri: userAvatar || 'https://i.pravatar.cc/150?img=5' }}
          style={styles.profilePicture}
        />
      )}

      <View style={styles.bubbleWrapper}>
        {/* Sender Name */}
        {userName && (
          <Text style={styles.senderName}>
            {userName}
          </Text>
        )}

        <View
          style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.otherBubble,
          ]}
        >
          {/* Media */}
          {mediaUri && (
            <View style={styles.mediaContainer}>
              <Image
                source={{ uri: mediaUri }}
                style={styles.mediaImage}
                resizeMode="cover"
              />
            </View>
          )}

          {/* Message Text */}
          {message && (
            <Text
              style={[
                styles.message,
                isUser ? styles.userMessage : styles.otherMessage,
              ]}
            >
              {message}
            </Text>
          )}
        </View>

        {/* Timestamp */}
        <Text
          style={[
            styles.timestamp,
            isUser ? styles.userTimestamp : styles.otherTimestamp,
          ]}
        >
          {formatTime(timestamp)}
        </Text>
      </View>

      {/* User Profile Picture */}
      {isUser && (
        <Image
          source={{ uri: userAvatar || 'https://i.pravatar.cc/150?img=6' }}
          style={styles.profilePicture}
        />
      )}
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
    gap: 8,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  otherContainer: {
    justifyContent: 'flex-start',
  },
  profilePicture: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    paddingVertical: 10,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#68D391', // Light green
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 4, // Less rounded on bottom-right (tail)
    borderBottomLeftRadius: 16,
  },
  otherBubble: {
    backgroundColor: '#2D3748', // Dark grey
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 4, // Less rounded on bottom-left (tail)
    borderBottomRightRadius: 16,
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
  userMessage: {
    color: '#1A201E', // Dark text on light green
  },
  otherMessage: {
    color: '#FFFFFF', // White text on dark grey
  },
  mediaContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  mediaImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    maxWidth: 250,
  },
  timestamp: {
    fontSize: 12,
    fontWeight: '400',
    paddingHorizontal: 4,
  },
  userTimestamp: {
    color: '#A0AEC0', // Light grey
    textAlign: 'right',
  },
  otherTimestamp: {
    color: '#A0AEC0', // Light grey
    textAlign: 'left',
  },
});

export default MessageBubble;
