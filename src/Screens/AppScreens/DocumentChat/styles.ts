import { StyleSheet } from 'react-native';
import { heightPixel, widthPixel } from '../../../Utils/helper';
import colors from '../../../Utils/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  docBanner: {
    paddingHorizontal: widthPixel(16),
    paddingVertical: heightPixel(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.darkButton,
    gap: heightPixel(2),
  },
  listContent: {
    paddingHorizontal: widthPixel(16),
    paddingVertical: heightPixel(12),
    flexGrow: 1,
  },
  typing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(8),
    paddingVertical: heightPixel(8),
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: widthPixel(12),
    paddingVertical: heightPixel(10),
    borderTopWidth: 1,
    borderTopColor: colors.darkButton,
    backgroundColor: colors.primaryBackground,
    gap: widthPixel(8),
  },
  input: {
    flex: 1,
    minHeight: heightPixel(44),
    maxHeight: heightPixel(120),
    borderWidth: 1,
    borderColor: colors.lightText,
    borderRadius: heightPixel(22),
    paddingHorizontal: widthPixel(16),
    paddingVertical: heightPixel(10),
    color: colors.white,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: heightPixel(22),
    paddingHorizontal: widthPixel(16),
    height: heightPixel(44),
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: {
    opacity: 0.5,
  },
  suggestionsRow: {
    paddingVertical: heightPixel(8),
    gap: widthPixel(8),
  },
  suggestionChip: {
    backgroundColor: colors.lightPrimaryBackground,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: heightPixel(20),
    paddingHorizontal: widthPixel(14),
    paddingVertical: heightPixel(8),
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: widthPixel(24),
  },
  notFoundTitle: {
    marginBottom: heightPixel(8),
    textAlign: 'center',
  },
  notFoundSubtitle: {
    marginBottom: heightPixel(20),
    textAlign: 'center',
    lineHeight: heightPixel(20),
  },
  notFoundButton: {
    width: '100%',
  },
});
