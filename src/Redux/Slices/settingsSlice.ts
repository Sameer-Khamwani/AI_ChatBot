import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  useRealApi: boolean;
  apiKeyHint: string;
}

const initialState: SettingsState = {
  useRealApi: false,
  apiKeyHint: '',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setUseRealApi: (state, action: PayloadAction<boolean>) => {
      state.useRealApi = action.payload;
    },
    setApiKeyHint: (state, action: PayloadAction<string>) => {
      state.apiKeyHint = action.payload;
    },
  },
});

export const { setUseRealApi, setApiKeyHint } = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
export default settingsSlice;
