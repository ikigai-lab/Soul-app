import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Avatar, AvatarImage, AvatarFallbackText } from '@/components/ui/avatar';
import Icon from '@/components/ui/Icon';
import { theme } from '@/utils/theme';

export interface Comment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date;
  likeCount: number;
  isLiked: boolean;
  isAnonymous: boolean;
  parentId?: string;
  replyCount?: number;
  supportReactions?: {
    hug: number;
    heart: number;
    support: number;
  };
  userReaction?: 'hug' | 'heart' | 'support' | null;
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onCommentAdd?: (content: string, parentId?: string) => void;
  onCommentLike?: (commentId: string) => void;
  onCommentReact?: (commentId: string, reaction: 'hug' | 'heart' | 'support') => void;
  onUserPress?: (userId: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.View;

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  comments,
  onCommentAdd,
  onCommentLike,
  onCommentReact,
  onUserPress,
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set()
  );

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onCommentAdd?.(newComment, replyingTo || undefined);
    setNewComment('');
    setReplyingTo(null);
  };

  const handleReply = (commentId: string, authorName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setReplyingTo(commentId);
    setNewComment(`@${authorName} `);
  };

  const toggleReplies = (commentId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const renderComment = ({ item, index }: { item: Comment; index: number }) => {
    const isReply = !!item.parentId;
    const hasReplies = (item.replyCount || 0) > 0;
    const isExpanded = expandedComments.has(item.id);

    return (
      <CommentItem
        comment={item}
        isReply={isReply}
        hasReplies={hasReplies}
        isExpanded={isExpanded}
        onLike={() => onCommentLike?.(item.id)}
        onReply={() => handleReply(item.id, item.authorName)}
        onReact={(reaction) => onCommentReact?.(item.id, reaction)}
        onToggleReplies={() => toggleReplies(item.id)}
        onUserPress={() => onUserPress?.(item.authorId)}
      />
    );
  };

  const renderEmpty = () => (
    <AnimatedView entering={FadeIn.duration(400)} style={styles.emptyContainer}>
      <Icon
        name="MessageCircle"
        color={theme.colors.text.tertiary}
        size={48}
      />
      <Text style={styles.emptyText}>No comments yet</Text>
      <Text style={styles.emptySubtext}>
        Be the first to share your thoughts
      </Text>
    </AnimatedView>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      {/* Comments List */}
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      {/* Comment Input */}
      <AnimatedView
        entering={FadeInDown.duration(400)}
        style={styles.inputContainer}
      >
        {replyingTo && (
          <View style={styles.replyingBanner}>
            <View style={styles.replyingContent}>
              <Icon
                name="Reply"
                color={theme.colors.interactive.primary}
                size={16}
              />
              <Text style={styles.replyingText}>Replying to comment</Text>
            </View>
            <Pressable onPress={() => setReplyingTo(null)}>
              <Icon name="X" color={theme.colors.text.secondary} size={18} />
            </Pressable>
          </View>
        )}

        <View style={styles.inputWrapper}>
          <Avatar size="sm">
            <AvatarFallbackText>U</AvatarFallbackText>
          </Avatar>

          <TextInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Share your support..."
            placeholderTextColor={theme.colors.text.tertiary}
            style={styles.input}
            multiline
            maxLength={500}
          />

          <Pressable
            onPress={handleAddComment}
            disabled={!newComment.trim()}
            style={[
              styles.sendButton,
              !newComment.trim() && styles.sendButtonDisabled,
            ]}
          >
            <Icon
              name="Send"
              color={newComment.trim() ? '#FFFFFF' : theme.colors.text.tertiary}
              size={18}
            />
          </Pressable>
        </View>
      </AnimatedView>
    </KeyboardAvoidingView>
  );
};

// Separate Comment Item Component
interface CommentItemProps {
  comment: Comment;
  isReply: boolean;
  hasReplies: boolean;
  isExpanded: boolean;
  onLike: () => void;
  onReply: () => void;
  onReact: (reaction: 'hug' | 'heart' | 'support') => void;
  onToggleReplies: () => void;
  onUserPress: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  isReply,
  hasReplies,
  isExpanded,
  onLike,
  onReply,
  onReact,
  onToggleReplies,
  onUserPress,
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const likeScale = useSharedValue(1);

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    likeScale.value = withSequence(
      withSpring(1.2, { damping: 10 }),
      withSpring(1, { damping: 10 })
    );
    onLike();
  };

  const handleReaction = (reaction: 'hug' | 'heart' | 'support') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onReact(reaction);
    setShowReactions(false);
  };

  const likeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  return (
    <AnimatedView
      entering={FadeInDown.duration(300)}
      style={[styles.commentContainer, isReply && styles.replyContainer]}
    >
      {/* Thread Line */}
      {isReply && <View style={styles.threadLine} />}

      {/* Avatar */}
      <Pressable onPress={onUserPress}>
        <Avatar size="sm">
          {comment.authorAvatar ? (
            <AvatarImage source={{ uri: comment.authorAvatar }} />
          ) : (
            <AvatarFallbackText>{comment.authorName}</AvatarFallbackText>
          )}
        </Avatar>
      </Pressable>

      {/* Content */}
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Pressable onPress={onUserPress}>
            <Text style={styles.authorName}>{comment.authorName}</Text>
          </Pressable>
          <Text style={styles.timestamp}>
            {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
          </Text>
        </View>

        <Text style={styles.commentText}>{comment.content}</Text>

        {/* Support Reactions Display */}
        {comment.supportReactions && (
          <View style={styles.reactionsDisplay}>
            {comment.supportReactions.hug > 0 && (
              <View style={styles.reactionPill}>
                <Text style={styles.reactionEmoji}>🤗</Text>
                <Text style={styles.reactionCount}>
                  {comment.supportReactions.hug}
                </Text>
              </View>
            )}
            {comment.supportReactions.heart > 0 && (
              <View style={styles.reactionPill}>
                <Text style={styles.reactionEmoji}>💙</Text>
                <Text style={styles.reactionCount}>
                  {comment.supportReactions.heart}
                </Text>
              </View>
            )}
            {comment.supportReactions.support > 0 && (
              <View style={styles.reactionPill}>
                <Text style={styles.reactionEmoji}>🙏</Text>
                <Text style={styles.reactionCount}>
                  {comment.supportReactions.support}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Actions */}
        <View style={styles.commentActions}>
          <AnimatedPressable
            onPress={handleLike}
            style={[styles.actionButton, likeAnimatedStyle]}
          >
            <Icon
              name="Heart"
              color={
                comment.isLiked
                  ? theme.colors.interactive.danger
                  : theme.colors.text.secondary
              }
              size={16}
              fill={comment.isLiked ? theme.colors.interactive.danger : 'none'}
              strokeWidth={comment.isLiked ? 0 : 2}
            />
            {comment.likeCount > 0 && (
              <Text style={styles.actionText}>{comment.likeCount}</Text>
            )}
          </AnimatedPressable>

          <Pressable onPress={onReply} style={styles.actionButton}>
            <Icon
              name="MessageCircle"
              color={theme.colors.text.secondary}
              size={16}
              strokeWidth={2}
            />
            <Text style={styles.actionText}>Reply</Text>
          </Pressable>

          <Pressable
            onPress={() => setShowReactions(!showReactions)}
            style={styles.actionButton}
          >
            <Icon
              name="Smile"
              color={theme.colors.text.secondary}
              size={16}
              strokeWidth={2}
            />
            <Text style={styles.actionText}>Support</Text>
          </Pressable>
        </View>

        {/* Support Reactions Picker */}
        {showReactions && (
          <AnimatedView
            entering={FadeIn.duration(200)}
            style={styles.reactionPicker}
          >
            <Pressable
              onPress={() => handleReaction('hug')}
              style={styles.reactionOption}
            >
              <Text style={styles.reactionOptionEmoji}>🤗</Text>
              <Text style={styles.reactionOptionText}>Hug</Text>
            </Pressable>
            <Pressable
              onPress={() => handleReaction('heart')}
              style={styles.reactionOption}
            >
              <Text style={styles.reactionOptionEmoji}>💙</Text>
              <Text style={styles.reactionOptionText}>Heart</Text>
            </Pressable>
            <Pressable
              onPress={() => handleReaction('support')}
              style={styles.reactionOption}
            >
              <Text style={styles.reactionOptionEmoji}>🙏</Text>
              <Text style={styles.reactionOptionText}>Support</Text>
            </Pressable>
          </AnimatedView>
        )}

        {/* Toggle Replies */}
        {hasReplies && (
          <Pressable onPress={onToggleReplies} style={styles.repliesToggle}>
            <Icon
              name={isExpanded ? 'ChevronUp' : 'ChevronDown'}
              color={theme.colors.interactive.primary}
              size={16}
            />
            <Text style={styles.repliesToggleText}>
              {isExpanded ? 'Hide' : 'View'} {comment.replyCount}{' '}
              {comment.replyCount === 1 ? 'reply' : 'replies'}
            </Text>
          </Pressable>
        )}
      </View>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxxl,
    gap: theme.spacing.md,
  },
  emptyText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  emptySubtext: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.sm,
  },
  commentContainer: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  replyContainer: {
    marginLeft: theme.spacing.xl,
    backgroundColor: `rgba(20, 184, 166, 0.04)`,
  },
  threadLine: {
    position: 'absolute',
    left: 28,
    top: 0,
    bottom: 0,
    width: 1.5,
    backgroundColor: `rgba(20, 184, 166, 0.2)`,
  },
  commentContent: {
    flex: 1,
    gap: theme.spacing.sm,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  authorName: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  timestamp: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.xs,
  },
  commentText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.sm,
    lineHeight: 20,
  },
  reactionsDisplay: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
    flexWrap: 'wrap',
  },
  reactionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    backgroundColor: theme.colors.bg.tertiary,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: `rgba(20, 184, 166, 0.2)`,
  },
  reactionEmoji: {
    fontSize: 14,
  },
  reactionCount: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  commentActions: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  reactionPicker: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.bg.secondary,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  reactionOption: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  reactionOptionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  reactionOptionText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  repliesToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  repliesToggleText: {
    color: theme.colors.interactive.primary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
    backgroundColor: theme.colors.bg.primary,
    paddingBottom: Platform.OS === 'ios' ? theme.spacing.md : 0,
  },
  replyingBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: `rgba(20, 184, 166, 0.08)`,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
    gap: theme.spacing.md,
  },
  replyingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  replyingText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.bg.secondary,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    fontFamily: theme.typography.fontFamily.regular,
  },
  sendButton: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.interactive.primary,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.bg.tertiary,
    opacity: 0.5,
  },
});

export default CommentSection;
