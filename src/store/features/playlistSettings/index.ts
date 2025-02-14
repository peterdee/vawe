import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface PlaylistSettingsState {
  isLooped: boolean;
}

const initialState: PlaylistSettingsState = {
  isLooped: false,
};

export const playlistSettingsSlice = createSlice({
  initialState,
  name: 'playlistSettings',
  reducers: {
    changeLoop: (state, action: PayloadAction<boolean>) => {
      state.isLooped = action.payload;
    },
  },
});

export const { changeLoop } = playlistSettingsSlice.actions;

export default playlistSettingsSlice.reducer;
