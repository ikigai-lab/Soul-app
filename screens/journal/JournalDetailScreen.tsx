import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Alert,
  Text,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import JournalEditor from '@/components/journal/JournalEditor';
import Icon from '@/components/ui/Icon';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { theme } from '@/utils/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.View;

const JournalDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { journalId } = route.params as { journalId: string };

  const isNewJournal = journalId === 'new';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);

  const saveButtonScale = useSharedValue(1);
  const savedOpacity = useSharedValue(0);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!isNewJournal) {
      setTitle('My Mental Health Journey');
      setContent(
        'Today was a breakthrough. My therapist helped me understand that anxiety is not who I am...'
      );
      setMedia(['https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800']);
    }
  }, [journalId]);

  useEffect(() => {
    if (hasChanges && !isSaving) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      autoSaveTimeoutRef.current = setTimeout(() => {
        handleAutoSave();
      }, 2000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [title, content, media, hasChanges]);

  const handleAutoSave = async () => {
    if (!title && !content) return;

    setIsSaving(true);
    console.log('Auto-saving journal...');

    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSaving(false);
    setHasChanges(false);
  };

  const showSavedAnimation = () => {
    setShowSavedIndicator(true);
    savedOpacity.value = withSequence(
      withTiming(1, { duration: 300 }),
      withTiming(1, { duration: 1500 }),
      withTiming(0, { duration: 300 })
    );

    setTimeout(() => {
      setShowSavedIndicator(false);
    }, 2100);
  };

  const handleSave = async () => {
    if (!title && !content) {
      Alert.alert('Empty Journal', 'Please write something before saving.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    saveButtonScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    setIsSaving(true);
    console.log('Saving journal:', { title, content, media });

    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsSaving(false);
    setHasChanges(false);
    showSavedAnimation();

    setTimeout(() => {
      navigation.goBack();
    }, 1000);
  };

  const handleBack = () => {
    if (hasChanges && (title || content)) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to save before leaving?',
        [
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
          { text: 'Cancel', style: 'cancel' },
          { text: 'Save', onPress: handleSave },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Journal',
      'Are you sure you want to delete this journal? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            console.log('Deleting journal:', journalId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
    setHasChanges(true);
  }, []);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    setHasChanges(true);
  }, []);

  const handleMediaAdd = useCallback((uri: string) => {
    setMedia((prev) => [...prev, uri]);
    setHasChanges(true);
  }, []);

  const handleMediaRemove = useCallback((uri: string) => {
    setMedia((prev) => prev.filter((m) => m !== uri));
    setHasChanges(true);
  }, []);

  const handleAudioRecord = () => {
    console.log('Start audio recording');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const saveButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveButtonScale.value }],
  }));

  const savedIndicatorAnimatedStyle = useAnimatedStyle(() => ({
    opacity: savedOpacity.value,
  }));

  return (
    <GradientBackground variant="default">
      <SafeAreaView style={styles.container} edges={['bottom']}>
        {/* Header */}
        <AnimatedView entering={FadeIn.duration(300)} style={styles.header}>
          <Pressable
            onPress={handleBack}
            hitSlop={12}
            style={({ pressed }) => [
              styles.headerButton,
              pressed && styles.headerButtonPressed,
            ]}
          >
            <Icon
              name="ChevronLeft"
              color={theme.colors.text.primary}
              size={28}
            />
          </Pressable>

          {showSavedIndicator && (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              style={[styles.savedIndicator, savedIndicatorAnimatedStyle]}
            >
              <Icon
                name="Check"
                color={theme.colors.interactive.success}
                size={16}
              />
              <Text style={styles.savedText}>Saved</Text>
            </Animated.View>
          )}

          {isSaving && !showSavedIndicator && (
            <AnimatedView entering={FadeIn} style={styles.savingIndicator}>
              <Text style={styles.savingText}>Saving...</Text>
            </AnimatedView>
          )}

          <View style={styles.headerActions}>
            {!isNewJournal && (
              <Pressable
                onPress={handleDelete}
                hitSlop={12}
                style={({ pressed }) => [
                  styles.headerButton,
                  pressed && styles.headerButtonPressed,
                ]}
              >
                <Icon
                  name="Trash2"
                  color={theme.colors.interactive.danger}
                  size={24}
                />
              </Pressable>
            )}

            <AnimatedPressable
              onPress={handleSave}
              disabled={!hasChanges || isSaving}
              style={[
                styles.saveButton,
                (!hasChanges || isSaving) && styles.saveButtonDisabled,
                saveButtonAnimatedStyle,
              ]}
            >
              <Icon name="Check" color="#FFFFFF" size={24} />
            </AnimatedPressable>
          </View>
        </AnimatedView>

        {/* Editor */}
        <JournalEditor
          initialTitle={title}
          initialContent={content}
          initialMedia={media}
          onTitleChange={handleTitleChange}
          onContentChange={handleContentChange}
          onMediaAdd={handleMediaAdd}
          onMediaRemove={handleMediaRemove}
          onAudioRecord={handleAudioRecord}
          onSave={handleSave}  // Add this line
        />
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
    paddingTop: 35,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
    gap: theme.spacing.md,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonPressed: {
    backgroundColor: `rgba(20, 184, 166, 0.1)`,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  saveButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.interactive.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3, 
  },
  saveButtonDisabled: {
    
  },
  savedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    backgroundColor: `rgba(16, 185, 129, 0.1)`,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: `rgba(16, 185, 129, 0.2)`,
    flex: 1,
    justifyContent: 'center',
  },
  savedText: {
    color: theme.colors.interactive.success,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  savingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  savingText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
});

export default JournalDetailScreen;
