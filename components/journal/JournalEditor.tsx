import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Animated as RNAnimated,
  Dimensions,
  Text
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import Icon from '@/components/ui/Icon';
import { theme } from '@/utils/theme';

const { width } = Dimensions.get('window');
const mediaSize = (width - theme.spacing.xl * 2 - theme.spacing.md) / 2;

interface JournalEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialMedia?: string[];
  onTitleChange?: (title: string) => void;
  onContentChange?: (content: string) => void;
  onMediaAdd?: (mediaUri: string) => void;
  onMediaRemove?: (mediaUri: string) => void;
  onAudioRecord?: () => void;
  onSave?: () => void;  // Add this
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.View;

const JournalEditor: React.FC<JournalEditorProps> = ({
  initialTitle = '',
  initialContent = '',
  initialMedia = [],
  onTitleChange,
  onContentChange,
  onMediaAdd,
  onMediaRemove,
  onAudioRecord,
  onSave,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [media, setMedia] = useState<string[]>(initialMedia);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isContentFocused, setIsContentFocused] = useState(false);

  const titleInputRef = useRef<TextInput>(null);
  const contentInputRef = useRef<TextInput>(null);

  const handleTitleChange = (text: string) => {
    setTitle(text);
    onTitleChange?.(text);
  };

  const handleContentChange = (text: string) => {
    setContent(text);
    onContentChange?.(text);
  };

  const handleMediaPick = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setMedia([...media, uri]);
      onMediaAdd?.(uri);
    }
  };

  const handleMediaRemove = (uri: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMedia(media.filter((m) => m !== uri));
    onMediaRemove?.(uri);
  };

  const handleAudioRecord = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onAudioRecord?.();
  };

  const MediaItem = ({ uri, index }: { uri: string; index: number }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
      scale.value = withSpring(0.95, { damping: 12 });
    };

    const handlePressOut = () => {
      scale.value = withSpring(1, { damping: 12 });
    };

    return (
      <AnimatedView
        entering={FadeInDown.delay(index * 50).duration(300)}
        style={[styles.mediaItem, animatedStyle]}
      >
        <Image source={{ uri }} style={styles.mediaImage} />
        <Pressable
          onPress={() => handleMediaRemove(uri)}
          style={styles.removeMediaButton}
        >
          <Icon name="X" color="#FFFFFF" size={16} />
        </Pressable>
      </AnimatedView>
    );
  };

  return (
    <View style={{ flex: 1 }}>
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Title Input */}
     
        <TextInput
          ref={titleInputRef}
          value={title}
          onChangeText={handleTitleChange}
          onFocus={() => setIsTitleFocused(true)}
          onBlur={() => setIsTitleFocused(false)}
          placeholder="Journal Title"
          placeholderTextColor={theme.colors.text.tertiary}
          style={styles.titleInput}
          maxLength={100}
        />

      {/* Content Input */}
        <TextInput
          ref={contentInputRef}
          value={content}
          onChangeText={handleContentChange}
          onFocus={() => setIsContentFocused(true)}
          onBlur={() => setIsContentFocused(false)}
          placeholder="What's on your mind?"
          placeholderTextColor={theme.colors.text.tertiary}
          style={styles.contentInput}
          multiline
          textAlignVertical="top"
        />

      {/* Media Grid */}
      {media.length > 0 && (
        <AnimatedView entering={FadeInDown.delay(100).duration(300)}>
          <View style={styles.mediaSection}>
            <View style={styles.mediaGrid}>
              {media.map((uri, index) => (
                <MediaItem key={index} uri={uri} index={index} />
              ))}
            </View>
          </View>
        </AnimatedView>
     
      )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
  <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
    <AnimatedPressable onPress={handleMediaPick} style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}>
      <Icon name="Image" color={'#c1babaff'} size={25} />
    </AnimatedPressable>

    <AnimatedPressable onPress={handleMediaPick} style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}>
      <Icon name="Video" color={'#c1babaff'} size={25} />
    </AnimatedPressable>

    <AnimatedPressable onPress={handleAudioRecord} style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}>
      <Icon name="Mic" color={'#c1babaff'} size={25} />
    </AnimatedPressable>
  </View>


  <Pressable onPress={onSave} style={styles.saveButton}>
    <Text style={styles.saveButtonText}>Save</Text>
  </Pressable>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  titleInput: {
  color: theme.colors.text.primary,
  fontSize: theme.typography.fontSize.xl,
  fontWeight: theme.typography.fontWeight.semibold,
  marginBottom: theme.spacing.md,
  marginTop: 10,
  fontFamily: 'Playfair Display',
  fontStyle: 'italic',
},
contentInput: {
  color: theme.colors.text.primary,
  fontSize: theme.typography.fontSize.lg,
  lineHeight: 24,
  minHeight: 400, 
  marginTop: 0,
  fontWeight: theme.typography.fontWeight.semibold,
  fontFamily: 'Playfair Display',
  fontStyle: 'italic',
},
saveButtonText: {
  color: '#FFFFFF',
  fontWeight: 100,
  fontFamily: 'Playfair Display',
  fontStyle: 'italic',
},
  mediaSection: {
    gap: theme.spacing.md,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  mediaItem: {
    width: mediaSize,
    aspectRatio: 1,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  removeMediaButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `rgba(0, 0, 0, 0.6)`,
    justifyContent: 'center',
    alignItems: 'center',
  },
actionsContainer: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  flexDirection: 'row',
  gap: theme.spacing.md,
  justifyContent: 'space-between',  // Add this
  alignItems: 'center',    
  paddingHorizontal: theme.spacing.md,
  paddingVertical: theme.spacing.md,
  backgroundColor: `rgba(65, 63, 63, 0.6)`,
},
saveButton: {
  paddingHorizontal: theme.spacing.xl,
  paddingVertical: theme.spacing.md,
  backgroundColor: theme.colors.interactive.primary,
  borderRadius: theme.borderRadius.lg,
  justifyContent: 'flex-end',
  alignItems: 'center',
},
actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    paddingVertical: theme.spacing.md,
    backgroundColor: `rgba(61, 20, 184, 0.1)`,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: `rgba(140, 20, 184, 0.2)`,
  },
  actionButtonPressed: {
    backgroundColor: `rgba(84, 26, 219, 0.15)`,
    borderColor: theme.colors.interactive.primary,
  },
});

export default JournalEditor;
