import React , { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Icon from '@/components/ui/Icon';
import { theme } from '@/utils/theme';

export interface CommunityItem {
  id: string;
  name: string;
  isPrivate: boolean;
  memberCount?: number;
  icon?: string;
  iconColor?: string;
}

interface CommunitySidebarProps {
  joinedCommunities: CommunityItem[];
  createdCommunities: CommunityItem[];
  onCommunityPress: (community: CommunityItem) => void;
  activeCommunityId?: string;
  onClose?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.View;

const CommunitySidebar: React.FC<CommunitySidebarProps> = ({
  joinedCommunities,
  createdCommunities,
  onCommunityPress,
  activeCommunityId,
  onClose,
}) => {
  const handleCommunityPress = (community: CommunityItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCommunityPress(community);
    onClose?.();
  };

  const [expandedSections, setExpandedSections] = useState({
  joined: true,
  created: true,
});


  const getCommunityIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('mindful')) return { icon: 'Leaf', bg: '#E0EEDD', iconColor: '#304030' };
    if (lowerName.includes('creative')) return { icon: 'Brain', bg: '#7FC0B0', iconColor: '#205040' };
    if (lowerName.includes('fitness')) return { icon: 'Activity', bg: '#F0F0E0', iconColor: '#404030' };
    if (lowerName.includes('stoic')) return { icon: 'Building', bg: '#508070', iconColor: '#A0C0B0' };
    return { icon: 'Users', bg: '#2D3432', iconColor: '#FFFFFF' };
  };

  const CommunityItemComponent = ({ community, index }: { community: CommunityItem; index: number }) => {
    const isActive = community.id === activeCommunityId;
    const iconData = getCommunityIcon(community.name);

    return (
      <AnimatedView
        entering={FadeInDown.delay(index * 50).duration(300)}
      >
        <Pressable
          onPress={() => handleCommunityPress(community)}
          style={({ pressed }) => [
            styles.communityItem,
            pressed && styles.communityItemPressed,
          ]}
        >
          <View style={styles.communityRow}>
          {/* Community Icon */}
          <View style={[styles.communityIcon, { backgroundColor: iconData.bg }]}>
            <Icon 
              name={iconData.icon as any} 
              color={iconData.iconColor} 
              size={15} 
              strokeWidth={2} 
            />
          </View>

          {/* Community Name */}
          <Text
            style={[
              styles.communityName,
              isActive && styles.communityNameActive,
            ]}
            numberOfLines={1}
          >
            {community.name}
          </Text>
          </View>
        </Pressable>
      </AnimatedView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <View style={styles.closeButtonContainer}>
        <Pressable
          onPress={onClose}
          style={({ pressed }) => [
            styles.closeButton,
            pressed && styles.closeButtonPressed,
          ]}
        >
          <Icon name="X" color="#FFFFFF" size={24} strokeWidth={2} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
{/* JOINED COMMUNITIES Section */}
<View style={styles.section}>
  <Pressable
    onPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setExpandedSections(prev => ({ ...prev, joined: !prev.joined }));
    }}
    style={styles.sectionHeaderContainer}
  >
    <Text style={styles.sectionHeader}>JOINED COMMUNITIES</Text>
  </Pressable>
  
  {expandedSections.joined && (
    <View style={styles.sectionContent}>
      {joinedCommunities.length > 0 ? (
        joinedCommunities.map((community, index) => (
          <CommunityItemComponent key={community.id} community={community} index={index} />
        ))
      ) : (
        <Text style={styles.emptyText}>No joined communities</Text>
      )}
    </View>
  )}
</View>

{/* CREATED COMMUNITIES Section */}
<View style={styles.section}>
  <Pressable
    onPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setExpandedSections(prev => ({ ...prev, created: !prev.created }));
    }}
    style={styles.sectionHeaderContainer}
  >
    <Text style={styles.sectionHeader}>CREATED COMMUNITIES</Text>
  </Pressable>
  
  {expandedSections.created && (
    <View style={styles.sectionContent}>
      {createdCommunities.length > 0 ? (
        createdCommunities.map((community, index) => (
          <CommunityItemComponent key={community.id} community={community} index={index} />
        ))
      ) : (
        <Text style={styles.emptyText}>No created communities</Text>
      )}
    </View>
  )}

</View>
</ScrollView>
</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.drawer,
    width: '140%', // Approximately 60-65% of screen width
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    ...theme.shadows.drawer,
  },
  sectionHeaderContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 8,
},
closeButtonContainer: {
    paddingTop: 20,
    paddingRight: 20,
    alignItems: 'flex-end',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  closeButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    color: '#9E9E9E',// Light grey
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  communityRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 16,
  flex: 1,
  paddingVertical: 2,
},
  sectionContent: {
    gap: 0,
  },
  communityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 0,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A3A38', 
  },
  communityItemPressed: {
    opacity: 0.7,
  },
  communityIcon: {
    width: 30,
    height: 30,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  communityName: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  communityNameActive: {
    fontWeight: '600',
  },
  emptyText: {
    color: '#808080',
    fontSize: 14,
    fontStyle: 'italic',
    paddingVertical: 16,
  },
});

export default CommunitySidebar;
