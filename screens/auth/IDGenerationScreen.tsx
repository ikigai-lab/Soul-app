import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import Animated, { 
  FadeInDown, 
  FadeIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import Icon from '@/components/ui/Icon';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { theme } from '@/utils/theme';
import type { AuthNavigationProp } from '@/types/navigation.types';

const AnimatedView = Animated.View;

interface RouteParams {
  email: string;
  name: string;
}

const IDGenerationScreen: React.FC = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const route = useRoute();
  const { email, name } = route.params as RouteParams;

  const [userId, setUserId] = useState('');
  const [displayName, setDisplayName] = useState(name);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleCreateAccount = async () => {
    setErrors({});

    const newErrors: { [key: string]: string } = {};
    if (!userId.trim()) newErrors.userId = 'Username required';
    if (!displayName.trim()) newErrors.displayName = 'Display name required';
    if (!password.trim()) newErrors.password = 'Password required';
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords don\'t match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.navigate('LoginScreen');
  };

  return (
    <GradientBackground variant="default">
      <SafeAreaView style={styles.container}>
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
                    name="ChevronLeft" 
                    color={theme.colors.text.primary} 
                    size={28} 
                  />
                </Pressable>
              </View>
            </AnimatedView>

            <View style={styles.content}>
              <AnimatedView entering={FadeInDown.delay(100).duration(600)}>
                <Text style={styles.title}>Create Your Soul Account</Text>
                <Text style={styles.subtitle}>Set up your unique identity</Text>
              </AnimatedView>

              {/* Form */}
              <AnimatedView 
                entering={FadeInDown.delay(200).duration(600)}
                style={styles.form}
              >
                {/* Avatar placeholder */}
                <View style={styles.avatarSection}>
                  <Pressable style={styles.avatarContainer}>
                    <Icon 
                      name="Camera" 
                      color={theme.colors.text.secondary} 
                      size={32} 
                    />
                    <Text style={styles.avatarText}>Add Photo (Optional)</Text>
                  </Pressable>
                </View>

                {/* Username */}
                <View style={styles.field}>
                  <Text style={styles.label}>Your Unique @UserID</Text>
                  <Input variant="outline">
                    <InputSlot>
                      <Text style={styles.prefix}>@</Text>
                    </InputSlot>
                    <InputField
                      value={userId}
                      onChangeText={(text) => {
                        setUserId(text.replace(/\s/g, ''));
                        if (errors.userId) setErrors(prev => ({ ...prev, userId: '' }));
                      }}
                      placeholder="username"
                      placeholderTextColor={theme.colors.text.tertiary}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </Input>
                  <Text style={styles.hint}>This is how others will find you</Text>
                  {errors.userId && (
                    <Animated.View entering={FadeIn.duration(200)}>
                      <Text style={styles.error}>{errors.userId}</Text>
                    </Animated.View>
                  )}
                </View>

                {/* Display Name */}
                <View style={styles.field}>
                  <Text style={styles.label}>Display Name</Text>
                  <Input variant="outline">
                    <InputField
                      value={displayName}
                      onChangeText={(text) => {
                        setDisplayName(text);
                        if (errors.displayName) setErrors(prev => ({ ...prev, displayName: '' }));
                      }}
                      placeholder="Your name"
                      placeholderTextColor={theme.colors.text.tertiary}
                      autoCapitalize="words"
                    />
                  </Input>
                  {errors.displayName && (
                    <Animated.View entering={FadeIn.duration(200)}>
                      <Text style={styles.error}>{errors.displayName}</Text>
                    </Animated.View>
                  )}
                </View>

                {/* Password */}
                <View style={styles.field}>
                  <Text style={styles.label}>Create Password</Text>
                  <Input variant="outline">
                    <InputField
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                      }}
                      placeholder="Secure password"
                      placeholderTextColor={theme.colors.text.tertiary}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <InputSlot onPress={() => setShowPassword(!showPassword)}>
                      <InputIcon>
                        <Icon 
                          name={showPassword ? 'EyeOff' : 'Eye'} 
                          color={theme.colors.text.tertiary}
                          size={20}
                        />
                      </InputIcon>
                    </InputSlot>
                  </Input>
                  {errors.password && (
                    <Animated.View entering={FadeIn.duration(200)}>
                      <Text style={styles.error}>{errors.password}</Text>
                    </Animated.View>
                  )}
                </View>

                {/* Confirm Password */}
                <View style={styles.field}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <Input variant="outline">
                    <InputField
                      value={confirmPassword}
                      onChangeText={(text) => {
                        setConfirmPassword(text);
                        if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                      }}
                      placeholder="Confirm password"
                      placeholderTextColor={theme.colors.text.tertiary}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                    />
                    <InputSlot onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                      <InputIcon>
                        <Icon 
                          name={showConfirmPassword ? 'EyeOff' : 'Eye'} 
                          color={theme.colors.text.tertiary}
                          size={20}
                        />
                      </InputIcon>
                    </InputSlot>
                  </Input>
                  {errors.confirmPassword && (
                    <Animated.View entering={FadeIn.duration(200)}>
                      <Text style={styles.error}>{errors.confirmPassword}</Text>
                    </Animated.View>
                  )}
                </View>

                <Button
                  action="primary"
                  size="lg"
                  onPress={handleCreateAccount}
                  isDisabled={isLoading}
                  style={styles.submitButton}
                >
                  {isLoading ? (
                    <Icon name="Loader" color="#FFFFFF" size={20} />
                  ) : (
                    <ButtonText>Create Account</ButtonText>
                  )}
                </Button>

                <Text style={styles.agreement}>
                  By creating account, you agree to our {' '}
                  <Text style={styles.link}>Terms</Text>
                  {' '}and{' '}
                  <Text style={styles.link}>Privacy Policy</Text>
                </Text>
              </AnimatedView>
            </View>
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
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: theme.spacing.lg,
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.full,
  },
  backButtonPressed: {
    backgroundColor: `rgba(20, 184, 166, 0.1)`,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.xl,
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: 32,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.base,
    marginTop: theme.spacing.sm,
  },
  form: {
    gap: theme.spacing.lg,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `rgba(20, 184, 166, 0.1)`,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: `rgba(20, 184, 166, 0.3)`,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  avatarText: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.xs,
    textAlign: 'center',
  },
  field: {
    gap: theme.spacing.sm,
  },
  label: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    letterSpacing: 0.2,
  },
  hint: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.xs,
    marginTop: 2,
  },
  prefix: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    marginLeft: theme.spacing.md,
  },
  error: {
    color: theme.colors.interactive.danger,
    fontSize: theme.typography.fontSize.xs,
    marginTop: 2,
  },
  submitButton: {
    width: '100%',
    marginTop: theme.spacing.md,
  },
  agreement: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.xs,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: theme.spacing.md,
  },
  link: {
    color: theme.colors.interactive.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});

export default IDGenerationScreen;
