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
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Icon from '@/components/ui/Icon';
import { theme } from '@/utils/theme';
import type { AuthNavigationProp } from '@/types/navigation.types';

const AnimatedView = Animated.View;
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const [customId, setCustomId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const shakeTranslate = useSharedValue(0);

  const shakeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeTranslate.value }],
  }));

  const shakeError = () => {
    shakeTranslate.value = withSequence(
      withTiming(-12, { duration: 50 }),
      withTiming(12, { duration: 50 }),
      withTiming(-12, { duration: 50 }),
      withTiming(12, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  const handleLogin = async () => {
    setErrors({});

    const newErrors: { [key: string]: string } = {};
    if (!customId.trim()) {
      newErrors.customId = 'Please enter your ID';
    }
    if (!password.trim()) {
      newErrors.password = 'Please enter password';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      shakeError();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.navigate('HomeScreen' as never);
  };

  const handleForgotPassword = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('ForgotPasswordScreen' as never);
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
            {/* Logo */}
            <AnimatedView 
              entering={FadeIn.duration(300)}
              style={styles.logoContainer}
            >
              <View style={styles.logoCircle}>
                <Icon name="Flower" color="#FFFFFF" size={48} strokeWidth={2} />
                <Text style={styles.logoText}>Soul</Text>
              </View>
            </AnimatedView>

            {/* Title */}
            <AnimatedView 
              entering={FadeInDown.delay(100).duration(400)}
              style={styles.titleContainer}
            >
              <Text style={styles.title}>Log in to Soul.</Text>
            </AnimatedView>

            {/* Form */}
            <AnimatedView 
              style={[styles.form, shakeAnimatedStyle]}
              entering={FadeInDown.delay(200).duration(400)}
            >
              {/* UserID Field */}
              <View style={styles.field}>
                <Text style={styles.label}>@UserID</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={customId}
                    onChangeText={(text) => {
                      setCustomId(text);
                      if (errors.customId) {
                        setErrors(prev => ({ ...prev, customId: '' }));
                      }
                    }}
                    placeholder="Enter your UserID."
                    placeholderTextColor="#A0A0A0"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {errors.customId && (
                  <AnimatedView entering={FadeIn.duration(200)}>
                    <Text style={styles.error}>{errors.customId}</Text>
                  </AnimatedView>
                )}
              </View>

              {/* Password Field */}
              <View style={styles.field}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Password</Text>
                  <Pressable onPress={handleForgotPassword}>
                    <Text style={styles.forgotLink}>Forgot Password?</Text>
                  </Pressable>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password) {
                        setErrors(prev => ({ ...prev, password: '' }));
                      }
                    }}
                    placeholder="Enter your password."
                    placeholderTextColor="#A0A0A0"
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
                      color="#FFFFFF"
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

              {/* Login Button */}
              <Pressable
                onPress={handleLogin}
                disabled={isLoading}
                style={({ pressed }) => [
                  styles.loginButton,
                  pressed && styles.buttonPressed,
                  isLoading && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Text>
              </Pressable>

              {/* Continue as Anonymous Button */}
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  navigation.navigate('Main' as never);
                }}
                style={({ pressed }) => [
                  styles.anonymousButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.anonymousButtonText}>Continue as Anonymous</Text>
              </Pressable>
            </AnimatedView>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A201E', // Dark forest green background
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#F0E0D6', // Light peach/beige
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    marginTop: 8,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  titleContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
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
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotLink: {
    fontSize: 14,
    fontWeight: '400',
    color: '#A0A0A0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3432', // Dark charcoal grey
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: 4,
  },
  error: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  loginButton: {
    backgroundColor: '#70E0A0', // Light green/mint
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  loginButtonText: {
    color: '#1A201E', // Dark green text
    fontSize: 18,
    fontWeight: '600',
  },
  anonymousButton: {
    backgroundColor: '#2D3432', // Dark charcoal grey
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A0A0A0',
  },
  anonymousButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '400',
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default LoginScreen;
