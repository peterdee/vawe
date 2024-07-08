import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface PlaylistSettingsState {
  isLooped: boolean;
  showSettingsModal: boolean;
}

const initialState: PlaylistSettingsState = {
  isLooped: false,
  showSettingsModal: false,
};

export const playlistSettingsSlice = createSlice({
  initialState,
  name: 'playlistSettings',
  reducers: {
    changeLoop: (state, action: PayloadAction<boolean>) => {
      state.isLooped = action.payload;
    },
    changeShowSettingsModal: (state, action: PayloadAction<boolean>) => {
      state.showSettingsModal = action.payload;
    },
  },
});

export const {
  changeLoop,
  changeShowSettingsModal,
} = playlistSettingsSlice.actions;

export default playlistSettingsSlice.reducer;
