import React, { useState } from 'react';
import { View, StyleSheet,Pressable} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import Icon from '@/components/ui/Icon';
import { theme } from '@/utils/theme';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (currentPassword: string, newPassword: string) => void;
}

const AnimatedView = Animated.View;

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [error, setError] = useState('');

  const handleConfirm = () => {
    setError('');

    if (
      !currentPassword.trim() ||
      !newPassword.trim() ||
      !confirmPassword.trim()
    ) {
      setError('All fields are required');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onConfirm(currentPassword, newPassword);
    handleClose();
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setShowPassword({ current: false, new: false, confirm: false });
    onClose();
  };

  const isValid =
    currentPassword.trim() &&
    newPassword.trim() &&
    confirmPassword.trim() &&
    newPassword === confirmPassword &&
    newPassword.length >= 8;

  const PasswordField = ({
    label,
    value,
    onChange,
    type,
    showPwd,
    onToggleShow,
    placeholder,
  }: any) => (
    <AnimatedView entering={FadeInDown.duration(300)}>
      <View style={styles.section}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputWrapper}>
          <Input style={styles.input}>
            <InputField
              type={showPwd ? 'text' : 'password'}
              value={value}
              onChangeText={onChange}
              placeholder={placeholder || `Enter ${label.toLowerCase()}`}
              secureTextEntry={!showPwd}
              style={styles.inputField}
            />
          </Input>
  <Pressable
  onPress={onToggleShow}
  style={styles.eyeButton}
>
  <Icon
    name={showPwd ? 'Eye' : 'EyeOff'}
    color={theme.colors.text.secondary}
    size={18}
  />
</Pressable>

        </View>
      </View>
    </AnimatedView>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalBackdrop />
      <ModalContent style={styles.modalContent}>
        {/* Header */}
        <AnimatedView entering={FadeIn.duration(300)}>
          <ModalHeader style={styles.header}>
            <View style={styles.headerContent}>
              <Icon
                name="Lock"
                color={theme.colors.interactive.primary}
                size={20}
              />
              <Heading size="lg" style={styles.title}>
                Change Password
              </Heading>
            </View>
          </ModalHeader>
        </AnimatedView>

        {/* Body */}
        <ModalBody style={styles.body}>
          <AnimatedView entering={FadeInDown.delay(100).duration(300)}>
            <View style={styles.form}>
              <PasswordField
                label="Current Password"
                value={currentPassword}
                onChange={setCurrentPassword}
                showPwd={showPassword.current}
                onToggleShow={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    current: !prev.current,
                  }))
                }
              />

              <PasswordField
                label="New Password"
                value={newPassword}
                onChange={setNewPassword}
                showPwd={showPassword.new}
                onToggleShow={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    new: !prev.new,
                  }))
                }
              />

              <PasswordField
                label="Confirm New Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                showPwd={showPassword.confirm}
                placeholder="Confirm new password"
                onToggleShow={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }))
                }
              />

              {/* Error Message */}
              {error && (
                <AnimatedView
                  entering={FadeIn.duration(200)}
                  style={styles.errorContainer}
                >
                  <Icon
                    name="CircleAlert"
                    color={theme.colors.interactive.danger}
                    size={18}
                  />
                  <Text style={styles.errorText}>{error}</Text>
                </AnimatedView>
              )}

              {/* Password Requirements */}
              <AnimatedView
                entering={FadeInDown.delay(200).duration(300)}
                style={styles.requirementsBox}
              >
                <Text style={styles.requirementTitle}>Password must have:</Text>
                <View style={styles.requirement}>
                  <Icon
                    name="Check"
                    color={
                      newPassword.length >= 8
                        ? theme.colors.interactive.success
                        : theme.colors.text.tertiary
                    }
                    size={16}
                  />
                  <Text
                    style={[
                      styles.requirementText,
                      newPassword.length >= 8 &&
                        styles.requirementTextMet,
                    ]}
                  >
                    At least 8 characters
                  </Text>
                </View>
              </AnimatedView>
            </View>
          </AnimatedView>
        </ModalBody>

        {/* Footer */}
        <ModalFooter style={styles.footer}>
          <AnimatedView
            entering={FadeInDown.delay(300).duration(300)}
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
              disabled={!isValid}
              style={styles.button}
            >
              <Icon name="Check" color="#8b8181ff" size={18} />
              <ButtonText>Change</ButtonText>
            </Button>
          </AnimatedView>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    width: '90%',
    maxWidth: 500,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.bg.primary,
    borderWidth: 1,
    borderColor: `rgba(105, 20, 184, 0.2)`,
  },
  header: {
    backgroundColor: `rgba(122, 65, 226, 0.08)`,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
    paddingVertical: theme.spacing.sm,    // Add this for height
    paddingHorizontal: theme.spacing.sm, 
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  title: {
    color: theme.colors.text.primary,
  },
  body: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  form: {
    gap: theme.spacing.lg,
  },
  section: {
    gap: theme.spacing.sm,
  },
  label: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    letterSpacing: 0.2,
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.bg.secondary,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  inputField: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
  },
  eyeButton: {
    position: 'absolute',
    right: theme.spacing.md,
    padding: theme.spacing.sm,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: `rgba(239, 68, 68, 0.1)`,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: `rgba(239, 68, 68, 0.2)`,
  },
  errorText: {
    color: theme.colors.interactive.danger,
    fontSize: theme.typography.fontSize.sm,
    flex: 1,
  },
  requirementsBox: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: `rgba(127, 20, 184, 0.08)`,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: `rgba(127, 20, 184, 0.2)`,
    gap: theme.spacing.sm,
  },
  requirementTitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  requirementText: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.sm,
  },
  requirementTextMet: {
    color: theme.colors.interactive.success,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
    backgroundColor: `rgba(108, 20, 184, 0.04)`,
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

export default ChangePasswordModal;
