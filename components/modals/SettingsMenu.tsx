import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text } from 'react-native';
import Animated, { FadeIn, SlideInRight, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { Modal, ModalBackdrop, ModalContent } from '@/components/ui/modal';
import { Avatar, AvatarImage, AvatarFallbackText } from '@/components/ui/avatar';
import LogoutModal from './LogoutModal';
import ChangePasswordModal from './ChangePasswordModal';
import DeleteAccountModal from './DeleteAccountModal';
import Icon from '@/components/ui/Icon';
import { theme } from '@/utils/theme';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    id: string;
    name: string;
    username: string;
    email: string;
    avatar?: string;
  };
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  onPress: () => void;
  danger?: boolean;
  badge?: number;
}

const AnimatedView = Animated.View;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SettingsMenu: React.FC<SettingsMenuProps> = ({ isOpen, onClose, user }) => {
  const navigation = useNavigation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const currentUser = user || {
    id: 'user1',
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/150?img=12',
  };

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    console.log('Logging out...');
    onClose();
  };

  const handleChangePassword = (currentPassword: string, newPassword: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    console.log('Changing password...');
  };

  const handleDeleteAccount = (password: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    console.log('Deleting account...');
  };

  const accountItems: MenuItem[] = [
    {
      id: 'edit-profile',
      label: 'Edit Profile',
      icon: 'User',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onClose();
      },
    },
    {
      id: 'change-password',
      label: 'Change Password',
      icon: 'Lock',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setShowPasswordModal(true);
      },
    },
    {
      id: 'requests',
      label: 'Connection Requests',
      icon: 'UserPlus',
      badge: 3,
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onClose();
      },
    },
  ];

  const appItems: MenuItem[] = [
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'Bell',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onClose();
      },
    },
    {
      id: 'privacy',
      label: 'Privacy & Safety',
      icon: 'Shield',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onClose();
      },
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: 'Handshake',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onClose();
      },
    },
    {
      id: 'about',
      label: 'About Soul',
      icon: 'Info',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onClose();
      },
    },
  ];

  const dangerItems: MenuItem[] = [
    {
      id: 'logout',
      label: 'Logout',
      icon: 'LogOut',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setShowLogoutModal(true);
      },
    },
    {
      id: 'delete',
      label: 'Delete Account',
      icon: 'Trash2',
      danger: true,
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setShowDeleteModal(true);
      },
    },
  ];

  const renderMenuItem = (item: MenuItem, index: number) => (
    <AnimatedView
      key={item.id}
      entering={SlideInRight.delay(index * 30).duration(300)}
    >
      <AnimatedPressable
        onPress={item.onPress}
        style={({ pressed }) => [
          styles.menuItem,
          item.danger && styles.menuItemDanger,
          pressed && styles.menuItemPressed,
        ]}
      >
        <View style={styles.menuItemLeft}>
          <View
            style={[
              styles.iconContainer,
              item.danger && styles.iconContainerDanger,
            ]}
          >
            <Icon
              name={item.icon as any}
              color={
                item.danger
                  ? theme.colors.interactive.danger
                  : theme.colors.interactive.primary
              }
              size={18}
            />
          </View>
          <Text
            style={[
              styles.menuItemText,
              item.danger && styles.menuItemTextDanger,
            ]}
          >
            {item.label}
          </Text>
        </View>

        <View style={styles.menuItemRight}>
          {item.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}
        </View>
      </AnimatedPressable>
    </AnimatedView>
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalBackdrop />
        <ModalContent style={styles.modalContent}>
          <AnimatedView entering={FadeIn.duration(300)} style={styles.container}>
            <AnimatedView entering={FadeInDown.duration(300)} style={styles.header}>
              <Text style={styles.headerTitle}>Settings</Text>
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.closeButtonPressed,
                ]}
              >
                <Icon name="X" color={theme.colors.text.primary} size={26} />
              </Pressable>
            </AnimatedView>

            <ScrollView showsVerticalScrollIndicator={false}>
              <AnimatedView
                entering={FadeInDown.delay(100).duration(400)}
                style={styles.profileSection}
              >
                <Avatar size="lg">
                  {currentUser.avatar ? (
                    <AvatarImage source={{ uri: currentUser.avatar }} />
                  ) : (
                    <AvatarFallbackText>{currentUser.name}</AvatarFallbackText>
                  )}
                </Avatar>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{currentUser.name}</Text>
                  <Text style={styles.profileUsername}>@{currentUser.username}</Text>
                  <Text style={styles.profileEmail}>{currentUser.email}</Text>
                </View>
              </AnimatedView>

              <AnimatedView
                entering={FadeInDown.delay(150).duration(400)}
                style={styles.section}
              >
                <Text style={styles.sectionTitle}>Account</Text>
                <View style={styles.menuGroup}>
                  {accountItems.map((item, index) => renderMenuItem(item, index))}
                </View>
              </AnimatedView>

              <AnimatedView
                entering={FadeInDown.delay(200).duration(400)}
                style={styles.section}
              >
                <Text style={styles.sectionTitle}>App Settings</Text>
                <View style={styles.menuGroup}>
                  {appItems.map((item, index) =>
                    renderMenuItem(item, index + accountItems.length)
                  )}
                </View>
              </AnimatedView>

              <AnimatedView
                entering={FadeInDown.delay(250).duration(400)}
                style={styles.section}
              >
                <Text style={[styles.sectionTitle, styles.dangerSectionTitle]}>
                  Danger Zone
                </Text>
                <View style={[styles.menuGroup, styles.dangerMenuGroup]}>
                  {dangerItems.map((item, index) =>
                    renderMenuItem(
                      item,
                      index + accountItems.length + appItems.length
                    )
                  )}
                </View>
              </AnimatedView>

              <AnimatedView
                entering={FadeInDown.delay(300).duration(400)}
                style={styles.versionContainer}
              >
                <Text style={styles.version}>Soul v1.0.0</Text>
              </AnimatedView>
            </ScrollView>
          </AnimatedView>
        </ModalContent>
      </Modal>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onConfirm={handleChangePassword}
      />

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    backgroundColor: theme.colors.bg.primary,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonPressed: {
    backgroundColor: `rgba(154, 163, 162, 0.1)`,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xxl,
    gap: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
    backgroundColor: `rgba(105, 110, 110, 0.04)`,
  },
  profileInfo: {
    alignItems: 'center',
    gap: 4,
  },
  profileName: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  profileUsername: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
  },
  profileEmail: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.xs,
    marginTop: 2,
  },
  section: {
    marginVertical: theme.spacing.xl,
  },
  sectionTitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  dangerSectionTitle: {
    color: theme.colors.interactive.danger,
  },
  menuGroup: {
    backgroundColor: theme.colors.bg.secondary,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  dangerMenuGroup: {
    borderColor: `rgba(171, 24, 24, 0.2)`,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  menuItemDanger: {
    backgroundColor: `rgba(239, 68, 68, 0.02)`,
  },
  menuItemPressed: {
    backgroundColor: `rgba(143, 147, 147, 0.1)`,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `rgba(46, 48, 48, 0.12)`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerDanger: {
    backgroundColor: `rgba(239, 68, 68, 0.12)`,
  },
  menuItemText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
  },
  menuItemTextDanger: {
    color: theme.colors.interactive.danger,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  badge: {
    backgroundColor: theme.colors.interactive.primary,
    borderRadius: theme.borderRadius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 7,
    position: 'absolute',  
    bottom: 7,  right: theme.spacing.xl,  
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  versionContainer: {
    paddingVertical: theme.spacing.xxl,
  },
  version: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.xs,
    textAlign: 'center',
  },
});

export default SettingsMenu;
