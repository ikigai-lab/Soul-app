import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeOutLeft } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Button, ButtonText } from '@/components/ui/button';
import Icon from '@/components/ui/Icon';
import { theme } from '@/utils/theme';

interface Request {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  type: 'connection' | 'daychat';
  timestamp: Date;
}

const AnimatedView = Animated.View;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const RequestScreen: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([
    {
      id: '1',
      userId: 'user1',
      userName: 'Sarah Johnson',
      userAvatar: 'https://i.pravatar.cc/150?img=1',
      type: 'connection',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Mike Wilson',
      userAvatar: 'https://i.pravatar.cc/150?img=2',
      type: 'daychat',
      timestamp: new Date(Date.now() - 7200000),
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Emma Davis',
      userAvatar: 'https://i.pravatar.cc/150?img=3',
      type: 'connection',
      timestamp: new Date(Date.now() - 10800000),
    },
  ]);

  const handleAccept = (request: Request) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    console.log('Accepting request:', request);
    setRequests(requests.filter((r) => r.id !== request.id));
  };

  const handleReject = (request: Request) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('Rejecting request:', request);
    setRequests(requests.filter((r) => r.id !== request.id));
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const renderRequest = ({ item, index }: { item: Request; index: number }) => (
    <AnimatedView
      entering={FadeInDown.delay(index * 80).duration(400)}
      exiting={FadeOutLeft.duration(300)}
      style={styles.requestCard}
    >
      {/* User Info */}
      <View style={styles.userSection}>
        <Avatar size="md" style={styles.avatar}>
          {item.userAvatar ? (
            <AvatarImage source={{ uri: item.userAvatar }} />
          ) : (
            <AvatarFallbackText>{item.userName}</AvatarFallbackText>
          )}
        </Avatar>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.userName}</Text>
          <View style={styles.requestMeta}>
            <View
              style={[
                styles.typeBadge,
                item.type === 'connection'
                  ? styles.typeBadgeConnection
                  : styles.typeBadgeDayChat,
              ]}
            >
              <Icon
                name={item.type === 'connection' ? 'UserPlus' : 'Clock'}
                color={
                  item.type === 'connection'
                    ? theme.colors.interactive.primary
                    : theme.colors.interactive.warning
                }
                size={14}
              />
              <Text
                style={[
                  styles.typeText,
                  item.type === 'connection'
                    ? styles.typeTextConnection
                    : styles.typeTextDayChat,
                ]}
              >
                {item.type === 'connection' ? 'Connection' : 'DayChat'}
              </Text>
            </View>
            <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <AnimatedPressable
          onPress={() => handleAccept(item)}
          style={({ pressed }) => [
            styles.acceptButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Icon name="Check" color="#FFFFFF" size={18} />
          <Text style={styles.acceptButtonText}>Accept</Text>
        </AnimatedPressable>

        <AnimatedPressable
          onPress={() => handleReject(item)}
          style={({ pressed }) => [
            styles.rejectButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Icon name="X" color={theme.colors.text.secondary} size={18} />
          <Text style={styles.rejectButtonText}>Reject</Text>
        </AnimatedPressable>
      </View>
    </AnimatedView>
  );

  const renderEmpty = () => (
    <AnimatedView
      entering={FadeInDown.duration(600)}
      style={styles.emptyContainer}
    >
      <View style={styles.emptyIcon}>
        <Icon name="Bell" color={theme.colors.text.tertiary} size={56} />
      </View>
      <Text style={styles.emptyTitle}>No pending requests</Text>
      <Text style={styles.emptySubtitle}>
        Connection and DayChat requests will appear here
      </Text>
    </AnimatedView>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header */}
      <AnimatedView entering={FadeInDown.duration(300)} style={styles.header}>
        <Text style={styles.headerTitle}>Requests</Text>
        {requests.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{requests.length}</Text>
          </View>
        )}
      </AnimatedView>

      {/* Requests List */}
      <FlatList
        data={requests}
        renderItem={renderRequest}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          requests.length === 0 ? styles.emptyList : styles.listContent
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  headerTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: -0.5,
  },
  badge: {
    backgroundColor: theme.colors.interactive.primary,
    borderRadius: theme.borderRadius.full,
    minWidth: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  requestCard: {
    backgroundColor: theme.colors.bg.secondary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userInfo: {
    flex: 1,
    gap: 6,
  },
  userName: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 0.2,
  },
  requestMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
  },
  typeBadgeConnection: {
    backgroundColor: `rgba(20, 184, 166, 0.15)`,
  },
  typeBadgeDayChat: {
    backgroundColor: `rgba(251, 191, 36, 0.15)`,
  },
  typeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    letterSpacing: 0.3,
  },
  typeTextConnection: {
    color: theme.colors.interactive.primary,
  },
  typeTextDayChat: {
    color: theme.colors.interactive.warning,
  },
  timestamp: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.interactive.success,
    borderRadius: theme.borderRadius.lg,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.bg.tertiary,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  rejectButtonText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  emptyIcon: {
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  emptySubtitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default RequestScreen;
