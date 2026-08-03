import {
  CommonActions,
  StackActions,
  createNavigationContainerRef,
} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

export const navigate = (name: string, params?: object) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};

export const goBack = () => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.goBack());
  }
};

export const navigateAndSimpleReset = (
  name: string,
  params?: object,
  index: number = 0,
) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index,
        routes: [{ name, params }],
      }),
    );
  }
};

export const navigateAndReplace = (name: string) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(name));
  }
};
