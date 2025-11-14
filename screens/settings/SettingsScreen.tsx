import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import SettingsMenu from '@/components/modals/SettingsMenu';
import Icon from '@/components/ui/Icon';
import { theme } from '@/utils/theme';

const AnimatedView = Animated.View;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SettingsScreen: React.FC = () => {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const currentUser = {
    id: 'user1',
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/150?img=12',
  };

  const handleOpenSettings = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowSettingsMenu(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <AnimatedView entering={FadeInDown.duration(300)} style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </AnimatedView>

      <View style={styles.content}>
        <AnimatedView entering={FadeIn.delay(100).duration(400)}>
          <AnimatedPressable
            onPress={handleOpenSettings}
            style={({ pressed }) => [
              styles.settingsCard,
              pressed && styles.settingsCardPressed,
            ]}
          >
            <View style={styles.cardIcon}>
              <Icon
                name="Settings"
                color={theme.colors.interactive.primary}
                size={32}
              />
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Account & Preferences</Text>
              <Text style={styles.cardDescription}>
                Manage your profile, password, notifications, and more
              </Text>
            </View>
          </AnimatedPressable>
        </AnimatedView>

        <AnimatedView
          entering={FadeInDown.delay(150).duration(400)}
          style={styles.quickActions}
        >
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>

          <View style={styles.quickActionsList}>
            <AnimatedPressable
              onPress={handleOpenSettings}
              style={({ pressed }) => [
                styles.quickActionItem,
                pressed && styles.quickActionItemPressed,
              ]}
            >
              <View style={styles.quickActionIcon}>
                <Icon
                  name="Bell"
                  color={theme.colors.interactive.primary}
                  size={20}
                />
              </View>
              <Text style={styles.quickActionText}>Notifications</Text>
            </AnimatedPressable>

            <AnimatedPressable
              onPress={handleOpenSettings}
              style={({ pressed }) => [
                styles.quickActionItem,
                pressed && styles.quickActionItemPressed,
              ]}
            >
              <View style={styles.quickActionIcon}>
                <Icon
                  name="Shield"
                  color={theme.colors.interactive.primary}
                  size={20}
                />
              </View>
              <Text style={styles.quickActionText}>Privacy</Text>
            </AnimatedPressable>

            <AnimatedPressable
              onPress={handleOpenSettings}
              style={({ pressed }) => [
                styles.quickActionItem,
                pressed && styles.quickActionItemPressed,
              ]}
            >
              <View style={styles.quickActionIcon}>
                <Icon
                  name="Handshake"
                  color={theme.colors.interactive.primary}
                  size={20}
                />
              </View>
              <Text style={styles.quickActionText}>Help</Text>
            </AnimatedPressable>
          </View>
        </AnimatedView>
      </View>

      <SettingsMenu
        isOpen={showSettingsMenu}
        onClose={() => setShowSettingsMenu(false)}
        user={currentUser}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  headerTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    gap: theme.spacing.xl,
  },
  settingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.bg.secondary,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  settingsCardPressed: {
    backgroundColor: theme.colors.bg.tertiary,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `rgba(20, 184, 166, 0.12)`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  cardDescription: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    lineHeight: 18,
  },
  quickActions: {
    gap: theme.spacing.md,
  },
  quickActionsTitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: theme.spacing.sm,
  },
  quickActionsList: {
    gap: theme.spacing.md,
  },
  quickActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.bg.secondary,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  quickActionItemPressed: {
    backgroundColor: theme.colors.bg.tertiary,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `rgba(20, 184, 166, 0.1)`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    flex: 1,
  },
});

export default SettingsScreen;
