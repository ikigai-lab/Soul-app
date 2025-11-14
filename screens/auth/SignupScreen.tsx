import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, { 
  FadeInDown, 
  FadeIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Icon from '@/components/ui/Icon';
import { theme } from '@/utils/theme';
import type { AuthNavigationProp } from '@/types/navigation.types';

const AnimatedView = Animated.View;

const SignupScreen: React.FC = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSignup = async () => {
    setErrors({});

    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!userId.trim()) newErrors.userId = 'UserID is required';
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Min 8 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    navigation.navigate('IDGenerationScreen' as never, { email, name } as never);
  };

  const handleGoogleSignup = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Google signup');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <AnimatedView entering={FadeIn.duration(300)}>
              <View style={styles.header}>
                <Pressable
                  onPress={() => navigation.goBack()}
                  hitSlop={12}
                  style={({ pressed }) => [
                    styles.backButton,
                    pressed && styles.backButtonPressed
                  ]}
                >
                  <Icon 
                    name="ArrowLeft" 
                    color="#FFFFFF" 
                    size={24} 
                    strokeWidth={2}
                  />
                </Pressable>
                <Text style={styles.headerTitle}>Create your Soul Account</Text>
                <View style={styles.headerSpacer} />
              </View>
            </AnimatedView>

            <View style={styles.content}>
              {/* Profile Picture Section */}
              <AnimatedView 
                entering={FadeInDown.delay(100).duration(400)}
                style={styles.profileSection}
              >
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    // TODO: Open image picker
                  }}
                  style={styles.profileCircle}
                >
                  <Icon name="Camera" color="#A0A0A0" size={32} strokeWidth={1.5} />
                  <View style={styles.plusIcon}>
                    <Icon name="Plus" color="#A0A0A0" size={16} strokeWidth={2} />
                  </View>
                </Pressable>
                <Text style={styles.profileHint}>Add a photo (optional)</Text>
              </AnimatedView>

              {/* Form */}
              <AnimatedView 
                entering={FadeInDown.delay(200).duration(400)}
                style={styles.form}
              >
                {/* UserID Field */}
                <View style={styles.field}>
                  <Text style={styles.label}>Your Unique @UserID</Text>
                  <TextInput
                    style={styles.input}
                    value={userId}
                    onChangeText={(text) => {
                      setUserId(text);
                      if (errors.userId) setErrors(prev => ({ ...prev, userId: '' }));
                    }}
                    placeholder="Enter your unique UserID"
                    placeholderTextColor="#6B706E"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Text style={styles.helperText}>This is how others will find you</Text>
                  {errors.userId && (
                    <AnimatedView entering={FadeIn.duration(200)}>
                      <Text style={styles.error}>{errors.userId}</Text>
                    </AnimatedView>
                  )}
                </View>

                {/* Display Name Field */}
                <View style={styles.field}>
                  <Text style={styles.label}>Your Display Name</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                    }}
                    placeholder="Enter your display name"
                    placeholderTextColor="#6B706E"
                    autoCapitalize="words"
                  />
                  {errors.name && (
                    <AnimatedView entering={FadeIn.duration(200)}>
                      <Text style={styles.error}>{errors.name}</Text>
                    </AnimatedView>
                  )}
                </View>

                {/* Password Field */}
                <View style={styles.field}>
                  <Text style={styles.label}>Create a Secure Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                      }}
                      placeholder="Enter your password"
                      placeholderTextColor="#6B706E"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <Pressable
                      onPress={() => {
                        setShowPassword(!showPassword);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      style={styles.eyeIcon}
                    >
                      <Icon 
                        name={showPassword ? 'Eye' : 'EyeOff'} 
                        color="#A0A0A0"
                        size={20}
                        strokeWidth={1.5}
                      />
                    </Pressable>
                  </View>
                  {errors.password && (
                    <AnimatedView entering={FadeIn.duration(200)}>
                      <Text style={styles.error}>{errors.password}</Text>
                    </AnimatedView>
                  )}
                </View>

                {/* Create Account Button */}
                <Pressable
                  onPress={handleSignup}
                  disabled={isLoading}
                  style={({ pressed }) => [
                    styles.createButton,
                    pressed && styles.buttonPressed,
                    isLoading && styles.buttonDisabled,
                  ]}
                >
                  <Text style={styles.createButtonText}>
                    {isLoading ? 'Creating...' : 'Create Account'}
                  </Text>
                </Pressable>

                {/* Privacy Policy Text */}
                <Text style={styles.privacyText}>
                  By creating an account, you agree to our{' '}
                  <Text style={styles.privacyLink}>Privacy Policy</Text>.
                </Text>
              </AnimatedView>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101111ff', // Dark grey-black background
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonPressed: {
    opacity: 0.6,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2C312F', // Dark grey
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  plusIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1A1C1B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHint: {
    fontSize: 14,
    color: '#A0A0A0',
    fontWeight: '400',
  },
  form: {
    gap: 24,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#2C312F', // Dark grey (matching screenshot)
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FFFFFF',
    height: 52,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C312F',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: 4,
  },
  helperText: {
    fontSize: 14,
    color: '#A0A0A0',
    fontWeight: '400',
    marginTop: 4,
  },
  error: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  createButton: {
    backgroundColor: '#80E0A0', // Light green (matching screenshot)
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  createButtonText: {
    color: '#1A201E', // Dark green text
    fontSize: 18,
    fontWeight: '600',
  },
  privacyText: {
    fontSize: 14,
    color: '#707070', // Darker grey
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
  privacyLink: {
    color: '#A0A0A0', // Slightly lighter grey for link
    textDecorationLine: 'underline',
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default SignupScreen;
