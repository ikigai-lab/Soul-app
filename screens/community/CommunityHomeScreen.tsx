import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  RefreshControl,
  Animated as RNAnimated,
  View,
  Pressable,
  Text,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeIn, FadeInDown, SlideInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Icon from '@/components/ui/Icon';
import PostCard, { Post } from '@/components/post/PostCard';
import CommunitySidebar, { CommunityItem } from '@/components/community/CommunitySidebar';
import { theme } from '@/utils/theme';
import { useSidebar } from '@/contexts/SidebarContext';
import type { CommunityStackNavigationProp } from '@/types/navigation.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock data
const MOCK_POSTS: Post[] = [
  {
    id: '1',
    content:
      'Just wanted to share my journey with anxiety. Started CBT 3 months ago and I can finally go to the grocery store without panicking. It gets better, I promise. 💙',
    authorId: 'user1',
    authorName: 'mindful_explorer',
    authorAvatar: 'https://i.pravatar.cc/150?img=1',
    communityId: 'comm1',
    communityName: 'Mindfulness',
    createdAt: new Date(Date.now() - 7200000), // 2 hours ago
    likeCount: 892,
    commentCount: 134,
    shareCount: 45,
    isLiked: false,
    isAnonymous: false,
  },
  {
    id: '2',
    content:
      'Today was tough. Depression hit hard but I got out of bed, brushed my teeth, and made coffee. Small wins matter.',
    authorId: 'user2',
    authorName: 'grateful_heart',
    authorAvatar: 'https://i.pravatar.cc/150?img=2',
    communityId: 'comm2',
    communityName: 'Gratitude',
    createdAt: new Date(Date.now() - 18000000), // 5 hours ago
    likeCount: 2341,
    commentCount: 456,
    shareCount: 123,
    isLiked: true,
    isAnonymous: false,
  },
  {
    id: '3',
    content:
      'Started my personal growth journey 6 months ago. The changes have been incredible. Remember: progress, not perfection.',
    authorId: 'user3',
    authorName: 'growth_seeker',
    authorAvatar: 'https://i.pravatar.cc/150?img=3',
    communityId: 'comm3',
    communityName: 'Personal Growth',
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    likeCount: 567,
    commentCount: 89,
    shareCount: 34,
    isLiked: false,
    isAnonymous: false,
  },
];

const MOCK_JOINED: CommunityItem[] = [
  { id: 'comm1', name: 'Mindful Moments', isPrivate: false, memberCount: 45230 },
  { id: 'comm2', name: 'Creative Souls', isPrivate: false, memberCount: 123456 },
  { id: 'comm3', name: 'Fitness & Flow', isPrivate: false, memberCount: 78900 },
];

const MOCK_CREATED: CommunityItem[] = [
  { id: 'comm5', name: 'Stoic Circle', isPrivate: false, memberCount: 5678 },
];

const AnimatedFlatList = RNAnimated.createAnimatedComponent(FlatList<Post>);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.View;

const CommunityHomeScreen: React.FC = () => {
  const navigation = useNavigation<CommunityStackNavigationProp>();
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCommunityId, setActiveCommunityId] = useState<string>();
  const scrollY = useRef(new RNAnimated.Value(0)).current;

  const handleCommunityPress = useCallback((community: CommunityItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveCommunityId(community.id);
    closeSidebar();

    setTimeout(() => {
      navigation.navigate('CommunityDetailScreen', {
        communityId: community.id,
        communityName: community.name,
      });
    }, 300);
  }, [navigation]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);

  const handleLike = useCallback((postId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
            }
          : post
      )
    );
  }, []);

  const renderPost = useCallback(
    ({ item, index }: { item: Post; index: number }) => (
      <AnimatedView entering={FadeInDown.delay(index * 100).duration(400)}>
        <PostCard
          post={item}
          showCommunityName={true}
          onUserPress={() => console.log('User pressed')}
          onCommunityPress={(commId) => {
            const comm = [...MOCK_JOINED, ...MOCK_CREATED].find((c) => c.id === commId);
            if (comm) handleCommunityPress(comm);
          }}
          onLike={handleLike}
          onComment={() => console.log('Comment')}
          onShare={() => console.log('Share')}
          onPostPress={() => console.log('Post pressed')}
        />
      </AnimatedView>
    ),
    [handleCommunityPress, handleLike]
  );

  const keyExtractor = useCallback((item: Post) => item.id, []);

  return (
    <View style={styles.container}>
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <Pressable
          style={styles.overlay}
          onPress={closeSidebar}
        />
      )}

      {/* Sidebar */}
      {isSidebarOpen && (
        <AnimatedView
          entering={SlideInRight.duration(300)}
          style={styles.sidebarWrapper}
        >
          <CommunitySidebar
            joinedCommunities={MOCK_JOINED}
            createdCommunities={MOCK_CREATED}
            onCommunityPress={handleCommunityPress}
            activeCommunityId={activeCommunityId}
            onClose={closeSidebar}
          />
        </AnimatedView>
      )}

      {/* Main Content */}
      <View style={styles.mainContent}>
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
          initialNumToRender={3}
          windowSize={5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary.purple}
              colors={[theme.colors.primary.purple]}
              progressBackgroundColor={theme.colors.bg.tertiary}
            />
          }
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  sidebarWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 2,
    ...theme.shadows.drawer,
  },
  mainContent: {
    flex: 1,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 100, // Space for bottom nav
  },
});

export default CommunityHomeScreen;
