import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import * as types from 'types';

export interface TracklistState {
  tracks: types.ParsedFile[];
}

const initialState: TracklistState = {
  tracks: [],
};

export const tracklistSlice = createSlice({
  initialState,
  name: 'tracklist',
  reducers: {
    addTrack: (state, action: PayloadAction<types.ParsedFile>) => {
      state.tracks = [
        ...state.tracks,
        action.payload,
      ];
    },
    clearTracklist: (state) => {
      state.tracks = [];
    },
    removeTrack: (state, action: PayloadAction<string>) => {
      state.tracks = state.tracks.filter(
        (track: types.ParsedFile): boolean => track.id !== action.payload,
      );
    },
  },
});

export const {
  addTrack,
  clearTracklist,
  removeTrack,
} = tracklistSlice.actions;

export default tracklistSlice.reducer;
