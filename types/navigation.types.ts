import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

// ==================== ROOT STACK ====================
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  CreateModal: undefined;
  SearchScreen: undefined;
  ChatStack: undefined;
  JournalStack: undefined;
  RequestScreen: undefined;
  // ADD THESE FOR CROSS-STACK NAVIGATION
  HomeScreen: undefined;
  CommunityDetailScreen: {
    communityId: string;
    communityName: string;
  };
  CreatePostScreen: undefined; // ✅ ADD THIS
};

// ==================== AUTH STACK ====================
export type AuthStackParamList = {
  WelcomeScreen: undefined;
  LoginScreen: undefined;
  SignupScreen: undefined;
  IDGenerationScreen: {
    email: string;
    name: string;
  };
  ForgotPasswordScreen: undefined;
  // ADD THESE FOR NAVIGATION AFTER AUTH
  HomeScreen: undefined;
  Main: undefined;
};

// ==================== TAB NAVIGATOR ====================
export type TabParamList = {
  HomeTab: undefined;
  CommunityTab: undefined;
  CreateTab: undefined;
  AITab: undefined;
  SettingsTab: undefined;
};

// ==================== HOME STACK ====================
export type HomeStackParamList = {
  HomeScreen: undefined;
};

// ==================== COMMUNITY STACK ====================
export type CommunityStackParamList = {
  CommunityHomeScreen: undefined;
  CommunityDetailScreen: {
    communityId: string;
    communityName: string;
  };
};

// ==================== CHAT STACK ====================
export type ChatStackParamList = {
  ChatHomeScreen: undefined;
  ChatScreen: {
    chatId: string;
    userName: string;
  };
};

// ==================== JOURNAL STACK ====================
export type JournalStackParamList = {
  JournalHomeScreen: undefined;
  JournalDetailScreen: {
    journalId: string;
  };
};

// ==================== AI CHAT STACK ====================
export type AIChatStackParamList = {
  AIChatScreen: undefined;
};

// ==================== CREATE STACK ====================
export type CreateStackParamList = {
  CreatePostScreen: undefined;
  CreateCommunityScreen: undefined;
  UploadMediaScreen: {
    mediaUris: string[];
    onComplete: (editedMedia: string[]) => void;
  };
};

// ==================== NAVIGATION PROPS ====================

// Root Navigator
export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Auth Stack (can navigate to Root)
export type AuthNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<AuthStackParamList>,
  RootNavigationProp
>;

// Tab Navigator
export type TabNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  RootNavigationProp
>;

// Home Stack
export type HomeStackNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList>,
  TabNavigationProp
>;

// Community Stack
export type CommunityStackNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<CommunityStackParamList>,
  TabNavigationProp
>;

// Chat Stack
export type ChatStackNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<ChatStackParamList>,
  RootNavigationProp
>;

// Journal Stack
export type JournalStackNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<JournalStackParamList>,
  RootNavigationProp
>;

// AI Chat Stack
export type AIChatStackNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<AIChatStackParamList>,
  TabNavigationProp
>;

// Create Stack (can navigate to Root)
export type CreateStackNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<CreateStackParamList>,
  RootNavigationProp
>;

// ==================== ROUTE PROPS ====================

export type AuthScreenRouteProp<T extends keyof AuthStackParamList> = RouteProp<
  AuthStackParamList,
  T
>;

export type CommunityScreenRouteProp<T extends keyof CommunityStackParamList> = RouteProp<
  CommunityStackParamList,
  T
>;

export type ChatScreenRouteProp<T extends keyof ChatStackParamList> = RouteProp<
  ChatStackParamList,
  T
>;

export type JournalScreenRouteProp<T extends keyof JournalStackParamList> = RouteProp<
  JournalStackParamList,
  T
>;

export type CreateScreenRouteProp<T extends keyof CreateStackParamList> = RouteProp<
  CreateStackParamList,
  T
>;

// ==================== DECLARE GLOBAL ====================
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
