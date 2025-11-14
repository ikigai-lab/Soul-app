import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import Icon from '@/components/ui/Icon';
import { theme } from '@/utils/theme';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AnimatedView = Animated.View;

const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const handleConfirm = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onConfirm();
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  return (
    <AlertDialog isOpen={isOpen} onClose={handleClose}>
      <AlertDialogBackdrop />
      <AlertDialogContent style={styles.alertContent}>
        {/* Header */}
        <AnimatedView entering={FadeIn.duration(300)}>
          <AlertDialogHeader style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.iconWrapper}>
                <Icon
                  name="LogOut"
                  color={theme.colors.interactive.primary}
                  size={24}
                />
              </View>
              <Heading size="lg" style={styles.title}>
                Logout
              </Heading>
            </View>
          </AlertDialogHeader>
        </AnimatedView>

        {/* Body */}
        <AlertDialogBody style={styles.body}>
          <AnimatedView entering={FadeInDown.duration(400)} style={styles.content}>
            <Text style={styles.message}>
              Are you sure you want to logout? You'll need to login again to
              access your account.
            </Text>

            <View style={styles.infoBox}>
              <Icon
                name="Info"
                color={theme.colors.text.secondary}
                size={18}
              />
              <Text style={styles.infoText}>
                Your data is safe and will be available when you login again.
              </Text>
            </View>
          </AnimatedView>
        </AlertDialogBody>

        {/* Footer */}
        <AlertDialogFooter style={styles.footer}>
          <AnimatedView
            entering={FadeInDown.delay(100).duration(300)}
            style={styles.footerActions}
          >
            <Button
              action="secondary"
              variant="outline"
              onPress={handleClose}
              style={styles.button}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              action="primary"
              onPress={handleConfirm}
              style={styles.button}
            >
              <Icon name="LogOut" color="#5c5959ff" size={18} />
              <ButtonText>Logout</ButtonText>
            </Button>
          </AnimatedView>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const styles = StyleSheet.create({
  alertContent: {
    width: '90%',
    maxWidth: 450,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.bg.primary,
    borderWidth: 1,
    borderColor: `rgba(36, 16, 134, 0.2)`,
  },
  header: {
    backgroundColor: `rgba(123, 77, 214, 0.08)`,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `rgba(13, 15, 15, 0.15)`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.text.primary,
  },
  body: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  content: {
    gap: theme.spacing.lg,
  },
  message: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    lineHeight: 22,
    fontWeight: theme.typography.fontWeight.medium,
  },
  infoBox: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: `rgba(80, 20, 184, 0.08)`,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: `rgba(111, 29, 210, 0.2)`,
  },
  infoText: {
    flex: 1,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
    backgroundColor: `rgba(96, 82, 203, 0.04)`,
  },
  footerActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
});

export default LogoutModal;
