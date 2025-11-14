import React, { useState } from 'react';
import { View, StyleSheet,Pressable } from 'react-native';
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
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import Icon from '@/components/ui/Icon';
import { theme } from '@/utils/theme';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}

const AnimatedView = Animated.View;

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [understood, setUnderstood] = useState(false);

  const handleConfirm = () => {
    if (password.trim() && understood) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      onConfirm(password);
      setPassword('');
      setUnderstood(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setShowPassword(false);
    setUnderstood(false);
    onClose();
  };

  const isValid = password.trim() && understood;

  return (
    <AlertDialog isOpen={isOpen} onClose={handleClose}>
      <AlertDialogBackdrop />
      <AlertDialogContent style={styles.alertContent}>
        {/* Header */}
        <AnimatedView entering={FadeIn.duration(300)}>
          <AlertDialogHeader style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.warningIcon}>
                <Icon
                  name="TriangleAlert"
                  color={theme.colors.interactive.danger}
                  size={24}
                />
              </View>
              <Heading size="lg" style={styles.title}>
                Delete Account
              </Heading>
            </View>
          </AlertDialogHeader>
        </AnimatedView>

        {/* Body */}
        <AlertDialogBody style={styles.body}>
          <AnimatedView entering={FadeInDown.duration(400)} style={styles.content}>
            {/* Warning Message */}
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                This action cannot be undone. All your data will be permanently
                deleted.
              </Text>
            </View>

            {/* Info Items */}
            <View style={styles.infoBox}>
              <View style={styles.infoItem}>
                <Icon
                  name="Trash2"
                  color={theme.colors.interactive.danger}
                  size={18}
                />
                <Text style={styles.infoText}>All posts deleted</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon
                  name="MessageSquare"
                  color={theme.colors.interactive.danger}
                  size={18}
                />
                <Text style={styles.infoText}>All messages deleted</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon
                  name="FileText"
                  color={theme.colors.interactive.danger}
                  size={18}
                />
                <Text style={styles.infoText}>All journals deleted</Text>
              </View>
            </View>

            {/* Password Confirmation */}
            <View style={styles.section}>
              <Text style={styles.label}>Confirm with your password:</Text>
              <View style={styles.inputWrapper}>
                <Input style={styles.input}>
                  <InputField
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    secureTextEntry={!showPassword}
                    style={styles.inputField}
                  />
                </Input>
              <Pressable
  onPress={() => setShowPassword(!showPassword)}
  style={styles.eyeButton}
>
  <Icon
    name={showPassword ? 'Eye' : 'EyeOff'}
    color={theme.colors.text.secondary}
    size={18}
  />
</Pressable>

              </View>
            </View>

            {/* Checkbox */}
            <Animated.View entering={FadeInDown.delay(100).duration(300)}>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setUnderstood(!understood);
                }}
                style={styles.checkboxContainer}
              >
                <View
                  style={[
                    styles.checkbox,
                    understood && styles.checkboxChecked,
                  ]}
                >
                  {understood && (
                    <Icon
                      name="Check"
                      color="#FFFFFF"
                      size={16}
                    />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>
                  I understand this action is irreversible
                </Text>
              </Pressable>
            </Animated.View>
          </AnimatedView>
        </AlertDialogBody>

        {/* Footer */}
        <AlertDialogFooter style={styles.footer}>
          <AnimatedView
            entering={FadeInDown.delay(200).duration(300)}
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
              style={[
                styles.button,
                !isValid && styles.buttonDisabled,
              ]}
            >
              <Icon
                name="Trash2"
                color={isValid ? '#dcc8c8ff' : theme.colors.text.secondary}
                size={18}
              />
              <ButtonText>Delete </ButtonText>
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
    maxWidth: 500,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.bg.primary,
    borderWidth: 1,
    borderColor: `rgba(239, 68, 68, 0.2)`,
  },
  header: {
    backgroundColor: `rgba(239, 68, 68, 0.08)`,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  warningIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `rgba(239, 68, 68, 0.15)`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.interactive.danger,
  },
  body: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  content: {
    gap: theme.spacing.lg,
  },
  warningBox: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: `rgba(239, 68, 68, 0.1)`,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: `rgba(239, 68, 68, 0.2)`,
  },
  warningText: {
    flex: 1,
    color: theme.colors.interactive.danger,
    fontSize: theme.typography.fontSize.sm,
    lineHeight: 20,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  infoBox: {
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.bg.secondary,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  infoText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    flex: 1,
  },
  section: {
    gap: theme.spacing.sm,
  },
  label: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
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
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  inputField: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
  },
  eyeButton: {
    position: 'absolute',
    right: theme.spacing.md,
    padding: theme.spacing.md,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.bg.secondary,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  checkbox: {
    width: 15,
    height: 15,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.border.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.interactive.danger,
    borderColor: theme.colors.interactive.danger,
  },
  checkboxLabel: {
    flex: 1,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
    backgroundColor: `rgba(239, 68, 68, 0.02)`,
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
  buttonDisabled: {
    opacity: 0.5,
  },
});

export default DeleteAccountModal;
