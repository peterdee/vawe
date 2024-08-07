import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { DEFAULT_SERVER_ADDRESS } from '../../../../constants';

export interface AppSettingsState {
  passwordHash: string;
  passwordProtectionEnabled: boolean;
  remoteEnabled: boolean;
  serverAddress: string;
}

const initialState: AppSettingsState = {
  passwordHash: '',
  passwordProtectionEnabled: false,
  remoteEnabled: true,
  serverAddress: DEFAULT_SERVER_ADDRESS,
};

export const appSettingsSlice = createSlice({
  initialState,
  name: 'appSettings',
  reducers: {
    changePasswordHash: (state, action: PayloadAction<string>) => {
      state.passwordHash = action.payload;
    },
    changePasswordProtection: (state, action: PayloadAction<boolean>) => {
      state.passwordProtectionEnabled = action.payload;
    },
    changeRemoteEnabled: (state, action: PayloadAction<boolean>) => {
      state.remoteEnabled = action.payload;
    },
    changeServerAddress: (state, action: PayloadAction<string>) => {
      state.serverAddress = action.payload;
    },
  },
});

export const {
  changePasswordHash,
  changePasswordProtection,
  changeRemoteEnabled,
  changeServerAddress,
} = appSettingsSlice.actions;

export default appSettingsSlice.reducer;
