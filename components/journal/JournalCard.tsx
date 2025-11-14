import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Icon from '@/components/ui/Icon';
import { theme } from '@/utils/theme';

export interface Journal {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  hasAudio?: boolean;
  hasMedia?: boolean;
}

interface JournalCardProps {
  journal: Journal;
  onPress: (journal: Journal) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const JournalCard: React.FC<JournalCardProps> = ({ journal, onPress }) => {
  const scale = useSharedValue(1);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(journal);
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

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else if (days === 1) {
      return 'Yesterday';
    } else {
      return `${days} days ago`;
    }
  };

  const formatTimeShort = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, animatedStyle]}
    >
      <Text style={styles.title}>{journal.title}</Text>
      <Text style={styles.timestamp}>
        {formatTime(journal.createdAt)}
      </Text>
      <Text style={styles.content} numberOfLines={3}>
        {journal.content}
      </Text>
      
      {/* Media Icons */}
      {(journal.hasMedia || journal.hasAudio) && (
        <View style={styles.mediaIcons}>
          {journal.hasMedia && (
            <Icon
              name="Camera"
              color="#B0B0B0"
              size={18}
              strokeWidth={2}
            />
          )}
          {journal.hasAudio && (
            <Icon
              name="Mic"
              color="#B0B0B0"
              size={18}
              strokeWidth={2}
            />
          )}
          {journal.hasMedia && journal.hasAudio && (
            <Icon
              name="Video"
              color="#B0B0B0"
              size={18}
              strokeWidth={2}
            />
          )}
        </View>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2C3331', // Dark grey card background
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  timestamp: {
    color: '#B0B0B0', // Light grey
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 12,
  },
  content: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
    marginBottom: 12,
  },
  mediaIcons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
});

export default JournalCard;
