import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Pressable,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Icon from '@/components/ui/Icon';
import JournalCard, { Journal } from '@/components/journal/JournalCard';
import { theme } from '@/utils/theme';

const MOCK_JOURNALS: Journal[] = [
  {
    id: '1',
    title: 'My First Entry',
    content:
      'This is a preview of my first journal entry. I\'m excited to start this journey of self-reflection and growth...',
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
    updatedAt: new Date(Date.now() - 3600000),
    hasAudio: false,
    hasMedia: true,
  },
  {
    id: '2',
    title: 'A Day to Remember',
    content: 'Today was a really special day, and I want to capture every moment. It started with a beautiful sunrise...',
    createdAt: new Date(Date.now() - 10800000), // 3 hours ago
    updatedAt: new Date(Date.now() - 10800000),
    hasAudio: true,
    hasMedia: true,
  },
  {
    id: '3',
    title: 'Feeling Grateful',
    content: 'I\'m taking a moment to reflect on all the things I\'m grateful for today. Sometimes it\'s the small moments that matter most...',
    createdAt: new Date(Date.now() - 86400000), // Yesterday
    updatedAt: new Date(Date.now() - 86400000),
    hasAudio: false,
    hasMedia: false,
  },
  {
    id: '4',
    title: 'Thoughts on the Go',
    content: 'Quick thoughts while waiting for the bus. Sometimes the best insights come when you least expect them...',
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    updatedAt: new Date(Date.now() - 172800000),
    hasAudio: true,
    hasMedia: true,
  },
];

const AnimatedView = Animated.View;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const JournalHomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [journals, setJournals] = useState<Journal[]>(MOCK_JOURNALS);

  const handleCreateNew = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('JournalDetailScreen' as never, { journalId: 'new' } as never);
  }, [navigation]);

  const handleJournalPress = useCallback(
    (journal: Journal) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate('JournalDetailScreen' as never, { journalId: journal.id } as never);
    },
    [navigation]
  );

  const renderJournal = useCallback(
    ({ item, index }: { item: Journal; index: number }) => (
      <AnimatedView
        entering={FadeInDown.delay(index * 100).duration(400)}
      >
        <JournalCard journal={item} onPress={handleJournalPress} />
      </AnimatedView>
    ),
    [handleJournalPress]
  );

  const keyExtractor = useCallback((item: Journal) => item.id, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Header */}
        <AnimatedView
          entering={FadeIn.duration(300)}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Journal</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
  <Pressable
  onPress={handleCreateNew}
  style={[
    {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: theme.colors.interactive.primary,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
    }
  ]}
>
  <Icon name="Plus" color="#FFFFFF" size={20} strokeWidth={2.5} />
  <Text style={styles.newEntryText}>New Entry</Text>
</Pressable>

</View>
        </AnimatedView>

        {/* Journal List */}
        <FlatList
          data={journals}
          renderItem={renderJournal}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {/* FAB */}
 <Pressable
  onPress={handleCreateNew}
  style={[
    {
      position: 'absolute',
      bottom: 24,
      right: 24,
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.interactive.primary,
      justifyContent: 'center',
      alignItems: 'center',
    }
  ]}
>
  <Icon name="Plus" color="#FFFFFF" size={28} strokeWidth={3} />
</Pressable>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1110ff', // Dark green-grey background
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 9,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontStyle: 'italic',
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  newEntryButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  newEntryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100, // Space for FAB
  },
  fabPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.95 }],
  },
});

export default JournalHomeScreen;
