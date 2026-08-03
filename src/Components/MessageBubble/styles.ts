import { StyleSheet } from 'react-native';
import { heightPixel, widthPixel } from '../../Utils/helper';
import colors from '../../Utils/theme';

export const styles = StyleSheet.create({
  bubble: {
    maxWidth: '82%',
    borderRadius: heightPixel(16),
    paddingHorizontal: widthPixel(14),
    paddingVertical: heightPixel(10),
    marginVertical: heightPixel(4),
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.userBubble,
    borderBottomRightRadius: heightPixel(4),
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.assistantBubble,
    borderBottomLeftRadius: heightPixel(4),
    borderWidth: 1,
    borderColor: colors.darkButton,
  },
  text: {
    lineHeight: heightPixel(20),
  },
  sources: {
    marginTop: heightPixel(8),
    paddingTop: heightPixel(8),
    borderTopWidth: 1,
    borderTopColor: colors.darkButton,
  },
  sourcesLabel: {
    marginBottom: heightPixel(6),
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: widthPixel(6),
  },
  chip: {
    backgroundColor: colors.primary,
    borderRadius: heightPixel(12),
    paddingHorizontal: widthPixel(10),
    paddingVertical: heightPixel(4),
  },
});
