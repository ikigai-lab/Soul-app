import React, { useState } from 'react';
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
import Icon from '@/components/ui/Icon';
import { Button, ButtonText } from '@/components/ui/button';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { theme } from '@/utils/theme';

const AnimatedView = Animated.View;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CreateCommunityScreen: React.FC = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const canCreate = name.trim().length > 0 && description.trim().length > 0;

  const handleCreate = async () => {
    if (!canCreate) return;

    setErrors({});
    const newErrors: { [key: string]: string } = {};

    if (name.trim().length < 3) {
      newErrors.name = 'Community name must be at least 3 characters';
    }
    if (description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsCreating(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    console.log('Creating community:', {
      name,
      description,
      isPrivate,
    });

    setIsCreating(false);
    navigation.goBack();
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

            <Text style={styles.headerTitle}>New Community</Text>

            <Button
              action={canCreate && !isCreating ? 'primary' : 'secondary'}
              variant={canCreate && !isCreating ? 'solid' : 'outline'}
              size="sm"
              onPress={handleCreate}
              disabled={!canCreate || isCreating}
            >
              <ButtonText>
                {isCreating ? 'Creating...' : 'Create'}
              </ButtonText>
            </Button>
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
              {/* Info Box */}
              <View style={styles.infoBox}>
                <Icon
                  name="Users"
                  color={theme.colors.interactive.primary}
                  size={28}
                />
                <View style={styles.infoContent}>
                  <Text style={styles.infoTitle}>Create a Community</Text>
                  <Text style={styles.infoText}>
                    Build a space for people to discuss topics they care about
                  </Text>
                </View>
              </View>

              {/* Community Name */}
              <View style={styles.section}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Community Name</Text>
                  <Text style={styles.counter}>{name.length}/30</Text>
                </View>
                <TextInput
                  value={name}
                  onChangeText={(text) => {
                    setName(text.slice(0, 30));
                    if (errors.name) {
                      setErrors((prev) => ({ ...prev, name: '' }));
                    }
                  }}
                  placeholder="e.g., AnxietySupportGroup"
                  placeholderTextColor={theme.colors.text.tertiary}
                  style={styles.input}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {errors.name && (
                  <Animated.View entering={FadeIn.duration(200)}>
                    <Text style={styles.error}>{errors.name}</Text>
                  </Animated.View>
                )}
              </View>

              {/* Description */}
              <View style={styles.section}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Description</Text>
                  <Text style={styles.counter}>{description.length}/500</Text>
                </View>
                <TextInput
                  value={description}
                  onChangeText={(text) => {
                    setDescription(text.slice(0, 500));
                    if (errors.description) {
                      setErrors((prev) => ({ ...prev, description: '' }));
                    }
                  }}
                  placeholder="What's this community about?"
                  placeholderTextColor={theme.colors.text.tertiary}
                  style={[styles.input, styles.inputLarge]}
                  multiline
                  textAlignVertical="top"
                />
                {errors.description && (
                  <Animated.View entering={FadeIn.duration(200)}>
                    <Text style={styles.error}>{errors.description}</Text>
                  </Animated.View>
                )}
              </View>

              {/* Privacy Toggle */}
              <View style={styles.optionRow}>
                <View style={styles.optionLabel}>
                  <Icon
                    name={isPrivate ? 'Lock' : 'Globe'}
                    color={theme.colors.text.secondary}
                    size={20}
                  />
                  <View>
                    <Text style={styles.optionTitle}>
                      {isPrivate ? 'Private' : 'Public'}
                    </Text>
                    <Text style={styles.optionSubtitle}>
                      {isPrivate
                        ? 'Invite-only access'
                        : 'Anyone can join'}
                    </Text>
                  </View>
                </View>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setIsPrivate(!isPrivate);
                  }}
                  style={[
                    styles.toggle,
                    isPrivate && styles.toggleActive,
                  ]}
                >
                  <View
                    style={[
                      styles.toggleThumb,
                      isPrivate && styles.toggleThumbActive,
                    ]}
                  />
                </Pressable>
              </View>

              {/* Guidelines */}
              <View style={styles.guidelinesBox}>
                <View style={styles.guidelineItem}>
                  <Icon
                    name="Check"
                    color={theme.colors.interactive.success}
                    size={18}
                  />
                  <Text style={styles.guidelineText}>
                    Be respectful and inclusive
                  </Text>
                </View>
                <View style={styles.guidelineItem}>
                  <Icon
                    name="Check"
                    color={theme.colors.interactive.success}
                    size={18}
                  />
                  <Text style={styles.guidelineText}>
                    Focus on mental wellness
                  </Text>
                </View>
                <View style={styles.guidelineItem}>
                  <Icon
                    name="Check"
                    color={theme.colors.interactive.success}
                    size={18}
                  />
                  <Text style={styles.guidelineText}>
                    Moderate content responsibly
                  </Text>
                </View>
              </View>
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
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.xl,
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
  section: {
    gap: theme.spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    letterSpacing: 0.2,
  },
  counter: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.xs,
  },
  input: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.bg.secondary,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    fontFamily: theme.typography.fontFamily.regular,
  },
  inputLarge: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  error: {
    color: theme.colors.interactive.danger,
    fontSize: theme.typography.fontSize.xs,
    marginTop: 4,
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
  guidelinesBox: {
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.bg.secondary,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  guidelineText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.sm,
    flex: 1,
    lineHeight: 20,
  },
});

export default CreateCommunityScreen;
