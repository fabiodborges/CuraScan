export const colors = {
  // Primary
  background: '#080808',
  accent: '#D4FF00',
  accentDark: '#B8E000',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.45)',
  textMuted: 'rgba(255, 255, 255, 0.25)',

  // UI
  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.12)',
  cardBackground: 'rgba(255, 255, 255, 0.04)',
  cardBackgroundHover: 'rgba(255, 255, 255, 0.08)',
  inputBackground: 'rgba(255, 255, 255, 0.06)',

  // Status
  success: '#00E676',
  error: '#FF4444',
  warning: '#FFB300',
  info: '#2196F3',

  // Specific
  online: '#00E676',
  offline: '#FF4444',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export const fonts = {
  heading: {
    bold: 'Montserrat_700Bold',
    black: 'Montserrat_900Black',
  },
  body: {
    light: 'DMSans_300Light',
    regular: 'DMSans_400Regular',
    medium: 'DMSans_500Medium',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 36,
} as const;
