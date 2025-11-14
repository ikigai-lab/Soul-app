import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Icon from '@/components/ui/Icon';
import { theme } from '@/utils/theme';

interface ChatListItemProps {
  id: string;
  userName: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount?: number;
  isActive?: boolean;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.View;

const ChatListItem: React.FC<ChatListItemProps> = ({
  userName,
  lastMessage,
  timestamp,
  unreadCount,
  isActive,
  onPress,
}) => {
  const scale = useSharedValue(1);
  const bgOpacity = useSharedValue(isActive ? 1 : 0);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: `rgba(20, 184, 166, ${bgOpacity.value * 0.08})`,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 12 });
    if (!isActive) {
      bgOpacity.value = withTiming(0.5, { duration: 100 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12 });
    if (!isActive) {
      bgOpacity.value = withTiming(0, { duration: 100 });
    }
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <AnimatedView entering={FadeIn.duration(300)}>
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.container,
          isActive && styles.containerActive,
          animatedStyle,
        ]}
      >
        {/* Avatar */}
        <View style={[
          styles.avatar,
          isActive && styles.avatarActive,
        ]}>
          <Text style={styles.avatarText}>
            {userName.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Chat info */}
        <View style={styles.chatInfo}>
          <View style={styles.headerRow}>
            <Text
              style={[
                styles.userName,
                isActive && styles.userNameActive,
              ]}
              numberOfLines={1}
            >
              {userName}
            </Text>
            <Text style={styles.timestamp}>
              {formatTime(timestamp)}
            </Text>
          </View>

          <Text
            style={[
              styles.lastMessage,
            ]}
            numberOfLines={1}
          >
            {lastMessage}
          </Text>
        </View>

        {/* Unread badge */}
        {unreadCount && unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </Text>
          </View>
        )}

        {/* Active indicator */}
        {isActive && (
          <View style={styles.activeIndicator} />
        )}
      </AnimatedPressable>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.md,
  },
  containerActive: {
    backgroundColor: `rgba(20, 184, 166, 0.1)`,
    borderWidth: 1,
    borderColor: `rgba(20, 184, 166, 0.2)`,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.bg.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarActive: {
    backgroundColor: `rgba(20, 184, 166, 0.15)`,
    borderWidth: 1.5,
    borderColor: theme.colors.interactive.primary,
  },
  avatarText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  chatInfo: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    flex: 1,
  },
  userNameActive: {
    color: theme.colors.interactive.primary,
  },
  timestamp: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.xs,
    marginLeft: theme.spacing.md,
  },
  lastMessage: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
  },
  lastMessageUnread: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  unreadBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.interactive.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.interactive.primary,
    marginLeft: theme.spacing.xs,
  },
});

export default ChatListItem;
