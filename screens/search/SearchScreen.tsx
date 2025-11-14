import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import PostCard, { Post } from '@/components/post/PostCard';
import UserProfileModal from '@/components/modals/UserProfileModal';
import Icon from '@/components/ui/Icon';
import { theme } from '@/utils/theme';

type SearchTab = 'posts' | 'users' | 'communities';

interface SearchResult {
  id: string;
  type: 'post' | 'user' | 'community';
  data: any;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SearchScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SearchTab>('posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  // --- Mock Data for preview/demo
  const mockPosts: Post[] = [
    {
      id: '1',
      content: 'Started my mental health journey today 💙 #mentalhealth',
      authorId: 'user1',
      authorName: 'sarah_wellness',
      authorAvatar: 'https://i.pravatar.cc/150?img=1',
      createdAt: new Date(Date.now() - 3600000),
      likeCount: 45,
      commentCount: 12,
      shareCount: 3,
      isLiked: false,
      isAnonymous: false,
    },
  ];
  const mockUsers = [
    {
      id: 'user1',
      username: 'sarah_wellness',
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      bio: 'Mental health advocate 💙 | Sharing my journey',
    },
  ];
  const mockCommunities = [
    {
      id: 'comm1',
      name: 'MentalHealth',
      memberCount: 15420,
      isPrivate: false,
      description: 'A supportive community for mental health discussions',
    },
  ];

  // --- Handlers
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    await new Promise((r) => setTimeout(r, 250));
    if (activeTab === 'posts') {
      setResults(mockPosts.map((post) => ({ id: post.id, type: 'post', data: post })));
    } else if (activeTab === 'users') {
      setResults(mockUsers.map((user) => ({ id: user.id, type: 'user', data: user })));
    } else {
      setResults(mockCommunities.map((comm) => ({ id: comm.id, type: 'community', data: comm })));
    }
    setIsSearching(false);
  }, [activeTab]);

  const handleTabChange = (tab: SearchTab) => {
    setActiveTab(tab);
    if (searchQuery.trim()) handleSearch(searchQuery);
  };

  const handleUserPress = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setShowUserProfile(true);
    }
  };

  const renderUser = (user: any) => (
    <AnimatedPressable
      entering={FadeIn.duration(300)}
      onPress={() => handleUserPress(user.id)}
      style={({ pressed }) => [
        styles.itemCard,
        pressed && styles.itemCardPressed,
      ]}
    >
      <View style={styles.cardAvatar}>
        <Icon name="User" color={theme.colors.text.primary} size={28} />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{user.name}</Text>
        <Text style={styles.cardLabel}>@{user.username}</Text>
        {user.bio && <Text style={styles.cardDescription}>{user.bio}</Text>}
      </View>
      <Icon name="ChevronRight" color={theme.colors.text.tertiary} size={20} />
    </AnimatedPressable>
  );

  const renderCommunity = (community: any) => (
    <AnimatedPressable
      entering={FadeIn.duration(300)}
      style={({ pressed }) => [
        styles.itemCard,
        pressed && styles.itemCardPressed,
      ]}
    >
      <View style={styles.cardAvatar}>
        <Icon name={community.isPrivate ? 'Lock' : 'Users'} color={theme.colors.text.primary} size={28} />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>c/{community.name}</Text>
        <Text style={styles.cardLabel}>
          {community.memberCount.toLocaleString()} members
        </Text>
        {community.description && <Text style={styles.cardDescription}>{community.description}</Text>}
      </View>
      <Icon name="ChevronRight" color={theme.colors.text.tertiary} size={20} />
    </AnimatedPressable>
  );

  // --- FlatList renderers
  const renderResult = ({ item }: { item: SearchResult }) => {
    if (item.type === 'post') return <PostCard post={item.data} showCommunityName />;
    if (item.type === 'user') return renderUser(item.data);
    return renderCommunity(item.data);
  };

  const renderEmpty = () => {
    if (isSearching) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.interactive.primary} />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      );
    }
    return (
      <Animated.View entering={FadeInDown.duration(400)} style={styles.emptyContainer}>
        <Icon name="Search" color={theme.colors.text.tertiary} size={48} />
        <Text style={styles.emptyTitle}>
          {searchQuery ? 'No results found' : 'Search for Connections'}
        </Text>
        {searchQuery && (
          <Text style={styles.emptySubtitle}>Try a different keyword</Text>
        )}
      </Animated.View>
    );
  };

  // --- Main Render
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.searchBarContainer}>
        <Input style={styles.searchInput}>
          <InputSlot>
            <InputIcon>
              <Icon name="Search" color='#FFFFFF'/>
            </InputIcon>
          </InputSlot>
          <InputField
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search posts, users, or communities"
            autoFocus
          />
          {searchQuery.length > 0 && (
            <InputSlot>
              <Pressable onPress={() => handleSearch('')}>
                <InputIcon>
                  <Icon name="X" />
                </InputIcon>
              </Pressable>
            </InputSlot>
          )}
        </Input>
      </View>
      <View style={styles.tabs}>
        {(['posts', 'users', 'communities'] as SearchTab[]).map((tab) => (
          <Pressable
            key={tab}
            onPress={() => handleTabChange(tab)}
            style={[
              styles.tab,
              activeTab === tab && styles.tabActive,
            ]}
          >
            <Animated.Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Animated.Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={results}
        renderItem={renderResult}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={results.length === 0 && styles.listEmpty}
      />
      {selectedUser && (
        <UserProfileModal
          isOpen={showUserProfile}
          onClose={() => setShowUserProfile(false)}
          user={selectedUser}
          onConnect={() => {}}
          onDayChat={() => {}}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
  searchBarContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 40,
    paddingBottom: theme.spacing.xl,
    backgroundColor: theme.colors.bg.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  searchInput: {
    backgroundColor: theme.colors.bg.secondary,
    borderRadius: theme.borderRadius.xl,
    height: 40,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: theme.colors.bg.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
    paddingHorizontal: theme.spacing.lg,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.interactive.primary,
  },
  tabText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    opacity: 0.85,
  },
  tabTextActive: {
    color: theme.colors.interactive.primary,
    opacity: 1,
  },
  itemCard: {
    backgroundColor: theme.colors.bg.secondary,
    borderRadius: theme.borderRadius.lg,
    marginVertical: theme.spacing.xs,
    marginHorizontal: theme.spacing.lg,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  itemCardPressed: {
    backgroundColor: theme.colors.bg.tertiary,
  },
  cardAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.bg.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  cardInfo: {
    flex: 1,
    gap: 3,
  },
  cardTitle: {
    color: theme.colors.text.primary,
    fontWeight: '700',
    fontSize: theme.typography.fontSize.base,
    marginBottom: 1,
  },
  cardLabel: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
  },
  cardDescription: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.xs,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
  loadingText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.xxl,
  },
  emptyTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    fontStyle: 'italic',
    opacity: 0.9,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    opacity: 0.7,
    marginTop: 2,
    textAlign: 'center',
  },
  listEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default SearchScreen;
