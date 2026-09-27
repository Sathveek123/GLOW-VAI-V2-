import { TextStyle, Platform } from 'react-native';

// ============================================
// FONT FAMILY CONSTANTS
// Must match exactly what's registered in useFonts()
// ============================================
export const FontFamily = {
  displayBold: Platform.select({ web: "'Manrope-Bold', 'Inter', system-ui, sans-serif", default: 'Manrope-Bold' }),
  displaySemiBold: Platform.select({ web: "'Manrope-SemiBold', 'Inter', system-ui, sans-serif", default: 'Manrope-SemiBold' }),
  displayMedium: Platform.select({ web: "'Manrope-Medium', 'Inter', system-ui, sans-serif", default: 'Manrope-Medium' }),
  bodyRegular: Platform.select({ web: "'Inter-Regular', system-ui, sans-serif", default: 'Inter-Regular' }),
  bodyMedium: Platform.select({ web: "'Inter-Medium', system-ui, sans-serif", default: 'Inter-Medium' }),
  bodySemiBold: Platform.select({ web: "'Inter-SemiBold', system-ui, sans-serif", default: 'Inter-SemiBold' }),
  bodyBold: Platform.select({ web: "'Inter-Bold', system-ui, sans-serif", default: 'Inter-Bold' }),
} as const;

export interface TypographySizes {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  display: number;
  hero: number;
  splash: number;
}

export interface TypographyWeights {
  regular: '400';
  medium: '500';
  semibold: '600';
  bold: '700';
  black: '800';
}

// ============================================
// TYPOGRAPHY SCALE
// Every screen MUST import and spread these — 
// never hardcode fontSize/fontWeight/fontFamily inline
// ============================================
export const Typography: Record<string, any> = {
  displayXl: {
    fontFamily: FontFamily.displayBold,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: 0,
  },
  displayLg: {
    fontFamily: FontFamily.displayBold,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: 0,
  },
  headingLg: {
    fontFamily: FontFamily.displayBold,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: 0,
  },
  headingMd: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: 0,
  },
  headingSm: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0,
  },
  bodyLg: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0,
  },
  bodyMd: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0,
  },
  bodySm: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
  },
  labelMd: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 0.3,
  },
  labelSm: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  priceLg: {
    fontFamily: FontFamily.displayBold,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: 0,
  },
  priceMd: {
    fontFamily: FontFamily.displayBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0,
  },
  priceStrike: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: 13,
    lineHeight: 16,
    textDecorationLine: 'line-through',
  },
  numericMono: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 18,
    fontVariant: ['tabular-nums'],
  },
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    display: 30,
    hero: 34,
    splash: 52,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '800',
  },
};

export default Typography;
