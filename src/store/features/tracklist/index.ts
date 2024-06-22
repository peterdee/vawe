import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import * as types from 'types';

export interface TracklistState {
  queue: string[];
  tracks: types.ParsedFile[];
}

const initialState: TracklistState = {
  queue: [],
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
    addTrackMetadata: (
      state,
      action: PayloadAction<{ id: string, metadata: types.Metadata | null }>,
    ) => {
      state.tracks = state.tracks.map((track: types.ParsedFile): types.ParsedFile => {
        if (track.id === action.payload.id) {
          track.metadata = action.payload.metadata;
        }
        return track;
      });
    },
    clearTracklist: (state) => {
      state.tracks = [];
    },
    toggleQueueTrack: (state, action: PayloadAction<string>) => {
      if (!state.queue) {
        state.queue = [];
      }
      if (state.queue.includes(action.payload)) {
        state.queue = state.queue.filter((id: string): boolean => id !== action.payload);
      } else {
        state.queue = [
          ...state.queue,
          action.payload,
        ];
      }
    },
    removeTrack: (state, action: PayloadAction<string>) => {
      state.queue = state.queue.filter(
        (id: string): boolean => id !== action.payload, 
      )
      state.tracks = state.tracks.filter(
        (track: types.ParsedFile): boolean => track.id !== action.payload,
      );
    },
  },
});

export const {
  addTrack,
  addTrackMetadata,
  clearTracklist,
  removeTrack,
  toggleQueueTrack,
} = tracklistSlice.actions;

export default tracklistSlice.reducer;
