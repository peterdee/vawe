import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface PlaybackSettingsState {
  currentTrackId: string;
  isPlaying: boolean;
}

const initialState: PlaybackSettingsState = {
  currentTrackId: '',
  isPlaying: false,
};

export const playbackSlice = createSlice({
  initialState,
  name: 'playbackSettings',
  reducers: {
    changeCurrentTrackId: (state, action: PayloadAction<string>) => {
      state.currentTrackId = action.payload;
    },
    changeIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
  },
});

export const {
  changeCurrentTrackId,
  changeIsPlaying,
} = playbackSlice.actions;

export default playbackSlice.reducer;
