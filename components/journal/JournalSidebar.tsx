import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SectionList,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Icon from '@/components/ui/Icon';
import { theme } from '@/utils/theme';
import { Journal } from './JournalCard';

interface JournalSidebarProps {
  journals: Journal[];
  activeJournalId?: string;
  onJournalSelect: (journal: Journal) => void;
}

const AnimatedView = Animated.View;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const JournalSidebar: React.FC<JournalSidebarProps> = ({
  journals,
  activeJournalId,
  onJournalSelect,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    recent: true,
    archived: true,
  });

  const toggleSection = (section: 'recent' | 'archived') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const recentJournals = journals.filter(
    (j) => new Date().getTime() - j.updatedAt.getTime() < 7 * 24 * 60 * 60 * 1000
  );
  const olderJournals = journals.filter(
    (j) => new Date().getTime() - j.updatedAt.getTime() >= 7 * 24 * 60 * 60 * 1000
  );

  const SectionHeader = ({
    title,
    icon,
    count,
    isExpanded,
    onPress,
  }: {
    title: string;
    icon: string;
    count: number;
    isExpanded: boolean;
    onPress: () => void;
  }) => (
    <AnimatedView entering={FadeIn.duration(300)}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.sectionHeader,
          pressed && styles.sectionHeaderPressed,
        ]}
      >
        <View style={styles.sectionHeaderContent}>
          <Icon name={icon} color={theme.colors.text.primary} size={18} />
          <Text style={styles.sectionTitle}>{title}</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        </View>
        <Icon
          name={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          color={theme.colors.text.secondary}
          size={20}
        />
      </Pressable>
    </AnimatedView>
  );

  const JournalItem = ({ journal, index }: { journal: Journal; index: number }) => {
    const isActive = journal.id === activeJournalId;

    return (
      <AnimatedView
        entering={FadeInDown.delay(index * 50).duration(300)}
      >
        <AnimatedPressable
          onPress={() => onJournalSelect(journal)}
          style={({ pressed }) => [
            styles.journalItem,
            isActive && styles.journalItemActive,
            pressed && styles.journalItemPressed,
          ]}
        >
          <View style={styles.journalItemContent}>
            <Text
              style={[
                styles.journalTitle,
                isActive && styles.journalTitleActive,
              ]}
              numberOfLines={1}
            >
              {journal.title || 'Untitled'}
            </Text>
            <Text style={styles.journalDate} numberOfLines={1}>
              {journal.updatedAt.toLocaleDateString()}
            </Text>
          </View>
          {isActive && <View style={styles.activeIndicator} />}
        </AnimatedPressable>
      </AnimatedView>
    );
  };

  const EmptyState = ({ icon, title }: { icon: string; title: string }) => (
    <View style={styles.emptyState}>
      <Icon name={icon} color={theme.colors.text.tertiary} size={32} />
      <Text style={styles.emptyText}>{title}</Text>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Recent Section */}
      <View style={styles.section}>
        <SectionHeader
          title="Recent"
          icon="Clock"
          count={recentJournals.length}
          isExpanded={expandedSections.recent}
          onPress={() => toggleSection('recent')}
        />

        {expandedSections.recent && (
          <AnimatedView entering={FadeInDown.duration(300)}>
            <View style={styles.sectionContent}>
              {recentJournals.length > 0 ? (
                recentJournals.map((journal, index) => (
                  <JournalItem key={journal.id} journal={journal} index={index} />
                ))
              ) : (
                <EmptyState icon="FileText" title="No recent journals" />
              )}
            </View>
          </AnimatedView>
        )}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Older Section */}
      <View style={styles.section}>
        <SectionHeader
          title="Earlier"
          icon="Archive"
          count={olderJournals.length}
          isExpanded={expandedSections.archived}
          onPress={() => toggleSection('archived')}
        />

        {expandedSections.archived && (
          <AnimatedView entering={FadeInDown.duration(300)}>
            <View style={styles.sectionContent}>
              {olderJournals.length > 0 ? (
                olderJournals.map((journal, index) => (
                  <JournalItem key={journal.id} journal={journal} index={index} />
                ))
              ) : (
                <EmptyState icon="Archive" title="No archived journals" />
              )}
            </View>
          </AnimatedView>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
  contentContainer: {
    paddingVertical: theme.spacing.md,
  },
  section: {
    marginVertical: theme.spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  sectionHeaderPressed: {
    opacity: 0.6,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  sectionTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    letterSpacing: 0.2,
  },
  countBadge: {
    backgroundColor: `rgba(20, 184, 166, 0.12)`,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
    minWidth: 28,
    alignItems: 'center',
  },
  countText: {
    color: theme.colors.interactive.primary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  sectionContent: {
    gap: theme.spacing.xs,
  },
  journalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
  },
  journalItemActive: {
    backgroundColor: `rgba(20, 184, 166, 0.1)`,
    borderWidth: 1,
    borderColor: `rgba(20, 184, 166, 0.2)`,
  },
  journalItemPressed: {
    opacity: 0.7,
  },
  journalItemContent: {
    flex: 1,
    gap: 2,
  },
  journalTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  journalTitleActive: {
    color: theme.colors.interactive.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  journalDate: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.xs,
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.interactive.primary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.default,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  emptyText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    textAlign: 'center',
  },
});

export default JournalSidebar;
