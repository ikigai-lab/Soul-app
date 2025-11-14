import React, { useState, useCallback, useRef } from 'react';
import {
  FlatList,
  StyleSheet,
  RefreshControl,
  Animated as RNAnimated,
  ViewToken,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import PostCard, { Post } from '@/components/post/PostCard';
import UserProfileModal from '@/components/modals/UserProfileModal';
import { theme } from '@/utils/theme';

// Create AnimatedFlatList ONCE at module level
const AnimatedFlatList = RNAnimated.createAnimatedComponent(FlatList<Post>);
const AnimatedView = Animated.View;

// Better mock data with realistic mental health content
const MOCK_POSTS: Post[] = [
  {
    id: '1',
    content:
      'This is a text post. I\'m sharing my thoughts on the importance of self-care and taking time for yourself. #mentalhealth #selfcare',
    authorId: 'user1',
    authorName: 'Anonymous',
    createdAt: new Date(Date.now() - 1800000), // 30min ago
    likeCount: 342,
    commentCount: 28,
    shareCount: 12,
    isLiked: false,
    isAnonymous: true,
  },
  {
    id: '2',
    content:
      'Found this peaceful spot today. Nature is the best therapy.',
    authorId: 'user2',
    authorName: 'Wanderer',
    authorAvatar: 'https://i.pravatar.cc/150?img=2',
    createdAt: new Date(Date.now() - 7200000), // 2h ago
    likeCount: 567,
    commentCount: 43,
    shareCount: 34,
    isLiked: true,
    isAnonymous: false,
    mediaUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600',
    mediaType: 'image',
  },
  {
    id: '3',
    content:
      'Here\'s a video of my latest creative project. It\'s a short film about finding beauty in everyday life.',
    authorId: 'user3',
    authorName: 'CreativeSoul',
    authorAvatar: 'https://i.pravatar.cc/150?img=3',
    createdAt: new Date(Date.now() - 10800000), // 3h ago
    likeCount: 1243,
    commentCount: 156,
    shareCount: 67,
    isLiked: false,
    isAnonymous: false,
    mediaUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600',
    mediaType: 'video',
  },
];

const HomeScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new RNAnimated.Value(0)).current;
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 300,
  }).current;

  // Track which posts are visible (for future analytics/video autoplay)
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      // Could trigger video autoplay here
      console.log('Visible posts:', viewableItems.map((item) => item.key));
    }
  ).current;

  const handleUserPress = useCallback((userId: string) => {
    if (userId === 'anon') return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Mock user data - replace with real API call
    const userAvatarMap: { [key: string]: string } = {
      user1: 'https://i.pravatar.cc/150?img=1',
      user2: 'https://i.pravatar.cc/150?img=2',
      user3: 'https://i.pravatar.cc/150?img=3',
      user4: 'https://i.pravatar.cc/150?img=4',
    };

    const userNameMap: { [key: string]: string } = {
      user1: 'sarah_wellness',
      user2: 'Wanderer',
      user3: 'CreativeSoul',
      user4: 'brave_journey',
    };

    setSelectedUser({
      id: userId,
      username: userNameMap[userId] || 'user',
      name: 'Loading...', // Would fetch from API
      avatar: userAvatarMap[userId],
      bio: 'Mental health advocate | Sharing my journey 💙',
      isFollowing: false,
    });
    setShowUserProfile(true);
  }, []);

  const handleLike = useCallback((postId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likeCount: post.isLiked
                ? post.likeCount - 1
                : post.likeCount + 1,
            }
          : post
      )
    );
    // TODO: Send like to backend
  }, []);

  const handleComment = useCallback((postId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Navigate to comments:', postId);
    // TODO: Navigate to post detail with comments
  }, []);

  const handleShare = useCallback((postId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Share post:', postId);
    // TODO: Show share sheet
  }, []);

  const handlePostPress = useCallback((postId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Open post detail:', postId);
    // TODO: Navigate to post detail screen
  }, []);

  const handleRefresh = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRefreshing(true);
    // TODO: Fetch new posts from API
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const handleConnect = useCallback((userId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('Send connection request to:', userId);
    setShowUserProfile(false);
    // TODO: Send connection request to backend
  }, []);

  const handleDayChat = useCallback((userId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Start DayChat with:', userId);
    setShowUserProfile(false);
    // TODO: Navigate to chat screen
  }, []);

  const renderPost = useCallback(
    ({ item, index }: { item: Post; index: number }) => (
      <AnimatedView entering={FadeInDown.delay(index * 100).duration(400)}>
        <PostCard
          post={item}
          showCommunityName={false}
          onUserPress={handleUserPress}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          onPostPress={handlePostPress}
        />
      </AnimatedView>
    ),
    [handleUserPress, handleLike, handleComment, handleShare, handlePostPress]
  );

  const keyExtractor = useCallback((item: Post) => item.id, []);

  return (
    <View style={styles.container}>
      <AnimatedFlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        onScroll={RNAnimated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        initialNumToRender={3}
        windowSize={5}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary.teal}
            colors={[theme.colors.primary.teal]}
            progressBackgroundColor={theme.colors.bg.tertiary}
          />
        }
        contentContainerStyle={styles.listContent}
      />

      {/* User Profile Modal */}
      {selectedUser && (
        <UserProfileModal
          isOpen={showUserProfile}
          onClose={() => setShowUserProfile(false)}
          user={selectedUser}
          onConnect={handleConnect}
          onDayChat={handleDayChat}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 100, // Space for bottom nav
  },
});

export default HomeScreen;
