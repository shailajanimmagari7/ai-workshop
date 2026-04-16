import { Platform } from 'react-native';

export const Colors = {
  dark: {
    background: '#0a0a0a',
    surface: '#1a1a1a',
    surfaceElevated: '#242424',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    textTertiary: '#606060',
    tint: '#ffffff',
    accent: '#6366f1',
    accentSecondary: '#818cf8',
    border: '#2a2a2a',
    borderLight: '#333333',
    error: '#ef4444',
    success: '#22c55e',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#ffffff',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};
