import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import Icon from '@/components/ui/Icon';
import PostTypeSelector from '@/components/create/PostTypeSelector';
import DestinationSelector, {
  Destination,
} from '@/components/create/DestinationSelector';
import { Button, ButtonText } from '@/components/ui/button';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { theme } from '@/utils/theme';
import type { CreateStackNavigationProp } from '@/types/navigation.types';

const MOCK_DESTINATIONS: Destination[] = [
  { id: 'home', name: 'Your Feed', type: 'home' },
  { id: 'comm1', name: 'AnxietySupport', type: 'joined', isPrivate: false },
  { id: 'comm5', name: 'SelfCareSunday', type: 'created', isPrivate: false },
];

const AnimatedView = Animated.View;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CreatePostScreen: React.FC = () => {
  const navigation = useNavigation<CreateStackNavigationProp>();
  const [postType, setPostType] = useState<'post' | 'community'>('post');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('home');
  const [isPosting, setIsPosting] = useState(false);

  const canPost =
    (content.trim().length > 0 || media.length > 0) && postType === 'post';

  const handleMediaPick = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant media library access to upload photos.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 4,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newMedia = result.assets.map((asset) => asset.uri);

      navigation.navigate('UploadMediaScreen', {
        mediaUris: newMedia,
        onComplete: (editedMedia: string[]) => {
          setMedia([...media, ...editedMedia]);
        },
      });
    }
  };

  const handleRemoveMedia = useCallback((uri: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMedia((prev) => prev.filter((m) => m !== uri));
  }, []);

  const handlePost = async () => {
    if (!canPost) return;

    setIsPosting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    console.log('Posting:', {
      content,
      media,
      isAnonymous,
      destination: selectedDestination,
    });

    setIsPosting(false);
    navigation.goBack();
  };

  const switchToCommunityCreation = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('CreateCommunityScreen');
  };

  return (
    <GradientBackground variant="default">
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
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

            <PostTypeSelector selected={postType} onSelect={setPostType} />

            {postType === 'post' && (
              <Button
                action={canPost ? 'primary' : 'secondary'}
                variant={canPost ? 'solid' : 'outline'}
                size="sm"
                onPress={handlePost}
                disabled={!canPost || isPosting}
              >
                <ButtonText>{isPosting ? 'Posting...' : 'Post'}</ButtonText>
              </Button>
            )}
          </AnimatedView>

          {/* Content */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <AnimatedView
              entering={FadeInDown.duration(400)}
              style={styles.content}
            >
              {postType === 'post' ? (
                <>
                  {/* Destination Selector */}
                  <DestinationSelector
                    destinations={MOCK_DESTINATIONS}
                    selected={selectedDestination}
                    onSelect={setSelectedDestination}
                  />

                  {/* Text Input */}
                  <View style={styles.section}>
                    <TextInput
                      value={content}
                      onChangeText={setContent}
                      placeholder="What's on your mind?"
                      placeholderTextColor={theme.colors.text.tertiary}
                      style={styles.textInput}
                      multiline
                      textAlignVertical="top"
                      autoFocus
                      maxLength={2000}
                    />
                    <Text style={styles.charCount}>
                      {content.length}/2000
                    </Text>
                  </View>

                  {/* Media Preview */}
                  {media.length > 0 && (
                    <AnimatedView
                      entering={FadeInDown.duration(300)}
                      style={styles.mediaGrid}
                    >
                      {media.map((uri, index) => (
                        <Animated.View
                          key={index}
                          entering={FadeInDown.delay(index * 50).duration(200)}
                          style={styles.mediaItem}
                        >
                          <View style={styles.mediaPreview} />
                          <Pressable
                            onPress={() => handleRemoveMedia(uri)}
                            style={styles.removeButton}
                          >
                            <Icon
                              name="X"
                              color="#FFFFFF"
                              size={16}
                            />
                          </Pressable>
                        </Animated.View>
                      ))}
                    </AnimatedView>
                  )}

                  {/* Anonymous Toggle */}
                  <View style={styles.optionRow}>
                    <View style={styles.optionLabel}>
                      <Icon
                        name={isAnonymous ? 'Eye' : 'EyeOff'}
                        color={theme.colors.text.secondary}
                        size={20}
                      />
                      <View>
                        <Text style={styles.optionTitle}>Post Anonymously</Text>
                        <Text style={styles.optionSubtitle}>
                          Hide your identity
                        </Text>
                      </View>
                    </View>
                    <Pressable
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setIsAnonymous(!isAnonymous);
                      }}
                      style={[
                        styles.toggle,
                        isAnonymous && styles.toggleActive,
                      ]}
                    >
                      <View
                        style={[
                          styles.toggleThumb,
                          isAnonymous && styles.toggleThumbActive,
                        ]}
                      />
                    </Pressable>
                  </View>

                  {/* Media Button */}
                  <AnimatedPressable
                    onPress={handleMediaPick}
                    style={({ pressed }) => [
                      styles.mediaButton,
                      pressed && styles.mediaButtonPressed,
                    ]}
                  >
                    <Icon
                      name="Image"
                      color={theme.colors.interactive.primary}
                      size={24}
                    />
                    <Text style={styles.mediaButtonText}>Add Photos/Video</Text>
                    <Text style={styles.mediaCount}>
                      {media.length}/4
                    </Text>
                  </AnimatedPressable>
                </>
              ) : (
                <>
                  {/* Community Creation Info */}
                  <View style={styles.infoBox}>
                    <Icon
                      name="Info"
                      color={theme.colors.interactive.primary}
                      size={24}
                    />
                    <View style={styles.infoContent}>
                      <Text style={styles.infoTitle}>Create Community</Text>
                      <Text style={styles.infoText}>
                        Build a community around a shared interest or mental
                        health topic
                      </Text>
                    </View>
                  </View>

                  <Button
                    action="primary"
                    size="lg"
                    onPress={switchToCommunityCreation}
                    style={styles.createButton}
                  >
                    <Icon name="Plus" color="#FFFFFF" size={20} />
                    <ButtonText>Create Community</ButtonText>
                  </Button>
                </>
              )}
            </AnimatedView>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.xl,
  },
  section: {
    gap: theme.spacing.sm,
  },
  textInput: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    lineHeight: 24,
    minHeight: 120,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.bg.secondary,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    fontFamily: theme.typography.fontFamily.regular,
  },
  charCount: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.xs,
    textAlign: 'right',
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  mediaItem: {
    width: '48%',
    aspectRatio: 1,
    position: 'relative',
  },
  mediaPreview: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.bg.secondary,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.interactive.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.bg.secondary,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  optionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  optionTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  optionSubtitle: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.xs,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.bg.tertiary,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: theme.colors.interactive.primary,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.text.secondary,
  },
  toggleThumbActive: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-end',
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: `rgba(20, 184, 166, 0.08)`,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: `rgba(20, 184, 166, 0.3)`,
  },
  mediaButtonPressed: {
    backgroundColor: `rgba(20, 184, 166, 0.12)`,
  },
  mediaButtonText: {
    color: theme.colors.interactive.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    flex: 1,
  },
  mediaCount: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  infoBox: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    backgroundColor: `rgba(20, 184, 166, 0.08)`,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: `rgba(20, 184, 166, 0.2)`,
  },
  infoContent: {
    flex: 1,
    gap: theme.spacing.sm,
  },
  infoTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  infoText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    lineHeight: 20,
  },
  createButton: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
});

export default CreatePostScreen;
