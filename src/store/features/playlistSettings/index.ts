import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface PlaylistSettingsState {
  isLooped: boolean;
  showCoverModal: boolean;
  showSettingsModal: boolean;
}

const initialState: PlaylistSettingsState = {
  isLooped: false,
  showCoverModal: false,
  showSettingsModal: false,
};

export const playlistSettingsSlice = createSlice({
  initialState,
  name: 'playlistSettings',
  reducers: {
    changeLoop: (state, action: PayloadAction<boolean>) => {
      state.isLooped = action.payload;
    },
    changeShowCoverModal: (state, action: PayloadAction<boolean>) => {
      state.showCoverModal = action.payload;
    },
    changeShowSettingsModal: (state, action: PayloadAction<boolean>) => {
      state.showSettingsModal = action.payload;
    },
  },
});

export const {
  changeLoop,
  changeShowCoverModal,
  changeShowSettingsModal,
} = playlistSettingsSlice.actions;

export default playlistSettingsSlice.reducer;
