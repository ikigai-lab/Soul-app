import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Icon from '@/components/ui/Icon';
import { Button, ButtonText } from '@/components/ui/button';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { theme } from '@/utils/theme';

const { width } = Dimensions.get('window');
const imageSize = (width - theme.spacing.xl * 2 - theme.spacing.md) / 2;

const AnimatedView = Animated.View;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const UploadMediaScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { mediaUris, onComplete } = route.params as {
    mediaUris: string[];
    onComplete: (uris: string[]) => void;
  };

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editedMedia, setEditedMedia] = useState(mediaUris);

  const handleRemove = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const updated = editedMedia.filter((_, i) => i !== index);
    setEditedMedia(updated);
    if (selectedIndex >= updated.length) {
      setSelectedIndex(Math.max(0, updated.length - 1));
    }
  };

  const handleDone = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onComplete(editedMedia);
    navigation.goBack();
  };

  return (
    <GradientBackground variant="default">
      <SafeAreaView style={styles.container} edges={['bottom']}>
        {/* Header */}
        <AnimatedView
          entering={FadeIn.duration(300)}
          style={styles.header}
        >
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={12}
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.closeButtonPressed,
            ]}
          >
            <Icon name="X" color={theme.colors.text.primary} size={28} />
          </Pressable>

          <Text style={styles.headerTitle}>Review Media</Text>

          <Button
            action="primary"
            size="sm"
            onPress={handleDone}
          >
            <ButtonText>Done</ButtonText>
          </Button>
        </AnimatedView>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {editedMedia.length > 0 ? (
            <>
              {/* Preview */}
              <AnimatedView
                entering={FadeInDown.duration(400)}
                style={styles.previewContainer}
              >
                <Image
                  source={{ uri: editedMedia[selectedIndex] }}
                  style={styles.preview}
                />
              </AnimatedView>

              {/* Thumbnails */}
              <AnimatedView
                entering={FadeInDown.delay(100).duration(400)}
                style={styles.thumbnailsContainer}
              >
                <Text style={styles.sectionTitle}>
                  {editedMedia.length} photo{editedMedia.length !== 1 ? 's' : ''}
                </Text>

                <View style={styles.thumbnailGrid}>
                  {editedMedia.map((uri, index) => (
                    <Animated.View
                      key={index}
                      entering={FadeInDown.delay(index * 50).duration(200)}
                    >
                      <Pressable
                        onPress={() => {
                          Haptics.impactAsync(
                            Haptics.ImpactFeedbackStyle.Light
                          );
                          setSelectedIndex(index);
                        }}
                        style={[
                          styles.thumbnail,
                          selectedIndex === index && styles.thumbnailActive,
                        ]}
                      >
                        <Image
                          source={{ uri }}
                          style={styles.thumbnailImage}
                        />
                        <AnimatedPressable
                          onPress={() => handleRemove(index)}
                          style={styles.removeThumbnail}
                        >
                          <Icon
                            name="X"
                            color="#FFFFFF"
                            size={18}
                          />
                        </AnimatedPressable>
                      </Pressable>
                    </Animated.View>
                  ))}
                </View>
              </AnimatedView>

              {/* Info */}
              <AnimatedView
                entering={FadeInDown.delay(200).duration(400)}
                style={styles.infoBox}
              >
                <Icon
                  name="Info"
                  color={theme.colors.interactive.primary}
                  size={20}
                />
                <Text style={styles.infoText}>
                  Tap a photo to preview. Swipe or tap to reorder photos in your post.
                </Text>
              </AnimatedView>
            </>
          ) : (
            <View style={styles.emptyState}>
              <Icon
                name="Image"
                color={theme.colors.text.tertiary}
                size={48}
              />
              <Text style={styles.emptyText}>No photos selected</Text>
              <Text style={styles.emptySubtext}>
                Go back and select photos to continue
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
    gap: theme.spacing.md,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonPressed: {
    backgroundColor: `rgba(20, 184, 166, 0.1)`,
  },
  headerTitle: {
    flex: 1,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  previewContainer: {
    padding: theme.spacing.lg,
  },
  preview: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.bg.secondary,
  },
  thumbnailsContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  thumbnailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  thumbnail: {
    width: imageSize,
    aspectRatio: 1,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border.default,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnailActive: {
    borderColor: theme.colors.interactive.primary,
    borderWidth: 3,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  removeThumbnail: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `rgba(0, 0, 0, 0.6)`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: `rgba(20, 184, 166, 0.08)`,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: `rgba(20, 184, 166, 0.2)`,
  },
  infoText: {
    flex: 1,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.xl,
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
    textAlign: 'center',
  },
});

export default UploadMediaScreen;
