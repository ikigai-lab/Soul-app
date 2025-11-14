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
import { useNavigation } from '@react-navigation/native';
import Animated, { 
  FadeInDown, 
  FadeIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import Icon from '@/components/ui/Icon';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { theme } from '@/utils/theme';
import type { AuthNavigationProp } from '@/types/navigation.types';

const AnimatedView = Animated.View;

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleReset = async () => {
    setErrors({});

    if (!email.trim()) {
      setErrors({ email: 'Email is required' });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setSubmitted(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
                <View style={styles.iconContainer}>
                  <Icon 
                    name="Lock" 
                    color={theme.colors.interactive.primary} 
                    size={48} 
                  />
                </View>
                <Text style={styles.title}>
                  {submitted ? 'Check Your Email' : 'Reset Password'}
                </Text>
                <Text style={styles.subtitle}>
                  {submitted 
                    ? 'We\'ve sent password reset instructions to your email' 
                    : 'Enter your email to receive reset instructions'}
                </Text>
              </AnimatedView>

              {!submitted ? (
                <AnimatedView 
                  entering={FadeInDown.delay(200).duration(600)}
                  style={styles.form}
                >
                  <View style={styles.field}>
                    <Text style={styles.label}>Email Address</Text>
                    <Input variant="outline">
                      <InputField
                        value={email}
                        onChangeText={(text) => {
                          setEmail(text);
                          if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                        }}
                        placeholder="your@email.com"
                        placeholderTextColor={theme.colors.text.tertiary}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </Input>
                    {errors.email && (
                      <Animated.View entering={FadeIn.duration(200)}>
                        <Text style={styles.error}>{errors.email}</Text>
                      </Animated.View>
                    )}
                  </View>

                  <Button
                    action="primary"
                    size="lg"
                    onPress={handleReset}
                    isDisabled={isLoading}
                    style={styles.submitButton}
                  >
                    {isLoading ? (
                      <Icon name="Loader" color="#FFFFFF" size={20} />
                    ) : (
                      <ButtonText>Send Reset Link</ButtonText>
                    )}
                  </Button>
                </AnimatedView>
              ) : (
                <AnimatedView 
                  entering={FadeInDown.delay(200).duration(600)}
                  style={styles.successSection}
                >
                  <View style={styles.successBox}>
                    <Icon 
                      name="CheckCircle" 
                      color={theme.colors.interactive.success} 
                      size={40} 
                    />
                    <Text style={styles.successText}>
                      Check your email for a link to reset your password
                    </Text>
                  </View>

                  <Button
                    action="primary"
                    size="lg"
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      navigation.goBack();
                    }}
                    style={styles.submitButton}
                  >
                    <ButtonText>Back to Login</ButtonText>
                  </Button>
                </AnimatedView>
              )}
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
  iconContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: 32,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.base,
    marginTop: theme.spacing.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    gap: theme.spacing.lg,
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
  error: {
    color: theme.colors.interactive.danger,
    fontSize: theme.typography.fontSize.xs,
    marginTop: 2,
  },
  submitButton: {
    width: '100%',
  },
  successSection: {
    gap: theme.spacing.xl,
  },
  successBox: {
    backgroundColor: `rgba(20, 184, 166, 0.1)`,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    gap: theme.spacing.md,
    borderWidth: 1,
    borderColor: `rgba(20, 184, 166, 0.2)`,
  },
  successText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ForgotPasswordScreen;
