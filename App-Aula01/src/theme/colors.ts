// src/theme/colors.ts

export const colors = {
  primary: '#4F6EF7',
  primaryDark: '#2F45C5',
  secondary: '#7EC8E3',
  background: '#0F1035',
  card: 'rgba(255,255,255,0.12)',
  cardBorder: 'rgba(255,255,255,0.25)',
  white: '#FFFFFF',
  textLight: 'rgba(255,255,255,0.75)',
  danger: '#FF6B6B',
  success: '#4ADE80',
  inputBackground: 'rgba(255,255,255,0.15)',
};

export const gradients = {
  auth: ['#2F45C5', '#4F6EF7', '#7EC8E3'] as const,
  day: ['#4F6EF7', '#7EC8E3', '#B4E4FF'] as const,
  night: ['#0F1035', '#2F2E7C', '#4F6EF7'] as const,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
  full: 999,
};