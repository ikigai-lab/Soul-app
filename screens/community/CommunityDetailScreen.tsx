import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Pressable,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import PostCard, { Post } from '@/components/post/PostCard';
import { Button, ButtonText } from '@/components/ui/button';
import Icon from '@/components/ui/Icon';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { theme } from '@/utils/theme';

const AnimatedButton = Animated.createAnimatedComponent(Button);
const AnimatedView = Animated.View;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CommunityDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { communityId, communityName } = route.params as {
    communityId: string;
    communityName: string;
  };

  const [isMember, setIsMember] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const buttonScale = useSharedValue(1);

  const posts: Post[] = [
    {
      id: '1',
      content:
        'Welcome to our community! This is a safe space to share your mental health journey. Feel free to be yourself here 💙',
      authorId: 'user1',
      authorName: 'sarah_wellness',
      authorAvatar: 'https://i.pravatar.cc/150?img=1',
      communityId: communityId,
      communityName: communityName,
      createdAt: new Date(Date.now() - 3600000),
      likeCount: 245,
      commentCount: 52,
      shareCount: 13,
      isLiked: false,
      isAnonymous: false,
    },
  ];

  const communityStats = {
    memberCount: 15420,
    postCount: 1234,
    isPrivate: false,
    description: 'A supportive community for mental health discussions',
  };

  const handleJoinToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    buttonScale.value = withSpring(0.95, { damping: 10 }, () => {
      buttonScale.value = withSpring(1, { damping: 10 });
    });
    setIsMember(!isMember);
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const renderPost = ({ item }: { item: Post }) => (
    <PostCard
      post={item}
      showCommunityName={false}
      onUserPress={() => console.log('User pressed')}
      onCommunityPress={() => console.log('Community pressed')}
      onLike={() => console.log('Like')}
      onComment={() => console.log('Comment')}
      onShare={() => console.log('Share')}
      onPostPress={() => console.log('Post pressed')}
    />
  );

  const renderHeader = () => (
    <AnimatedView entering={FadeInDown.duration(600)} style={styles.communityHeader}>
      {/* Back button */}
      <AnimatedPressable
        onPress={() => navigation.goBack()}
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.backButtonPressed,
        ]}
      >
        <Icon
          name="ChevronLeft"
          color={theme.colors.text.primary}
          size={28}
        />
      </AnimatedPressable>

      {/* Community Icon */}
      <View style={styles.communityIconContainer}>
        <Icon
          name={communityStats.isPrivate ? 'Lock' : 'Users'}
          color={theme.colors.interactive.primary}
          size={40}
        />
      </View>

      {/* Community Info */}
      <View style={styles.communityInfo}>
        <Text style={styles.communityName}>c/{communityName}</Text>
        {communityStats.description && (
          <Text style={styles.communityDescription}>
            {communityStats.description}
          </Text>
        )}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon
              name="Users"
              color={theme.colors.interactive.primary}
              size={16}
            />
            <Text style={styles.stat}>
              {formatNumber(communityStats.memberCount)}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Icon
              name="FileText"
              color={theme.colors.interactive.primary}
              size={16}
            />
            <Text style={styles.stat}>
              {formatNumber(communityStats.postCount)}
            </Text>
          </View>
        </View>
      </View>

      {/* Join Button */}
      <AnimatedButton
        action={isMember ? 'secondary' : 'primary'}
        variant={isMember ? 'outline' : 'solid'}
        size="lg"
        onPress={handleJoinToggle}
        style={[styles.joinButton, buttonAnimatedStyle]}
      >
        <Icon
          name={isMember ? 'Check' : 'Plus'}
          color={isMember ? theme.colors.text.primary : '#FFFFFF'}
          size={20}
        />
        <ButtonText>{isMember ? 'Joined' : 'Join'}</ButtonText>
      </AnimatedButton>
    </AnimatedView>
  );

  return (
    <GradientBackground variant="default">
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.interactive.primary}
              colors={[theme.colors.interactive.primary]}
              progressBackgroundColor={theme.colors.bg.secondary}
            />
          }
        />
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  communityHeader: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonPressed: {
    backgroundColor: `rgba(20, 184, 166, 0.1)`,
  },
  communityIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `rgba(20, 184, 166, 0.1)`,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: `rgba(20, 184, 166, 0.2)`,
    alignSelf: 'center',
  },
  communityInfo: {
    gap: theme.spacing.md,
  },
  communityName: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  communityDescription: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.base,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: theme.colors.border.default,
  },
  stat: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  joinButton: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    alignSelf: 'center',
    minWidth: 140,
  },
});

export default CommunityDetailScreen;
