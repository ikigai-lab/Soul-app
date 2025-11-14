import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@/components/ui/modal';
import { Button, ButtonText } from '@/components/ui/button';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import Icon from '@/components/ui/Icon';
import { theme } from '@/utils/theme';

interface UserProfile {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  bio?: string;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onConnect?: (userId: string) => void;
  onDayChat?: (userId: string) => void;
  isConnected?: boolean;
}

const AnimatedView = Animated.View;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onConnect,
  onDayChat,
  isConnected = false,
}) => {
  const handleConnect = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onConnect?.(user.id);
    onClose();
  };

  const handleDayChat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDayChat?.(user.id);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent style={styles.modalContent}>
        {/* Header */}
        <AnimatedView entering={FadeInDown.duration(300)}>
          <ModalHeader style={styles.header}>
            <Heading size="lg" style={styles.title}>
              Profile
            </Heading>
            <ModalCloseButton style={styles.closeButton}>
              <Icon name="X" color={theme.colors.text.primary} size={24} />
            </ModalCloseButton>
          </ModalHeader>
        </AnimatedView>

        {/* Body */}
        <ModalBody style={styles.body}>
          <AnimatedView
            entering={ZoomIn.duration(400).springify()}
            style={styles.profileContainer}
          >
            {/* Avatar */}
            <Avatar size="xl" style={styles.avatar}>
              {user.avatar ? (
                <AvatarImage source={{ uri: user.avatar }} />
              ) : (
                <AvatarFallbackText>{user.name}</AvatarFallbackText>
              )}
            </Avatar>

            {/* User Info */}
            <AnimatedView
              entering={FadeInDown.delay(100).duration(400)}
              style={styles.infoContainer}
            >
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.username}>@{user.username}</Text>
            </AnimatedView>

            {/* Bio */}
            {user.bio && (
              <AnimatedView
                entering={FadeInDown.delay(200).duration(400)}
                style={styles.bioContainer}
              >
                <Text style={styles.bio}>{user.bio}</Text>
              </AnimatedView>
            )}

            {/* Status Badge */}
            {isConnected && (
              <AnimatedView
                entering={FadeInDown.delay(300).duration(400)}
                style={styles.statusBadge}
              >
                <Icon
                  name="Check"
                  color={theme.colors.interactive.success}
                  size={16}
                />
                <Text style={styles.statusText}>Connected</Text>
              </AnimatedView>
            )}
          </AnimatedView>
        </ModalBody>

  {/* Footer */}
<ModalFooter style={styles.footer}>
  <View style={styles.actionButtons}>
    {/* Connect Button */}
    <Pressable
      onPress={handleConnect}
      disabled={isConnected}
      style={[
        styles.connectButton,
        isConnected && styles.connectButtonConnected,
      ]}
    >
      <Icon
        name={isConnected ? 'Check' : 'UserPlus'}
        color={isConnected ? theme.colors.interactive.success : '#FFFFFF'}
        size={18}
      />
      <Text
        style={[
          styles.connectButtonText,
          isConnected && styles.connectButtonTextConnected,
        ]}
      >
        {isConnected ? 'Connected' : 'Connect'}
      </Text>
    </Pressable>

    {/* DayChat Button */}
    <Pressable
      onPress={handleDayChat}
      style={styles.daychatButton}
    >
      <Icon
        name="Clock"
        color={'#0d0f0eff'}
        size={18}
      />
      <Text style={styles.daychatButtonText}>DayChat</Text>
    </Pressable>
  </View>
</ModalFooter>

      </ModalContent>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    width: '90%',
    maxWidth: 450,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.bg.primary,
    borderWidth: 1,
    borderColor: `rgba(34, 20, 184, 0.2)`,
  },
  header: {
    backgroundColor: `rgba(67, 20, 184, 0.08)`,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: theme.spacing.md,
  },
  body: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xxl,
  },
  profileContainer: {
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: theme.colors.interactive.primary,
  },
  infoContainer: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  name: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: theme.typography.fontSize.xl,
  },
  username: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
  },
  bioContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  bio: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: `rgba(89, 16, 185, 0.1)`,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: `rgba(75, 16, 185, 0.2)`,
  },
  statusText: {
    color: theme.colors.interactive.success,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
    backgroundColor: `rgba(102, 20, 184, 0.04)`,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  connectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor:`rgba(20, 19, 21, 0.2)`,
    borderWidth: 1,
    borderColor: `rgba(65, 63, 68, 0.2)`,
  },
  connectButtonConnected: {
    backgroundColor: `rgba(95, 16, 185, 0.1)`,
    borderColor: theme.colors.interactive.success,
  },
  connectButtonText: {
    color:`#FFFFFF`,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  connectButtonTextConnected: {
    color: theme.colors.interactive.success,
  },
  daychatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: `#FFFFFF`,
    borderWidth: 1,
    borderColor: `rgba(73, 72, 75, 0.2)`,
  },
  daychatButtonText: {
    color: '#0d0f0eff',
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  buttonPressed: {
    opacity: 0.8,
  },
});

export default UserProfileModal;
