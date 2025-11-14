import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Icon from '@/components/ui/Icon';
import PostActions from './PostActions';
import { theme } from '@/utils/theme';

export interface Post {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  communityId?: string;
  communityName?: string;
  createdAt: Date;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isLiked: boolean;
  isAnonymous: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
}

interface PostCardProps {
  post: Post;
  showCommunityName?: boolean;
  onUserPress?: (userId: string) => void;
  onCommunityPress?: (communityId: string) => void;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onPostPress?: (postId: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.View;

const getCategoryColor = (categoryName: string): string => {
  const category = categoryName.toLowerCase();
  if (category.includes('mindful')) return '#68646cff'; // Teal/green
  if (category.includes('gratitude')) return '#706e69ff'; // Orange/yellow
  if (category.includes('growth') || category.includes('personal')) return '#766d77ff'; // Purple
  return '#0a0b0aff'; // Default teal
};

const PostCard: React.FC<PostCardProps> = ({
  post,
  showCommunityName = false,
  onUserPress,
  onCommunityPress,
  onLike,
  onComment,
  onShare,
  onPostPress,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const scale = useSharedValue(1);

  const handleUserPress = () => {
    if (!post.isAnonymous) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onUserPress?.(post.authorId);
    }
  };

  const handleCommunityPress = () => {
    if (post.communityId) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onCommunityPress?.(post.communityId);
    }
  };

  const handlePostPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPostPress?.(post.id);
  };

  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true })
      .replace('about ', '')
      .replace(' ago', '');
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 14 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 14 });
  };

  return (
    <AnimatedView entering={FadeInDown.duration(400)}>
      <AnimatedPressable
        onPress={handlePostPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.container, animatedStyle]}
      >
        {/* Header - User info */}
        <View style={styles.header}>
          {/* Avatar */}
          <Pressable
            onPress={handleUserPress}
            disabled={post.isAnonymous}
            style={styles.avatarContainer}
          >
            {post.isAnonymous ? (
              <View style={styles.anonAvatar}>
                <Icon
                  name="EyeOff"
                  color="#A0A0A0"
                  size={20}
                  strokeWidth={2}
                />
              </View>
            ) : post.authorAvatar ? (
              <Image
                source={{ uri: post.authorAvatar }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {post.authorName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </Pressable>

          {/* User Info */}
          <View style={styles.headerInfo}>
            <View style={styles.userInfoRow}>
              <Pressable
                onPress={handleUserPress}
                disabled={post.isAnonymous}
                hitSlop={8}
              >
                <Text 
                  style={[
                    styles.authorName,
                    !post.isAnonymous && styles.authorNameColored
                  ]} 
                  numberOfLines={1}
                >
                  {post.isAnonymous ? 'Anonymous' : `@${post.authorName}`}
                </Text>
              </Pressable>
              {showCommunityName && post.communityName && (
                <View style={[styles.categoryTag, { backgroundColor: getCategoryColor(post.communityName) }]}>
                  <Text style={styles.categoryText}>{post.communityName}</Text>
                </View>
              )}
            </View>
            <View style={styles.timestampRow}>
              <Text style={styles.timestamp}>{formatTime(post.createdAt)}</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <AnimatedView
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.contentContainer}
        >
          <Text style={styles.content}>
            {post.content}
          </Text>

          {/* Media */}
          {post.mediaUrl && (
            <AnimatedView
              entering={FadeInDown.delay(150).duration(400)}
              style={styles.mediaContainer}
            >
              {post.mediaType === 'image' ? (
                <>
                  {!imageLoaded && (
                    <View style={[styles.media, styles.mediaPlaceholder]} />
                  )}
                  <Image
                    source={{ uri: post.mediaUrl }}
                    style={[styles.media, !imageLoaded && styles.hidden]}
                    resizeMode="cover"
                    onLoad={() => setImageLoaded(true)}
                  />
                </>
              ) : (
                <View style={styles.videoContainer}>
                  <Image
                    source={{ uri: post.mediaUrl }}
                    style={styles.media}
                    resizeMode="cover"
                  />
                  <View style={styles.playButtonOverlay}>
                    <View style={styles.playButton}>
                      <Icon
                        name="Play"
                        color="#FFFFFF"
                        size={24}
                        strokeWidth={0}
                      />
                    </View>
                  </View>
                </View>
              )}
            </AnimatedView>
          )}
        </AnimatedView>

        {/* Actions - Like, Comment, Share */}
        <PostActions
          postId={post.id}
          likeCount={post.likeCount}
          commentCount={post.commentCount}
          shareCount={post.shareCount}
          isLiked={post.isLiked}
          onLike={onLike}
          onComment={onComment}
          onShare={onShare}
        />
      </AnimatedPressable>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A', // Card background (slightly lighter than main)
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    ...theme.shadows.md, // Subtle shadow
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  avatarContainer: {
    width: 44,
    height: 44,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2e3936ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  anonAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2D3432',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#404040',
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  authorName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  authorNameColored: {
    color: '#8d27d1ff', // Light green for usernames
  },
  categoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '400',
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timestamp: {
    color: '#A0A0A0', // Light grey
    fontSize: 14,
    fontWeight: '400',
  },
  contentContainer: {
    gap: 16,
    marginBottom: 16,
  },
  content: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
  mediaContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#2D3432',
  },
  mediaPlaceholder: {
    backgroundColor: '#2D3432',
  },
  hidden: {
    opacity: 0,
  },
  videoContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PostCard;
