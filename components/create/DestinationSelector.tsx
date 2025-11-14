import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Icon from '@/components/ui/Icon';
import { theme } from '@/utils/theme';

export interface Destination {
  id: string;
  name: string;
  type: 'home' | 'joined' | 'created';
  isPrivate?: boolean;
}

interface DestinationSelectorProps {
  destinations: Destination[];
  selected: string;
  onSelect: (id: string) => void;
}

const AnimatedView = Animated.View;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const DestinationSelector: React.FC<DestinationSelectorProps> = ({
  destinations,
  selected,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownScale = useSharedValue(0);
  const selectedDestination = destinations.find((d) => d.id === selected);

  const getIcon = (type: Destination['type']) => {
    switch (type) {
      case 'home':
        return 'Home';
      case 'joined':
        return 'Users';
      case 'created':
        return 'Star';
    }
  };

  const dropdownAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dropdownScale.value }],
    opacity: dropdownScale.value,
  }));

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsOpen(!isOpen);
    dropdownScale.value = withSpring(isOpen ? 0 : 1, { damping: 12 });
  };

  const handleSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(id);
    setIsOpen(false);
    dropdownScale.value = withSpring(0, { damping: 12 });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Post to</Text>

      {/* Trigger */}
      <AnimatedPressable
        onPress={handleToggle}
        style={({ pressed }) => [
          styles.trigger,
          pressed && styles.triggerPressed,
        ]}
      >
        <View style={styles.triggerContent}>
          <View style={styles.iconWrapper}>
            <Icon
              name={getIcon(selectedDestination?.type || 'home')}
              color={theme.colors.interactive.primary}
              size={18}
              strokeWidth={2}
            />
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.triggerLabel}>
              {selectedDestination?.type === 'home'
                ? selectedDestination.name
                : `c/${selectedDestination?.name || 'Select'}`}
            </Text>
            {selectedDestination?.isPrivate && (
              <Text style={styles.privateLabel}>Private</Text>
            )}
          </View>
        </View>
        <Icon
          name={isOpen ? 'ChevronUp' : 'ChevronDown'}
          color={theme.colors.text.secondary}
          size={20}
        />
      </AnimatedPressable>

      {/* Dropdown */}
      {isOpen && (
        <AnimatedView
          entering={FadeInDown.duration(200)}
          style={[styles.dropdown, dropdownAnimatedStyle]}
        >
          {destinations.map((destination, index) => (
            <Animated.View
              key={destination.id}
              entering={FadeInDown.delay(index * 30).duration(200)}
            >
              <AnimatedPressable
                onPress={() => handleSelect(destination.id)}
                style={({ pressed }) => [
                  styles.option,
                  destination.id === selected && styles.optionActive,
                  pressed && styles.optionPressed,
                ]}
              >
                <View style={styles.optionIconWrapper}>
                  <Icon
                    name={getIcon(destination.type)}
                    color={
                      destination.id === selected
                        ? theme.colors.interactive.primary
                        : theme.colors.text.secondary
                    }
                    size={18}
                  />
                </View>

                <View style={styles.optionTextWrapper}>
                  <Text
                    style={[
                      styles.optionText,
                      destination.id === selected && styles.optionTextActive,
                    ]}
                  >
                    {destination.type === 'home'
                      ? destination.name
                      : `c/${destination.name}`}
                  </Text>
                  {destination.isPrivate && (
                    <View style={styles.privateBadge}>
                      <Icon
                        name="Lock"
                        color={theme.colors.interactive.primary}
                        size={12}
                      />
                      <Text style={styles.privateBadgeText}>Private</Text>
                    </View>
                  )}
                </View>

                {destination.id === selected && (
                  <Icon
                    name="Check"
                    color={theme.colors.interactive.primary}
                    size={20}
                  />
                )}
              </AnimatedPressable>
            </Animated.View>
          ))}
        </AnimatedView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
    zIndex: 100,
  },
  label: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    letterSpacing: 0.2,
  },
  trigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.bg.secondary,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  triggerPressed: {
    backgroundColor: theme.colors.bg.tertiary,
    borderColor: theme.colors.interactive.primary,
  },
  triggerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `rgba(20, 184, 166, 0.1)`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrapper: {
    flex: 1,
    gap: 2,
  },
  triggerLabel: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  privateLabel: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.xs,
  },
  dropdown: {
    backgroundColor: theme.colors.bg.secondary,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    marginTop: theme.spacing.xs,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  optionActive: {
    backgroundColor: `rgba(20, 184, 166, 0.08)`,
  },
  optionPressed: {
    backgroundColor: theme.colors.bg.tertiary,
  },
  optionIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `rgba(20, 184, 166, 0.08)`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextWrapper: {
    flex: 1,
    gap: 4,
  },
  optionText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
  },
  optionTextActive: {
    color: theme.colors.interactive.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  privateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    backgroundColor: `rgba(20, 184, 166, 0.1)`,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
  },
  privateBadgeText: {
    color: theme.colors.interactive.primary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});

export default DestinationSelector;
