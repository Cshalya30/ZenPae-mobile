export const colors = {
  background: '#0E1117',
  surface: '#161B26',
  surfaceSecondary: '#1A1F2B',
  elevated: '#131722',
  accent: '#99FF32',
  textPrimary: '#FFFFFF',
  textSecondary: '#AAB3C5',
  muted: '#6B7280',
  border: 'rgba(255,255,255,0.05)',
  black: '#000000',

  // Semantic colors
  warning: '#F59E0B',
  info: '#94A3B8',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

const baseFamily =
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export const typography = {
  fontFamily: baseFamily,

  screenTitle: {
    fontFamily: baseFamily,
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.textPrimary,
  },

  balance: {
    fontFamily: baseFamily,
    fontSize: 30,
    fontWeight: '700' as const,
    color: colors.accent,
  },

  sectionTitle: {
    fontFamily: baseFamily,
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },

  body: {
    fontFamily: baseFamily,
    fontSize: 15,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },

  bodySecondary: {
    fontFamily: baseFamily,
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },

  label: {
    fontFamily: baseFamily,
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },

  small: {
    fontFamily: baseFamily,
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.muted,
  },

  button: {
    fontFamily: baseFamily,
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.black,
  },
};

export const card = {
  borderRadius: 20,
  padding: 22,
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderColor: colors.border,
  shadowColor: '#000000',
  shadowOpacity: 0.45,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 8 },
  elevation: 8,
  boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
};

export const button = {
  height: 52,
  borderRadius: 16,
  backgroundColor: colors.accent,
  gradient: ['#99FF32', '#7DDB22'],
  color: colors.black,
  paddingHorizontal: 20,
  font: typography.button,
  shadowColor: '#99FF32',
  shadowOpacity: 0.25,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 6 },
  elevation: 6,
  boxShadow: '0 4px 20px rgba(153,255,50,0.25)',
};

export const progress = {
  track: 'rgba(255,255,255,0.05)',
  fill: colors.accent,
  height: 8,
  radius: 8,
};

export const input = {
  background: '#11151F',
  borderColor: 'rgba(255,255,255,0.06)',
  borderRadius: 14,
  paddingVertical: 14,
  paddingHorizontal: 14,
  focusBorder: colors.accent,
  focusGlow: '0 0 0 2px rgba(153,255,50,0.15)',
};

export const bottomNav = {
  background: '#12161F',
  active: colors.accent,
  inactive: '#7A859F',
};

// Gradient system for Blinkit-style top glow effect
export const gradient = {
  colors: [
    'rgba(153,255,50,0.18)',
    'rgba(153,255,50,0.08)',
    'rgba(153,255,50,0.03)',
    '#0E1117',
  ],
  locations: [0, 0.2, 0.35, 0.55],
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
};
