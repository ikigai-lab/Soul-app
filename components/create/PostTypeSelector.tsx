import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Icon from '@/components/ui/Icon';
import { theme } from '@/utils/theme';

interface PostTypeSelectorProps {
  selected: 'post' | 'community';
  onSelect: (type: 'post' | 'community') => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.View;

const PostTypeSelector: React.FC<PostTypeSelectorProps> = ({
  selected,
  onSelect,
}) => {
  const postScale = useSharedValue(selected === 'post' ? 1 : 0.96);
  const communityScale = useSharedValue(selected === 'community' ? 1 : 0.96);

  const postAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: postScale.value }],
  }));

  const communityAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: communityScale.value }],
  }));

  const handlePostPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    postScale.value = withSpring(1, { damping: 12 });
    communityScale.value = withSpring(0.96, { damping: 12 });
    onSelect('post');
  };

  const handleCommunityPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    communityScale.value = withSpring(1, { damping: 12 });
    postScale.value = withSpring(0.96, { damping: 12 });
    onSelect('community');
  };

  return (
    <AnimatedView entering={FadeIn.duration(300)}>
      <View style={styles.container}>
        <AnimatedPressable
          onPress={handlePostPress}
          style={[
            styles.option,
            selected === 'post' && styles.optionActive,
            postAnimatedStyle,
          ]}
        >
          <Icon
            name="FileText"
            color={
              selected === 'post'
                ? theme.colors.interactive.primary
                : theme.colors.text.secondary
            }
            size={20}
          />
          <Text
            style={[
              styles.optionText,
              selected === 'post' && styles.optionTextActive,
            ]}
          >
            Post
          </Text>
        </AnimatedPressable>

        <View style={styles.divider} />

        <AnimatedPressable
          onPress={handleCommunityPress}
          style={[
            styles.option,
            selected === 'community' && styles.optionActive,
            communityAnimatedStyle,
          ]}
        >
          <Icon
            name="Users"
            color={
              selected === 'community'
                ? theme.colors.interactive.primary
                : theme.colors.text.secondary
            }
            size={20}
          />
          <Text
            style={[
              styles.optionText,
              selected === 'community' && styles.optionTextActive,
            ]}
          >
            Community
          </Text>
        </AnimatedPressable>
      </View>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.bg.secondary,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    padding: theme.spacing.xs,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  optionActive: {
    backgroundColor: `rgba(20, 184, 166, 0.1)`,
    borderWidth: 1,
    borderColor: `rgba(20, 184, 166, 0.2)`,
  },
  optionText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    letterSpacing: 0.2,
  },
  optionTextActive: {
    color: theme.colors.interactive.primary,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.border.default,
    marginHorizontal: theme.spacing.xs,
  },
});

export default PostTypeSelector;
