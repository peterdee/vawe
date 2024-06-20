import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface PlaylistSettingsState {
  isLooped: boolean;
  isShuffled: boolean;
}

const initialState: PlaylistSettingsState = {
  isLooped: true,
  isShuffled: false,
};

export const playlistSettingsSlice = createSlice({
  initialState,
  name: 'playlistSettings',
  reducers: {
    changeLoop: (state, action: PayloadAction<boolean>) => {
      state.isLooped = action.payload;
    },
    changeShuffle: (state, action: PayloadAction<boolean>) => {
      state.isShuffled = action.payload;
    },
  },
});

export const {
  changeLoop,
  changeShuffle,
} = playlistSettingsSlice.actions;

export default playlistSettingsSlice.reducer;
