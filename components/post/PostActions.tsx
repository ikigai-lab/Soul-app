import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Icon from '@/components/ui/Icon';
import { theme } from '@/utils/theme';

interface PostActionsProps {
  postId: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isLiked: boolean;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PostActions: React.FC<PostActionsProps> = ({
  postId,
  likeCount,
  commentCount,
  shareCount,
  isLiked,
  onLike,
  onComment,
  onShare,
}) => {
  const likeScale = useSharedValue(1);

  const handleLike = () => {
    Haptics.impactAsync(
      isLiked
        ? Haptics.ImpactFeedbackStyle.Light
        : Haptics.ImpactFeedbackStyle.Medium
    );

    likeScale.value = withSequence(
      withSpring(1.2, { damping: 10 }),
      withSpring(1, { damping: 10 })
    );

    onLike?.(postId);
  };

  const handleComment = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onComment?.(postId);
  };

  const handleShare = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onShare?.(postId);
  };

  const likeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  return (
    <View style={styles.container}>
      <AnimatedPressable
        onPress={handleLike}
        style={({ pressed }) => [
          styles.actionButton,
          pressed && styles.actionButtonPressed,
          likeAnimatedStyle,
        ]}
      >
        <Icon
          name="Heart"
          color={isLiked ? '#EF4444' : '#FFFFFF'}
          size={24}
          fill={isLiked ? '#EF4444' : 'none'}
          strokeWidth={isLiked ? 0 : 2}
        />
      </AnimatedPressable>

      <Pressable
        onPress={handleComment}
        style={({ pressed }) => [
          styles.actionButton,
          pressed && styles.actionButtonPressed,
        ]}
      >
        <Icon
          name="MessageCircle"
          color="#FFFFFF"
          size={24}
          strokeWidth={2}
        />
      </Pressable>

      <Pressable
        onPress={handleShare}
        style={({ pressed }) => [
          styles.actionButton,
          pressed && styles.actionButtonPressed,
        ]}
      >
        <Icon
          name="Share2"
          color="#FFFFFF"
          size={24}
          strokeWidth={2}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 4,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  actionButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ scale: 0.95 }],
  },
});

export default PostActions;
