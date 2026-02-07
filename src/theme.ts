// ZenPae Design System - LOCKED SPECIFICATIONS

export const COLORS = {
  // Base
  background: '#272B2F',
  cardBackground: '#1E1E1E',
  
  // Primary Accent
  zenGreen: '#99FF32',
  
  // Secondary Accents (contextual)
  mutedPurple: '#A78BFA',
  softAmber: '#FFA726',
  teal: '#1FA2A6',
  
  // AI Assistant Condition Colors
  veryChill: '#6EE7B7',
  chill: '#99FF32',
  neutral: '#B6E35C',
  mildConcern: '#E6B85C',
  concerning: '#E07A5F',
  critical: '#C84C4C',
  
  // Wealth Stack Colors
  digitalGold: '#FFD700',
  liquidFunds: '#1FA2A6',
  fd: '#99FF32',
  insurance: '#FFA726',
  intelligence: '#A78BFA',
  
  // Borders & Overlays
  borderDark: 'rgba(255,255,255,0.08)',
  borderLight: 'rgba(0,0,0,0.08)',
  overlay: 'rgba(0,0,0,0.6)',
  
  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.7)',
  textTertiary: 'rgba(255,255,255,0.5)',
};

export const TYPOGRAPHY = {
  // Font Family: Google Sans / Product Sans
  fontFamily: {
    regular: 'GoogleSans-Regular',
    medium: 'GoogleSans-Medium',
    semibold: 'GoogleSans-SemiBold',
  },
  
  // Font Sizes
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 40,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const SHADOWS = {
  card: {
    shadowColor: '#99FF32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  elevated: {
    shadowColor: '#99FF32',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
};

export const BORDERS = {
  width: 0.5,
  color: COLORS.borderDark,
};
