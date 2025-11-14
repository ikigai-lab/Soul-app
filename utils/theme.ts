import { Platform } from 'react-native';

export const theme = {
  colors: {
    // Background colors - professional dark theme
    bg: {
      primary: '#0A0E0F',      // Very dark background (main screens)
      secondary: '#1A1F1E',    // Slightly lighter (cards, inputs)
      tertiary: '#232B29',     // Card backgrounds
      elevated: '#2D3432',     // Input fields, elevated surfaces
      header: '#E8E8E8',       // Light grey header bar
      drawer: '#1E2B29',       // Drawer/sidebar background
      chatOther: '#2D3748',    // Other user's message bubble
      navBar: '#1A1F1E',       // Bottom navigation bar
    },
    
    // Primary colors - professional and modern
    primary: {
      teal: '#4CAF50',         // Teal/green for active states
      tealLight: '#66BB6A',    // Lighter teal
      tealDark: '#388E3C',     // Darker teal
      green: '#68D391',        // Green for user messages
      greenLight: '#6EE7B7',   // Light green accent
      mint: '#70E0A0',         // Mint green
      purple: '#6A0DAD',       // Purple accent
    },
    
    // Text colors
    text: {
      primary: '#FFFFFF',      // Main white text
      secondary: '#A0A0A0',    // Light grey (placeholders, timestamps)
      tertiary: '#6B706E',     // Medium grey
      muted: '#CCCCCC',        // Light grey
      dark: '#1A1F1E',         // Dark text on light backgrounds
      header: '#000000',       // Dark text on light header
      timestamp: '#A0AEC0',    // Timestamp color
    },
    
    // Borders
    border: {
      default: '#2A3A38',      // Separator lines
      subtle: '#404040',       // Very subtle dividers
      input: '#A0A0A0',        // Input borders
      focus: '#4CAF50',        // Focus state
      light: '#D0D0D0',        // Light border for header
    },
    
    // Interactive elements
    interactive: {
      primary: '#6A0DAD',      // Primary teal buttons
      primaryHover: '#6B706E'+'20',
      secondary: '#6A0DAD',    // Purple buttons
      secondaryHover: '#5A0D9D',
      mint: '#70E0A0',         // Mint green buttons
      mintHover: '#60D090',
      danger: '#EF4444',       // Red/delete
      success: '#10B981',      // Green/success
    },
    
    // Message bubbles
    chat: {
      user: '#68D391',         // User message bubble (light green)
      other: '#2D3748',        // Other user message bubble (dark grey)
      ai: '#E0E0E0',           // AI message bubble (light grey)
      aiText: '#000000',       // AI message text (dark)
    },
    
    // Avatar colors
    avatar: {
      user: '#4CAF50',         // Green for user avatar
      ai: '#E0E0E0',           // Light grey for AI avatar
    },
    
    // Overlays
    overlay: 'rgba(10, 14, 15, 0.95)',
    backdrop: 'rgba(0, 0, 0, 0.6)',
  },
  
  // Spacing system (4px/8px increments)
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
  },
  
  // Border radius
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
  },
  
  // Typography
  typography: {
    fontFamily: {
      regular: Platform.select({
        ios: 'System',
        android: 'Roboto',
        default: 'System',
      }),
      medium: Platform.select({
        ios: 'System',
        android: 'Roboto-Medium',
        default: 'System',
      }),
      bold: Platform.select({
        ios: 'System',
        android: 'Roboto-Bold',
        default: 'System',
      }),
    },
    
    fontSize: {
      xs: 12,
      sm: 14,
      base: 15,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 28,
      huge: 32,
    },
    
    fontWeight: {
      normal: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
    
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  // Shadows
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 5,
    },
    drawer: {
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
  },
  
  animation: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
  
  sizes: {
    avatar: {
      xs: 24,
      sm: 32,
      md: 40,
      lg: 56,
      xl: 80,
    },
    icon: {
      sm: 18,
      md: 20,
      lg: 24,
      xl: 28,
    },
    button: {
      sm: 32,
      md: 44,
      lg: 52,
    },
  },
};

export type Theme = typeof theme;
