import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { DEFAULT_SERVER_ADDRESS } from '../../../../constants';

export interface AppSettingsState {
  remoteEnabled: boolean;
  serverAddress: string;
}

const initialState: AppSettingsState = {
  remoteEnabled: true,
  serverAddress: DEFAULT_SERVER_ADDRESS,
};

export const appSettingsSlice = createSlice({
  initialState,
  name: 'appSettings',
  reducers: {
    changeRemoteEnabled: (state, action: PayloadAction<boolean>) => {
      state.remoteEnabled = action.payload;
    },
    changeServerAddress: (state, action: PayloadAction<string>) => {
      state.serverAddress = action.payload;
    },
  },
});

export const {
  changeRemoteEnabled,
  changeServerAddress,
} = appSettingsSlice.actions;

export default appSettingsSlice.reducer;
