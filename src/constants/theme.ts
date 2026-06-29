export const Colors = {
  light: {
    primary: '#1B4332',
    primaryMid: '#2D6A4F',
    primaryLight: '#52B788',
    accent: '#74C69D',
    accentMuted: '#B7E4C7',
    accentSurface: '#D8F3DC',
    background: '#F0FFF4',
    surface: '#FFFFFF',
    surfaceAlt: '#F0FFF4',
    text: '#1A1A1A',
    textMuted: '#6B7280',
    textSubtle: '#9CA3AF',
    textOnPrimary: '#FFFFFF',
    textOnAccent: '#1B4332',
    border: '#B7E4C7',
    statusOk: '#52B788',
    statusSoon: '#F4A261',
    statusSoonSurface: '#FFF9F0',
    statusSoonBorder: '#F4A261',
    statusOverdue: '#E63946',
    statusOverdueSurface: '#FEE2E2',
    gradientStart: '#1B4332',
    gradientEnd: '#2D6A4F',
    gradientText: '#B7E4C7',
  },
  dark: {
    primary: '#52B788',
    primaryMid: '#40916C',
    primaryLight: '#2D6A4F',
    accent: '#74C69D',
    accentMuted: '#2D6A4F',
    accentSurface: '#1A3D2B',
    background: '#0D1F17',
    surface: '#1A2E22',
    surfaceAlt: '#0D1F17',
    text: '#F0FFF4',
    textMuted: '#9CA3AF',
    textSubtle: '#6B7280',
    textOnPrimary: '#0D1F17',
    textOnAccent: '#F0FFF4',
    border: '#2D6A4F',
    statusOk: '#52B788',
    statusSoon: '#F4A261',
    statusSoonSurface: '#2A1F0F',
    statusSoonBorder: '#F4A261',
    statusOverdue: '#E63946',
    statusOverdueSurface: '#3A1010',
    gradientStart: '#0D1F17',
    gradientEnd: '#1A2E22',
    gradientText: '#52B788',
  },
}

export type ColorScheme = 'light' | 'dark'
export type ThemeColors = (typeof Colors)['light']

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
}

export const Radius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  full: 999,
}

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardSm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  menu: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
}
