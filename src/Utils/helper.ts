import { Dimensions, PixelRatio, Platform, StatusBar } from 'react-native';
import { initialWindowMetrics } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const widthBaseScale: number = SCREEN_WIDTH / 390;
const heightBaseScale: number = SCREEN_HEIGHT / 844;

function normalize(size: number, based: 'width' | 'height' = 'width'): number {
  const newSize =
    based === 'height' ? size * heightBaseScale : size * widthBaseScale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export const heightPixel = (size: number): number => {
  return normalize(size, 'height');
};

export const widthPixel = (size: number): number => {
  return normalize(size, 'width');
};

export const font = (size: number): number => {
  return heightPixel(size);
};

export const STATUSBAR_HEIGHT =
  (Platform.OS === 'ios'
    ? initialWindowMetrics?.insets.top
    : StatusBar.currentHeight) || 0;

export const BOTTOMBAR_HEIGHT = heightPixel(66);

export const vh = (SCREEN_HEIGHT - STATUSBAR_HEIGHT) * 0.01;
export const vw = SCREEN_WIDTH * 0.01;

export const HEADER_HEIGHT = vh * 9 + STATUSBAR_HEIGHT;
export const PAGE_WIDTH = vw * 100;

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
};
