import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import CustomText from '../../Components/CustomText';
import { goBack, navigate } from '../../Utils/navigation';
import colors from '../../Utils/theme';
import { widthPixel } from '../../Utils/helper';

const headerStyles = StyleSheet.create({
  back: {
    paddingHorizontal: widthPixel(8),
  },
  settings: {
    paddingHorizontal: widthPixel(12),
  },
});

const BackButton = () => (
  <TouchableOpacity onPress={goBack} style={headerStyles.back}>
    <CustomText
      text="← Back"
      size={14}
      color={colors.primary}
      weight="semibold"
    />
  </TouchableOpacity>
);

const routes = [
  {
    name: 'DocumentLibrary',
    title: 'DocuAsk',
    headerShown: true,
  },
  {
    name: 'AddDocument',
    title: 'Add Document',
    headerShown: true,
  },
  {
    name: 'DocumentChat',
    title: 'Document Chat',
    headerShown: true,
  },
  {
    name: 'Settings',
    title: 'Settings',
    headerShown: true,
  },
];

const NavigationOptions = ({ route }: any) => {
  const match = routes.find(r => r.name === route.name);
  return {
    title: match?.title ?? route.name,
    headerShown: match?.headerShown ?? true,
    headerStyle: {
      backgroundColor: colors.primaryBackground,
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
    headerTintColor: colors.white,
    headerTitleStyle: {
      fontWeight: '600' as const,
      color: colors.white,
    },
    headerLeft: () =>
      route.name === 'DocumentLibrary' ? null : <BackButton />,
    headerRight: () =>
      route.name === 'DocumentLibrary' ? (
        <TouchableOpacity
          onPress={() => navigate('Settings')}
          style={headerStyles.settings}>
          <CustomText text="Settings" size={13} color={colors.primary} />
        </TouchableOpacity>
      ) : null,
  };
};

export default NavigationOptions;
