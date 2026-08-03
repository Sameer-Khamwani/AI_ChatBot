import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';

export const apiErrorHandler: Middleware = () => next => action => {
  if (isRejectedWithValue(action)) {
    const payload: any = action.payload;
    const message =
      payload?.data?.message ||
      payload?.error ||
      payload?.message ||
      'Something went wrong';
    Toast.show({
      type: 'error',
      text1: 'Request failed',
      text2: String(message),
    });
  }
  return next(action);
};
