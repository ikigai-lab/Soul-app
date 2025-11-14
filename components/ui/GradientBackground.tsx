import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientBackgroundProps {
  children: React.ReactNode;
  variant?: 'default' | 'subtle' | 'intense';
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  variant = 'default',
}) => {
  const gradientColors = {
    default: ['#0d0f0eff', '#1A201E'], // Dark green-grey (solid for now)
    subtle: ['#1A1C1B', '#1A201E'],
    intense: ['#1A201E', '#1A1C1B'],
  };

  return (
    <View style={[styles.container, { backgroundColor: gradientColors[variant][0] }]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
