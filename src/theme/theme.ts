type ThemeMode = 'dark' | 'light' | 'custom';

/** Google Sans (weights 400, 500, 600 only). Loaded at app startup via expo-font. */
export const fontFamily = {
  regular: 'GoogleSans_400Regular',
  medium: 'GoogleSans_500Medium',
  semiBold: 'GoogleSans_600SemiBold',
} as const;

const baseFamily = fontFamily.medium;

const spacingScale = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
};

const shared = {
  spacing: spacingScale,
  radius: {
    sm: 12,
    md: 16,
    lg: 20,
    xl: 26,
  },
};

const dark = {
  mode: 'dark' as const,
  colors: {
    background: '#272B2F',
    surface: '#1E2327',
    surfaceStrong: '#1A1F23',
    surfaceSecondary: 'rgba(30,35,39,0.86)',
    elevated: '#2A3036',
    accent: '#99FF32',
    accentSoft: 'rgba(153,255,50,0.14)',
    textPrimary: '#F8FAFC',
    textSecondary: '#C1CAD6',
    muted: '#7D8797',
    border: 'rgba(255,255,255,0.08)',
    black: '#000000',
    warning: '#E6B85C',
    info: '#8A93A6',
    purpleMuted: '#7F72E3',
    amberSoft: '#CFA55B',
  },
  gradient: {
    colors: [
      'rgba(153,255,50,0.16)',
      'rgba(153,255,50,0.07)',
      'rgba(153,255,50,0.03)',
      '#272B2F',
    ],
    locations: [0, 0.2, 0.35, 0.55] as number[],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
};

const light = {
  mode: 'light' as const,
  colors: {
    background: '#F4F6FA',
    surface: 'rgba(255,255,255,0.72)',
    surfaceStrong: '#FFFFFF',
    surfaceSecondary: 'rgba(238,242,247,0.92)',
    elevated: '#E6EBF3',
    accent: '#0A5BE0',
    accentSoft: 'rgba(10,91,224,0.12)',
    textPrimary: '#0B101A',
    textSecondary: '#4A5568',
    muted: '#6B7280',
    border: 'rgba(15,23,42,0.08)',
    black: '#000000',
    warning: '#C57A1B',
    info: '#5B6474',
    purpleMuted: '#6F64D9',
    amberSoft: '#D3A45E',
  },
  gradient: {
    colors: [
      'rgba(10,91,224,0.14)',
      'rgba(10,91,224,0.06)',
      'rgba(10,91,224,0.03)',
      '#F4F6FA',
    ],
    locations: [0, 0.2, 0.35, 0.55] as number[],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
};

const createTypography = (colors: { textPrimary: string; textSecondary: string; muted: string; accent: string; black: string }) => ({
  fontFamily: baseFamily,

  screenTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: 28,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },

  balance: {
    fontFamily: fontFamily.semiBold,
    fontSize: 30,
    fontWeight: '600' as const,
    color: colors.accent,
    letterSpacing: 0.4,
  },

  sectionTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },

  body: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },

  bodySecondary: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },

  label: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },

  small: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.muted,
  },

  button: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.black,
  },
});

const buildTheme = (palette: typeof dark | typeof light) => {
  const { colors } = palette;
  return {
    ...shared,
    mode: palette.mode,
    colors,
    typography: createTypography(colors),
  card: {
    borderRadius: shared.radius.lg,
    padding: 18,
    backgroundColor: colors.surface,
    borderWidth: 0.5,
    borderColor: colors.border,
    shadowColor: '#5D8F70',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  button: {
    height: 52,
    borderRadius: shared.radius.md,
    gradient: [colors.accent, colors.accent],
    color: colors.black,
    paddingHorizontal: 20,
    shadowColor: colors.accent,
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  progress: {
    track: 'rgba(255,255,255,0.08)',
    fill: colors.accent,
    height: 8,
    radius: 8,
    },
    input: {
      background: palette.mode === 'dark' ? 'rgba(14,18,28,0.9)' : '#F2F5FA',
      borderColor: colors.border,
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: 14,
      focusBorder: colors.accent,
      focusGlow: '0 0 0 2px rgba(153,255,50,0.15)',
    },
    bottomNav: {
      background: palette.mode === 'dark' ? '#0F131B' : '#FFFFFF',
      active: colors.accent,
      inactive: palette.mode === 'dark' ? '#7A859F' : '#6B7280',
    },
    gradient: palette.gradient,
  };
};

export type Theme = ReturnType<typeof buildTheme>;
export type ThemeModeOption = ThemeMode;

const themes = {
  dark: buildTheme(dark),
  light: buildTheme(light),
};

export const getTheme = (mode: ThemeModeOption): Theme => {
  if (mode === 'light') return themes.light;
  return themes.dark;
};

export const defaultTheme = themes.dark;

// Legacy exports for older components
export const colors = defaultTheme.colors;
export const spacing = defaultTheme.spacing;
export const typography = defaultTheme.typography;
export const card = defaultTheme.card;
export const button = defaultTheme.button;
export const progress = defaultTheme.progress;
export const input = defaultTheme.input;
export const bottomNav = defaultTheme.bottomNav;
export const gradient = defaultTheme.gradient;
