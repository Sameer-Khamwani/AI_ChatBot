const defaultColors = {
  primary: '#6366F1',
  darkPrimary: '#4F46E5',
  black: '#0F172A',
  blue: '#3B82F6',
  border: '#E2E8F0',
  lightBorder: '#CBD5E1',
  gray: '#64748B',
  white: '#FFFFFF',
  lightText: '#94A3B8',
  ModalBLur: '#00000070',
  cardColor: '#1E1B4B',
  buttonSecondary: '#818CF8',
  primaryBackground: '#0F172A',
  green: '#22C55E',
  red: '#EF4444',
  search: '#F1F5F9',
  optionsColor: '#C7D2FE',
  darkButton: '#1E293B',
  lightGray: '#94A3B8',
  timeCardColor: '#F5F9FE',
  lightBlue: '#6366F11A',
  lightRed: '#EF444426',
  lightGreen: '#22C55E26',
  lightPrimary: '#6366F126',
  chatCardColor: '#EEF2FF',
  lightProfile: '#EEF2FF',
  lightPrimaryBackground: '#1E293B',
  darkPrimaryBackground: '#020617',
  lightBlack: '#1E293B',
  yellow: '#F59E0B',
  overlay: 'rgba(0, 0, 0, 0.9)',
  userBubble: '#6366F1',
  assistantBubble: '#1E293B',
};

const hexToRgba = (hex: string, opacity: number): string => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const useColors = () => {
  const hexColor = defaultColors.primary;
  const lightPrimary = hexToRgba(hexColor, 0.15);
  return {
    ...defaultColors,
    lightPrimary,
  };
};

export const colors = defaultColors;
export default colors;
