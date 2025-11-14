import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/utils/theme';

type SentimentType = 'positive' | 'neutral' | 'negative' | 'anxious' | 'calm';
type SentimentSize = 'sm' | 'md' | 'lg';

interface SentimentIndicatorProps {
  sentiment: SentimentType;
  score?: number;
  size?: SentimentSize;
  showLabel?: boolean;
  showScore?: boolean;
}

const AnimatedView = Animated.View;

const SentimentIndicator: React.FC<SentimentIndicatorProps> = ({
  sentiment,
  score = 75,
  size = 'md',
  showLabel = true,
  showScore = false,
}) => {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withTiming(score / 100, { duration: 1200 });
  }, [score]);

  const getSentimentConfig = (type: SentimentType) => {
    switch (type) {
      case 'positive':
        return {
          label: 'Positive',
          icon: '😊',
          colors: ['#10B981', '#6EE7B7'],
          bgColor: 'rgba(16, 185, 129, 0.08)',
          borderColor: 'rgba(16, 185, 129, 0.2)',
          textColor: '#10B981',
        };
      case 'calm':
        return {
          label: 'Calm',
          icon: '😌',
          colors: ['#8B5CF6', '#A78BFA'],
          bgColor: 'rgba(139, 92, 246, 0.08)',
          borderColor: 'rgba(139, 92, 246, 0.2)',
          textColor: '#8B5CF6',
        };
      case 'anxious':
        return {
          label: 'Anxious',
          icon: '😰',
          colors: ['#F59E0B', '#FBBF24'],
          bgColor: 'rgba(245, 158, 11, 0.08)',
          borderColor: 'rgba(245, 158, 11, 0.2)',
          textColor: '#F59E0B',
        };
      case 'negative':
        return {
          label: 'Struggling',
          icon: '😢',
          colors: ['#EF4444', '#F87171'],
          bgColor: 'rgba(239, 68, 68, 0.08)',
          borderColor: 'rgba(239, 68, 68, 0.2)',
          textColor: '#EF4444',
        };
      case 'neutral':
      default:
        return {
          label: 'Neutral',
          icon: '😐',
          colors: ['#6B7280', '#9CA3AF'],
          bgColor: 'rgba(107, 114, 128, 0.08)',
          borderColor: 'rgba(107, 114, 128, 0.2)',
          textColor: '#6B7280',
        };
    }
  };

  const config = getSentimentConfig(sentiment);

  const getSizeConfig = () => {
    switch (size) {
      case 'sm':
        return {
          containerPadding: theme.spacing.sm,
          iconSize: 16,
          fontSize: theme.typography.fontSize.xs,
          barHeight: 3,
        };
      case 'lg':
        return {
          containerPadding: theme.spacing.lg,
          iconSize: 28,
          fontSize: theme.typography.fontSize.base,
          barHeight: 5,
        };
      case 'md':
      default:
        return {
          containerPadding: theme.spacing.md,
          iconSize: 20,
          fontSize: theme.typography.fontSize.sm,
          barHeight: 4,
        };
    }
  };

  const sizeConfig = getSizeConfig();

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <AnimatedView entering={FadeIn.duration(400)} style={styles.container}>
      <View style={[
        styles.wrapper,
        { 
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
          padding: sizeConfig.containerPadding,
        }
      ]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.labelContainer}>
            <Text style={[styles.emoji, { fontSize: sizeConfig.iconSize }]}>
              {config.icon}
            </Text>
            {showLabel && (
              <Text style={[
                styles.label,
                { 
                  color: config.textColor,
                  fontSize: sizeConfig.fontSize,
                }
              ]}>
                {config.label}
              </Text>
            )}
          </View>
          {showScore && (
            <Text style={[
              styles.score,
              { 
                color: config.textColor,
                fontSize: sizeConfig.fontSize,
              }
            ]}>
              {Math.round(score)}%
            </Text>
          )}
        </View>

        {/* Progress Bar */}
        {showScore && (
          <View style={[
            styles.progressBarBg,
            { height: sizeConfig.barHeight }
          ]}>
            <Animated.View style={[progressBarStyle, styles.progressBar]}>
              <LinearGradient
                colors={config.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFillObject}
              />
            </Animated.View>
          </View>
        )}
      </View>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  wrapper: {
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  emoji: {
    lineHeight: 24,
  },
  label: {
    fontWeight: theme.typography.fontWeight.semibold,
    letterSpacing: 0.2,
  },
  score: {
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 0.2,
  },
  progressBarBg: {
    width: '100%',
    backgroundColor: `rgba(0, 0, 0, 0.2)`,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
});

export default SentimentIndicator;
