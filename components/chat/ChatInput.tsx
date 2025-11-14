import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  Platform,
  Animated as RNAnimated,
  Keyboard,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import Icon from '@/components/ui/Icon';
import { theme } from '@/utils/theme';

interface ChatInputProps {
  onSend: (message: string, mediaUri?: string) => void;
  placeholder?: string;
  disabled?: boolean;
  showMediaButton?: boolean;
  showVoiceButton?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  placeholder = 'Type your message...',
  disabled = false,
  showMediaButton = true,
  showVoiceButton = false,
}) => {
  const [message, setMessage] = useState('');
  const [mediaUri, setMediaUri] = useState<string | undefined>();
  const inputHeight = useRef(new RNAnimated.Value(48)).current;
  const sendButtonScale = useSharedValue(0);

  const handleSend = () => {
    if (message.trim() || mediaUri) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onSend(message.trim(), mediaUri);
      setMessage('');
      setMediaUri(undefined);
      Keyboard.dismiss();
    }
  };

  const handleMediaPick = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      console.log('Permission denied');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setMediaUri(result.assets[0].uri);
    }
  };

  const canSend = (message.trim().length > 0 || mediaUri) && !disabled;

  React.useEffect(() => {
    sendButtonScale.value = withSpring(canSend ? 1 : 0, { damping: 12 });
  }, [canSend]);

  const sendButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sendButtonScale.value }],
    opacity: sendButtonScale.value,
  }));

  const handleContentSizeChange = (e: any) => {
    const newHeight = Math.min(100, Math.max(48, e.nativeEvent.contentSize.height));
    RNAnimated.timing(inputHeight, {
      toValue: newHeight,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {/* Attachment button */}
        {showMediaButton && (
          <Pressable
            onPress={handleMediaPick}
            disabled={disabled}
            hitSlop={8}
            style={({ pressed }) => [
              styles.attachmentButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Icon
              name="Paperclip"
              color="#FFFFFF"
              size={24}
              strokeWidth={2}
            />
          </Pressable>
        )}

        {/* Text input */}
        <TextInput
          style={[styles.input, { height: inputHeight }]}
          placeholder={placeholder}
          placeholderTextColor="#A0AEC0"
          value={message}
          onChangeText={setMessage}
          multiline
          onContentSizeChange={handleContentSizeChange}
          editable={!disabled}
          scrollEnabled={false}
        />

        {/* Send button */}
        {canSend && (
          <AnimatedPressable
            onPress={handleSend}
            style={[
              styles.sendButton,
              sendButtonAnimatedStyle,
              ({ pressed }) => pressed && styles.buttonPressed,
            ]}
          >
            <Icon
              name="Send"
              color="#FFFFFF"
              size={20}
              strokeWidth={2}
            />
          </AnimatedPressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1A201E',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2D3748', // Dark grey input background
    borderRadius: 24, // Capsule shape (50% of height)
    minHeight: 48,
  },
  attachmentButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 0,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#68D391', // Green send button
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
});

export default ChatInput;
