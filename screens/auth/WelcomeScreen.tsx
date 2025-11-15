import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { theme } from '@/utils/theme';

const AnimatedView = Animated.View;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleSignUp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('SignupScreen' as never);
  };

  const handleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('LoginScreen' as never);
  };

  const handleAnonymous = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Main' as never);
  };

  return (
    <View style={styles.container}>
      {/* Subtle gradient overlay in top third */}
      <LinearGradient
        colors={['rgba(106, 13, 173, 0.1)', 'rgba(16, 19, 18, 1)']}
        style={styles.gradientOverlay}
      />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header - Centered at top */}
        <AnimatedView 
          entering={FadeIn.duration(400)}
          style={styles.header}
        >
          <Text style={styles.title}>Soul</Text>
          <Text style={styles.subtitle}>Your space to connect and grow.</Text>
        </AnimatedView>

        {/* Buttons - Bottom section */}
        <AnimatedView 
          entering={FadeInDown.delay(200).duration(500)}
          style={styles.bottomContainer}
        >
          {/* Sign Up Button - Purple */}
<Pressable
  onPress={handleSignUp}
  style={styles.buttonSignUp}
>
  <Text style={styles.buttonTextPrimary}>Sign Up</Text>
</Pressable>

          {/* Login Button - Dark grey */}
          <Pressable
  onPress={handleLogin}
  style={styles.buttonLogin}
>
  <Text style={styles.buttonTextSecondary}>Login</Text>
</Pressable>


          {/* Anonymous Link */}
          <Pressable 
            onPress={handleAnonymous} 
            style={styles.anonymousButton}
          >
            <Text style={styles.buttonAnonymous}>Continue as Anonymous User</Text>
          </Pressable>
        </AnimatedView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A', // Very dark grey/black background
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%', // Top third of screen
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 100, // Approximately one-third down from top
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 48, // Very large
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
      fontStyle: 'italic',
    color: '#CCCCCC', // Light grey
    textAlign: 'center',
    fontWeight: '400',
    marginTop: 8,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  buttonSignUp: {
    backgroundColor: '#6609a4ff', // Vibrant deep purple
    borderRadius: 14, // 12-16px border radius
    height: 56,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonLogin: {
    backgroundColor: '#333333', // Dark grey
    borderRadius: 14,
    height: 56,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.015,
  },
  buttonTextSecondary: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.015,
  },
  anonymousButton: {
    paddingTop: 10, // Larger spacing than between buttons
    paddingBottom: 12,
  },
  buttonAnonymous: {
    color: '#CCCCCC', // Light grey
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});

export default WelcomeScreen;
