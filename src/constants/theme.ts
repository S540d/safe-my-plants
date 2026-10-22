import { brandFonts, brandHeader, brandPalette as P, brandShape } from './brandPalette'

export const Colors = {
  light: {
    primary: P.light.forest,
    primaryMid: P.light.forestMid,
    primaryLight: P.light.leaf,
    accent: P.light.terracotta,
    accentMuted: P.light.sage,
    accentSurface: P.light.sageSurface,
    background: P.light.paper,
    surface: P.light.surface,
    surfaceAlt: P.light.surfaceAlt,
    text: P.light.text,
    textMuted: P.light.textMuted,
    textSubtle: P.light.textSubtle,
    textOnPrimary: P.light.onForest,
    textOnAccent: P.light.forest,
    border: P.light.border,
    statusOk: P.light.statusOk,
    statusSoon: P.light.statusSoon,
    statusSoonSurface: P.light.statusSoonSurface,
    statusSoonBorder: P.light.statusSoon,
    statusOverdue: P.light.statusOverdue,
    statusOverdueSurface: P.light.statusOverdueSurface,
    terracottaSurface: P.light.terracottaSurface,
    gradientStart: brandHeader.light.background,
    gradientEnd: brandHeader.light.background,
    gradientText: brandHeader.light.subtitle,
    headerTitle: brandHeader.light.title,
  },
  dark: {
    primary: P.dark.forest,
    primaryMid: P.dark.forestMid,
    primaryLight: P.dark.leaf,
    accent: P.dark.terracotta,
    accentMuted: P.dark.sage,
    accentSurface: P.dark.sageSurface,
    background: P.dark.paper,
    surface: P.dark.surface,
    surfaceAlt: P.dark.surfaceAlt,
    text: P.dark.text,
    textMuted: P.dark.textMuted,
    textSubtle: P.dark.textSubtle,
    textOnPrimary: P.dark.onForest,
    textOnAccent: P.dark.forest,
    border: P.dark.border,
    statusOk: P.dark.statusOk,
    statusSoon: P.dark.statusSoon,
    statusSoonSurface: P.dark.statusSoonSurface,
    statusSoonBorder: P.dark.statusSoon,
    statusOverdue: P.dark.statusOverdue,
    statusOverdueSurface: P.dark.statusOverdueSurface,
    terracottaSurface: P.dark.terracottaSurface,
    gradientStart: brandHeader.dark.background,
    gradientEnd: brandHeader.dark.background,
    gradientText: brandHeader.dark.subtitle,
    headerTitle: brandHeader.dark.title,
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
  lg: brandShape.radiusControl,
  xl: brandShape.radiusCard,
  full: brandShape.radiusPill,
}

export const Fonts = brandFonts

export const Typography = {
  headerTitle: { fontSize: 28, fontFamily: brandFonts.display },
  headerTitleSm: { fontSize: 22, fontFamily: brandFonts.display },
  title: { fontSize: 18, fontFamily: brandFonts.display },
  sectionTitle: { fontSize: 20, fontFamily: brandFonts.display },
}

export const Shadow = {
  card: {
    shadowColor: '#2B2418',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 2,
  },
  cardSm: {
    shadowColor: '#2B2418',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  menu: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
}
