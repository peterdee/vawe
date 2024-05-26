import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type PlaybackStates = 'isPlaying' | 'paused' | 'stopped';

export interface PlaybackState {
  currentTrack: string;
  playbackState: PlaybackStates;
}

const initialState: PlaybackState = {
  currentTrack: '',
  playbackState: 'stopped',
}

export const playbackSlice = createSlice({
  initialState,
  name: 'playback',
  reducers: {
    changeCurrentTrack: (state, action: PayloadAction<string>) => {
      state.currentTrack = action.payload;
    },
    stopPlayback: (state) => {
      state.playbackState = 'stopped';
    },
    togglePlaybackState: (state) => {
      state.playbackState = state.playbackState === 'isPlaying'
        ? 'paused'
        : 'isPlaying';
    },
  },
});

export const {
  changeCurrentTrack,
  stopPlayback,
  togglePlaybackState,
} = playbackSlice.actions;

export default playbackSlice.reducer;
