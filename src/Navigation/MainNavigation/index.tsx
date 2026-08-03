import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { FC } from 'react';
import AddDocument from '../../Screens/AppScreens/AddDocument';
import DocumentChat from '../../Screens/AppScreens/DocumentChat';
import DocumentLibrary from '../../Screens/AppScreens/DocumentLibrary';
import Settings from '../../Screens/AppScreens/Settings';
import { navigationRef } from '../../Utils/navigation';
import colors from '../../Utils/theme';
import NavigationOptions from '../NavigationOptions';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.primaryBackground,
  },
};

const Stack = createStackNavigator();

const MainNavigation: FC = () => {
  return (
    <NavigationContainer ref={navigationRef} theme={MyTheme}>
      <Stack.Navigator
        initialRouteName="DocumentLibrary"
        screenOptions={NavigationOptions as any}>
        <Stack.Screen name="DocumentLibrary" component={DocumentLibrary} />
        <Stack.Screen name="AddDocument" component={AddDocument} />
        <Stack.Screen name="DocumentChat" component={DocumentChat} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigation;
